'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { useChat, Message } from 'ai/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Send, ExternalLink, MessageSquare, HelpCircle, Settings, Trash2 } from "lucide-react"
import { nanoid } from 'nanoid'
import ReactMarkdown from 'react-markdown'
import { motion, AnimatePresence } from 'framer-motion'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import sophiaConfig from './sophia-config.json'

const MAX_TOKENS = 16000
const CHARS_PER_TOKEN = 4
const MAX_CONTEXT_MESSAGES = 10
const SYSTEM_MESSAGE_TOKEN_ALLOWANCE = 2000

const estimateTokenCount = (text: string): number => {
  return Math.ceil(text.length / CHARS_PER_TOKEN)
}

const truncateSystemMessage = (systemMessage: string, maxTokens: number): string => {
  if (estimateTokenCount(systemMessage) <= maxTokens) return systemMessage

  const lines = systemMessage.split('\n')
  let truncatedMessage = ''
  let currentTokens = 0

  for (const line of lines) {
    const lineTokens = estimateTokenCount(line)
    if (currentTokens + lineTokens > maxTokens) break
    truncatedMessage += line + '\n'
    currentTokens += lineTokens
  }

  return truncatedMessage.trim()
}

const truncateHistory = (messages: Message[], maxTokens: number): Message[] => {
  let totalTokens = 0
  const truncatedMessages: Message[] = []

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i]
    const messageTokens = estimateTokenCount(message.content)
    
    if (totalTokens + messageTokens <= maxTokens && truncatedMessages.length < MAX_CONTEXT_MESSAGES) {
      truncatedMessages.unshift(message)
      totalTokens += messageTokens
    } else {
      break
    }
  }

  return truncatedMessages
}

const ThinkingIndicator = () => (
  <div className="flex items-center space-x-1">
    <motion.div
      className="w-2 h-2 bg-primary rounded-full"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
    />
    <motion.div
      className="w-2 h-2 bg-primary rounded-full"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 0.6, delay: 0.2, repeat: Infinity, repeatType: "reverse" }}
    />
    <motion.div
      className="w-2 h-2 bg-primary rounded-full"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 0.6, delay: 0.4, repeat: Infinity, repeatType: "reverse" }}
    />
  </div>
)

export default function Component() {
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isThinking, setIsThinking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(true)
  const { theme, setTheme } = useTheme()
  const [showIntroduction, setShowIntroduction] = useState(true)
  const [tokenCount, setTokenCount] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const truncatedSystemMessage = useMemo(() => {
    const fullSystemMessage = `
      Você é Sophia, uma assistente de TI amigável e prestativa da MMTech (departamento de TI das LojasMM). 
      
      ${sophiaConfig.instructions.sistemasDeAcesso}
      
      ${sophiaConfig.departamentos.map(dept => `
        ${dept.nome}:
        - ${dept.descricao}
        - Atividades: ${dept.atividades.join(', ')}
        - Link: ${dept.linkChamado}
      `).join('\n')}
      
      ${sophiaConfig.wikiInterna.map(doc => `
        ${doc.assunto}:
        - Link: ${doc.link}
        - ${doc.descricao}
      `).join('\n')}
      
      ${sophiaConfig.diretrizes}
    `
    return truncateSystemMessage(fullSystemMessage, SYSTEM_MESSAGE_TOKEN_ALLOWANCE)
  }, [])

  const { messages, input, handleInputChange, handleSubmit, isLoading, append, setMessages } = useChat({
    api: '/api/chat',
    initialMessages: [
      { role: 'system', content: truncatedSystemMessage, id: nanoid() }
    ],
    onResponse: () => {
      setIsThinking(true)
    },
    onFinish: () => {
      setIsThinking(false)
      setIsSubmitting(false)
    },
  })

  const handleSuggestedQuestion = async (question: string) => {
    if (isSubmitting) return
    setShowSuggestions(false)
    setIsSubmitting(true)
    await append({
      role: 'user',
      content: question,
      id: nanoid(),
    })
    setIsSubmitting(false)
  }

  useEffect(() => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isThinking, autoScroll])

  const renderMessage = (message: Message) => {
    if (message.role === 'assistant') {
      return (
        <ReactMarkdown
          components={{
            a: ({ node, ...props }) => (
              <a
                {...props}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline inline-flex items-center"
              >
                {props.children}
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
      )
    }
    return <div>{message.content}</div>
  }

  const handleClearChat = () => {
    setMessages([])
    setShowSuggestions(true)
    setShowIntroduction(true)
  }

  const handleInputChangeWithValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e)
    setTokenCount(estimateTokenCount(e.target.value))
  }

  const handleSubmitWithValidation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitting) return
    if (input.trim() === '') {
      setError('Por favor, digite uma mensagem antes de enviar.')
      return
    }
    const estimatedTokens = estimateTokenCount(input)
    if (estimatedTokens > MAX_TOKENS) {
      setError(`Sua mensagem é muito longa. Por favor, reduza-a para menos de ${MAX_TOKENS} tokens estimados. (Atual: ${estimatedTokens})`)
      return
    }
    setError(null)
    setIsSubmitting(true)

    await append({
      role: 'user',
      content: input,
      id: nanoid(),
    })

    handleInputChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)
    setIsSubmitting(false)
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-full my-8 max-w-2xl mx-auto shadow-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardHeader className="text-center border-b flex justify-between items-center">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <MessageSquare className="w-8 h-8 text-primary" />
            Soph<span className="font-extrabold text-primary">IA</span>
          </h2>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <ScrollArea className="h-[400px] sm:h-[500px] pr-4 mb-4">
            <AnimatePresence>
              {showIntroduction && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-4 p-4 bg-primary/10 rounded-lg"
                >
                  <h3 className="text-lg font-semibold mb-2">Bem-vindo à SophIA! 👋</h3>
                  <p className="text-sm">
                    Sou sua assistente virtual de TI. Estou aqui para ajudar com problemas técnicos, 
                    fornecer instruções e orientar você na abertura de chamados quando necessário. 
                    Como posso te ajudar hoje?
                  </p>
                </motion.div>
              )}
              {messages.filter(m => m.role !== 'system').map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div className={`flex items-start max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                      <AvatarFallback>{message.role === 'user' ? 'U' : 'S'}</AvatarFallback>
                      {message.role === 'assistant' && (
                        <AvatarImage src="https://i.ibb.co/VS3r37v/SophIA.png" alt="Sophia" />
                      )}
                    </Avatar>
                    <div className={`mx-2 p-3 sm:p-4 rounded-lg text-sm sm:text-base ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground'
                    } shadow-md`}>
                      {renderMessage(message)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isThinking && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-start mb-4"
              >
                <div className="flex items-start max-w-[80%]">
                  <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                    <AvatarFallback>S</AvatarFallback>
                    <AvatarImage src="https://i.ibb.co/VS3r37v/SophIA.png" alt="Sophia" />
                  </Avatar>
                  <div className="mx-2 p-3 sm:p-4 rounded-lg bg-secondary text-secondary-foreground shadow-md">
                    <ThinkingIndicator />
                  </div>
                </div>
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-destructive mb-4 p-2 rounded-md bg-destructive/10"
              >
                {error}
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t py-4 flex-col space-y-4">
          <form onSubmit={handleSubmitWithValidation} className="flex w-full items-center space-x-2">
            <div className="relative flex-grow">
              <Input
                value={input}
                onChange={handleInputChangeWithValidation}
                placeholder="Digite sua mensagem..."
                className="pr-10 text-sm sm:text-base"
                disabled={isSubmitting}
              />
              <div className="absolute right-2 top-2 text-xs text-muted-foreground">
                ~{tokenCount}/{MAX_TOKENS}
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="submit" disabled={isLoading || isThinking || input.trim() === '' || tokenCount > MAX_TOKENS || isSubmitting} size="icon">
                    {isLoading || isThinking || isSubmitting ? (
                      <Loader2 className="h-4  w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    
                    <span className="sr-only">Enviar mensagem</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Enviar mensagem</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </form>
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <HelpCircle className="h-4 w-4" />
                    <span className="sr-only">Ajuda</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium  leading-none">Sobre a SophIA</h4>
                      <p className="text-sm text-muted-foreground">
                        SophIA é sua assistente virtual de TI. Ela pode ajudar com problemas técnicos, fornecer instruções e orientar na abertura de chamados.
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="width">Recursos:</Label>
                        <div className="col-span-2 flex flex-wrap gap-1">
                          <Badge variant="secondary">Suporte Técnico</Badge>
                          <Badge variant="secondary">Instruções</Badge>
                          <Badge variant="secondary">Abertura de Chamados</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MessageSquare className="h-4 w-4" />
                    <span className="sr-only">Sugestões</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Perguntas Sugeridas</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => handleSuggestedQuestion("Como alterar minha senha do Sabium?")}>
                    Como alterar minha senha do Sabium? 🔑
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleSuggestedQuestion("Não consigo acessar meu e-mail. O que faço?")}>
                    Não consigo acessar meu e-mail. O que faço? 📧
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleSuggestedQuestion("Como abrir um chamado no Nexus?")}>
                    Como abrir um chamado no Nexus? 🎫
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleSuggestedQuestion("Qual a diferença entre AD e Intranet?")}>
                    Qual a diferença entre AD e Intranet? 🤔
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleSuggestedQuestion("Como acessar o WebVendas?")}>
                    Como acessar o WebVendas? 🛒
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">Configurações</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Configurações</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div className="flex items-center">
                      <Switch
                        id="auto-scroll"
                        checked={autoScroll}
                        onCheckedChange={setAutoScroll}
                        className="mr-2"
                      />
                      <Label htmlFor="auto-scroll">Auto-scroll</Label>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleClearChat}
                    className="flex items-center space-x-2 px-3 py-2 text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Limpar Conversa</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Limpar conversa</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}