import { title } from "process";

// for page navigation & to sort on leftbar
export const ROUTES = [
  {
    title: "Bem vindo ao MMHub",
    href: "apresentacao",
    items: [
      { title: "Introdução", href: "/introducao" },
    ],
  },
  {
    title: "Documentações",
    href: "documentacoes",
    items: [
      { title: "Impressora Sabium", href: "/impressora-sabium" },
      { title: "Rádio MM", href: "/radiomm" },
      { title: "Verificar IP", href: "/verificar-ip" },
      { title: "Limpeza de Cache", href: "/limpeza-de-cache" },
      { title: "Alterar Senha AD", href: "/resetar-senha-ad"},
    ],
  },
  {
    title: "Setores x Responsabilidades",
    href: "setores",
    items: [
      { title: "Almoxarifado - Logística", href: "/almox-logistica" },
      { title: "Almoxarifado - TI", href: "/almox-ti" },
      { title: "CIEX", href: "/ciex" },
      { title: "Controladoria", href: "/controladoria" },
      { title: "Crédito", href: "/credito" },
      { title: "EndoMarketing", href: "/endomarketing" },
      { title: "Jurídico", href: "/juridico" },
    ],
  },

];

export const page_routes = ROUTES.map(({ href, items }) => {
  return items.map(link => {
    return {
      title: link.title,
      href: href + link.href,
    };
  });
}).flat();
