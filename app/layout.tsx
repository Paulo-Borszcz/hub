import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "MMHub: Sua Central de Documentação e Recursos.",
  metadataBase: new URL("https://nexus.lojasmm.com.br"),
  description:
    "This comprehensive documentation template, crafted with Next.js and available as open-source, delivers a sleek and responsive design, tailored to meet all your project documentation requirements.",
    openGraph: {
      title: 'MMHub: Sua Central de Documentação e Recursos',
      description: 'Explore, aprenda e aplique processos de maneira simplificada. Transforme a rotina da sua filial com acesso rápido e fácil a tudo que você precisa sobre TI.',
      images: [
        {
          url: 'https://i.ibb.co/Gn1XB5D/Frame-2.jpg',
          width: 1200,
          height: 630,
          alt: 'MMHub Preview',
        },
      ],
      url: 'https://http://10.102.13.122:3000/',
      siteName: 'MMHub',
      locale: 'pt_BR',
      type: 'website',
    }

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-regular`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="sm:container mx-auto w-[85vw] h-auto">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
