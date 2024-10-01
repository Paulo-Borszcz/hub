import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";
import starlightImageZoom from 'starlight-image-zoom'
import starlightGhostCMS from '@matthiesenxyz/starlight-ghostcms';
import starlightHeadingBadges from 'starlight-heading-badges'

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "MMHub",
      plugins: [starlightImageZoom(), starlightGhostCMS(
        {
          url: 'http://137.184.150.175',
          key: 'ec5913e856e6d7d13532f167a1'
        }
      ), starlightHeadingBadges()],
      components: {
        LastUpdated: './src/components/CustomLastUpdate.astro',
      },
      customCss: [
        "./src/tailwind.css",
      ],
      sidebar: [{
        label: "Guias",
        autogenerate: {
          directory: "guides"
        }
      }, 
      {
        label: "Entendendo nossos Sistemas",
        autogenerate: {
          directory: "sistemas"
        }
      },{
        label: "Abertura de Chamados",
        autogenerate: {
          directory: "chamados"
        }
      }, {
        label: "VOIP/Telefonia",
        autogenerate: {
          directory: "voip"
        }
      },
      {
        label: "Almox TV",
        autogenerate: {
          directory: "almox"
        }
      },
       {
        label: "Setores x Responsabilidade",
        autogenerate: {
          directory: "setores"
        }
      }]
    }),
    tailwind({
      // Desabilita os estilos base padrões:
      applyBaseStyles: false,
    }),

  ],
});
