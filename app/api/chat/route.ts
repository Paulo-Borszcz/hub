// app/api/chat/route.ts

import { Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const restrictedTopics = ['política', 'religião', 'assuntos sensíveis']
  const lastMessage = messages[messages.length - 1].content.toLowerCase()
  
  if (restrictedTopics.some(topic => lastMessage.includes(topic))) {
    return new Response('Desculpe, não posso discutir esse assunto.', { status: 400 })
  }

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      { role: 'system', content: 'Você é Sophia, uma assistente de TI amigável e prestativa. Você ajuda os usuários com problemas de TI e fornece informações sobre processos internos da empresa. Mantenha suas respostas concisas e diretas.' },
      ...messages
    ],
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}