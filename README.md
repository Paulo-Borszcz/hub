# MMHub

## Descrição

MMHub é um projeto interno e privado que serve como uma plataforma centralizada de conhecimento, combinando uma wiki com várias documentações e uma seção de blog. Construído com Next.js, o projeto visa fornecer uma experiência de usuário fluida e eficiente para acessar e gerenciar informações importantes da empresa.

## Características Principais

- Wiki com múltiplas seções de documentação
- Blog integrado para atualizações e artigos
- Sistema de busca unificado

## Instalação

1. Clone o repositório:
   ```
   git clone https://github.com/lojasmm/mmhub.git
   ```

2. Navegue até o diretório do projeto:
   ```
   cd documentation-template
   ```

3. Instale as dependências:
   ```
   npm install
   ```

4. Configure as variáveis de ambiente:
   - Crie um arquivo `.env.local` na raiz do projeto
   - Adicione as seguintes variáveis (substitua os valores conforme necessário):
     ```
     MONGODB_URI=sua_uri_do_mongodb
     ```

## Uso

1. Para iniciar o servidor de desenvolvimento:
   ```
   npm run dev
   ```

2. Para criar uma build de produção:
   ```
   npm run build
   ```

3. Para iniciar o servidor de produção:
   ```
   npm start
   ```

## API

O projeto utiliza uma API interna para gerenciar conteúdos da wiki, do blog, autores e posts:

- `/api/placeholder`: Geração de imagens placeholder
- `/api/authors`: Retorna a lista de autores
- `/api/posts`: Retorna a lista de posts
- `/api/posts-with-authors`: Retorna a lista de posts com informações dos autores

### API de Placeholder

A API de placeholder gera imagens dinâmicas com dimensões e texto personalizáveis.


## Banco de Dados

O projeto utiliza MongoDB para armazenar conteúdos da wiki, posts do blog e informações de usuários. A conexão é gerenciada através do arquivo `lib/mongodb.ts`.
