# La Pomba · Brandbook (site)

Manual de marca da La Pomba em formato de site, com uma página por capítulo, animações e a Gina como guia.
Identidade visual por **DGR Creative** (Diana Ribeiro · @dgr.creative).

## Estrutura

```
index.html            início
marca.html            01 · a marca
logo.html             02 · logo (com teste de fundo)
gina.html             03 · a Gina (giro 360° e filtro de humores)
cores.html            04 · cores (copiar código e gerador do degradê)
tipografia.html       05 · tipografia
elementos.html        06 · elementos e texturas (mesa de montagem)
aplicacao.html        07 · imagem e aplicação
voz.html              08 · tom de voz (tradutor de frases)
downloads.html        09 · downloads + agradecimento
404.html              página não encontrada
assets/css/style.css  todas as cores, fontes e estilos
assets/js/main.js     animações e interações
assets/img            imagens
assets/video          vídeos
assets/downloads      pacotes para baixar (logos, Gina, elementos, texturas, cores, PDF)
build/                gerador das páginas (não vai para o ar)
vercel.json           configuração da Vercel
```

## Como editar

O cabeçalho, o menu, o rodapé e a Gina guia são iguais em todas as páginas e ficam em `build/build.py`.
O conteúdo de cada página fica em `build/paginas/<pagina>.html`.

Depois de editar, gere as páginas de novo:

```
python3 build/build.py
```

Para trocar só um texto rápido, também dá para editar direto o `.html` da raiz (mas ele é sobrescrito na próxima geração).

As dicas que a Gina dá em cada página ficam no dicionário `DICAS` dentro de `build/build.py`.

## Publicar

- **Vercel:** importe este repositório em vercel.com/new (sem framework, sem comando de build). Cada atualização no GitHub publica sozinha.
- **Netlify:** arraste a pasta inteira em app.netlify.com/drop.
- **GitHub Pages:** Settings → Pages → Deploy from branch → `main` / raiz.

## Fontes

Patita e Berthold Block são fontes do Canva e não carregam na web sem licença própria. No site, os títulos usam a Fredoka como substituta. Se a licença web da Patita for adquirida, basta adicionar o `@font-face` no topo de `assets/css/style.css`: ela já é a primeira opção em `--f-titulo`.
