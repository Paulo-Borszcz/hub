import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, Laptop, ShoppingBag, Wifi } from "lucide-react"
import Search from "@/components/search"

export default function Home() {
  return (
    <div className="flex-1">
      <section className="w-full">
      <div className="h-[40rem] w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              MMHUB - Seu Portal de TI
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Tudo que você precisa saber sobre tecnologia na Lojas MM, explicado de forma simples.
            </p>
            <div className="w-full max-w-sm space-y-2">
              <Search />
            </div>
          </div>
        </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
            O que você precisa?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <ShoppingBag className="w-8 h-8 mb-2 text-primary" />
                <CardTitle>Sistemas da Loja</CardTitle>
                <CardDescription>Aprenda a usar os programas do dia a dia da loja.</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href="/docs/apresentacao/introducao" passHref>
                  <Button variant="outline" className="w-full">Ver Mais</Button>
                </Link>
              </CardFooter>
            </Card>
            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <Wifi className="w-8 h-8 mb-2 text-primary" />
                <CardTitle>Rede e Internet</CardTitle>
                <CardDescription>Dicas para manter sua loja sempre conectada.</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href="/docs/apresentacao/introducao" passHref>
                  <Button variant="outline" className="w-full">Ver Mais</Button>
                </Link>
              </CardFooter>
            </Card>
            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <Laptop className="w-8 h-8 mb-2 text-primary" />
                <CardTitle>Equipamentos</CardTitle>
                <CardDescription>Cuidados com computadores, impressoras e outros aparelhos.</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href="/docs/apresentacao/introducao" passHref>
                  <Button variant="outline" className="w-full">Ver Mais</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Precisa de Ajuda?</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Estamos aqui para ajudar você com qualquer problema de tecnologia na sua loja.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/sophia" passHref>
                  <Button className="w-full">
                    Falar com a Sophia
                    <HelpCircle className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="https://nexus.lojasmm.com.br/" target="_blank" passHref>
                  <Button variant="outline" className="w-full">Pedir Ajuda da TI</Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}