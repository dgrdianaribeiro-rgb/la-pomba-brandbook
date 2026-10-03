#!/usr/bin/env python3
"""Gera as páginas do site La Pomba Brandbook a partir de um modelo único.
Rode:  python3 build/build.py   (na raiz do projeto)
Cabeçalho, menu, rodapé e Gina guia ficam aqui; o conteúdo de cada página fica em build/paginas/*.html
"""
import json, os, html
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAG = os.path.join(RAIZ, 'build', 'paginas')

CAPS = [  # arquivo, título no menu, título da página
    ('index.html', 'Início', 'La Pomba · Brandbook'),
    ('marca.html', 'A marca', 'A marca · La Pomba Brandbook'),
    ('logo.html', 'Logo', 'Logo · La Pomba Brandbook'),
    ('gina.html', 'A Gina', 'A Gina · La Pomba Brandbook'),
    ('cores.html', 'Cores', 'Cores · La Pomba Brandbook'),
    ('tipografia.html', 'Tipografia', 'Tipografia · La Pomba Brandbook'),
    ('elementos.html', 'Elementos', 'Elementos e texturas · La Pomba Brandbook'),
    ('aplicacao.html', 'Aplicação', 'Imagem e aplicação · La Pomba Brandbook'),
    ('voz.html', 'Tom de voz', 'Tom de voz · La Pomba Brandbook'),
    ('downloads.html', 'Downloads', 'Downloads · La Pomba Brandbook'),
]

DICAS = {
    'index.html': ['oi, tesoro! eu sou a <b>Gina</b>. me clica quando quiser uma dica.', 'cada capítulo tem um pedacinho da marca. começa pela <b>marca</b> e vai descendo.', 'pressa? os arquivos prontos estão em <b>Downloads</b>.'],
    'marca.html': ['aqui mora a alma da La Pomba: <b>quem ela é e quem ela não é</b>.', 'na dúvida, pergunta: isso parece conversa de amiga? se não, não é a gente.'],
    'logo.html': ['testa a logo nos fundos ali embaixo: eu te digo se <b>pode ou não</b>.', '"la" e "pomba" andam sempre juntos. nunca separa o casal.'],
    'gina.html': ['essa sou eu! <b>arrasta</b> minha foto pra me ver girar.', 'filtra os humores pelo assunto do post e escolhe só <b>uma Gina por peça</b>.'],
    'cores.html': ['clica numa cor pra <b>copiar o código</b>.', 'oncinha é tempero: só 4% da peça, viu?'],
    'tipografia.html': ['Berthold grita, Patita conversa, Milne assina.', 'Berthold é sempre em <b>CAIXA ALTA</b> e no máximo 4 palavras.'],
    'elementos.html': ['monta um post ali na mesa: escolhe o fundo e <b>arrasta os acessórios</b>.', 'no máximo <b>dois acessórios</b> por peça. mais que isso vira bagunça.'],
    'aplicacao.html': ['passa o mouse nos números do pôster pra ver cada camada.', 'produto é objeto de desejo, nunca de vergonha.'],
    'voz.html': ['aperta "outra frase" e vê o jeito La Pomba de falar.', 'minúscula, ponto final e carinho. sempre.'],
    'downloads.html': ['tudo pronto pra baixar e usar. depois me conta como ficou!'],
    '404.html': ['ih, essa página voou. bora voltar pro início?'],
}
TCHAU = 'tchau, tesoro! nos vemos no próximo capítulo.'

VERSAO = '3'
AC = ' aria-current="page"'

def cabecalho(arquivo, titulo, descricao):
    itens = ''.join(
        f'<li><a href="/{a}"{AC if a == arquivo else ""}>{m}</a></li>' for a, m, _ in CAPS[1:])
    gav = ''.join(
        f'<li><a href="/{a}"{AC if a == arquivo else ""}>{m}</a></li>' for a, m, _ in CAPS)
    return f'''<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{html.escape(titulo)}</title>
<meta name="description" content="{html.escape(descricao)}">
<meta name="theme-color" content="#D41455">
<meta property="og:title" content="{html.escape(titulo)}">
<meta property="og:description" content="{html.escape(descricao)}">
<meta property="og:image" content="/assets/img/og.jpg">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="/assets/img/favicon.png">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fredoka:wght@500;600;700&display=swap">
<link rel="stylesheet" href="/assets/css/style.css?v={VERSAO}">
</head>
'''.rstrip('\n'), itens, gav

def pagina(arquivo, titulo, descricao, corpo, anterior=None, proximo=None):
    head, itens, gav = cabecalho(arquivo, titulo, descricao)
    dicas = json.dumps(DICAS.get(arquivo, []), ensure_ascii=False)
    nav_cap = ''
    if anterior or proximo:
        ha = (anterior[0] if anterior and anterior[0].startswith('/') else '/' + anterior[0]) if anterior else ''
        a = f'<a href="{ha}"><small>← capítulo anterior</small><b>{anterior[1]}</b></a>' if anterior else '<span></span>'
        p = f'<a class="seguinte" href="/{proximo[0]}"><small>próximo capítulo →</small><b>{proximo[1]}</b></a>' if proximo else ''
        nav_cap = f'<section class="sec" style="padding-top:0"><div class="wrap proximo revela">{a}{p}</div></section>'
    return f'''{head}
<body data-dicas='{html.escape(dicas, quote=True)}' data-tchau="{html.escape(TCHAU)}">
<a class="pular" href="#conteudo">Pular para o conteúdo</a>
<div class="progresso" aria-hidden="true"></div>
<header class="topo">
  <div class="wrap">
    <a class="marca" href="/" aria-label="La Pomba, início"><img src="/assets/img/logo_grad.png" alt="la pomba" width="120" height="42"></a>
    <nav aria-label="Capítulos"><ul class="menu">{itens}</ul></nav>
    <button class="abre-menu" aria-expanded="false" aria-controls="gaveta"><span aria-hidden="true"></span>menu</button>
  </div>
</header>
<div class="gaveta" id="gaveta" role="dialog" aria-modal="true" aria-label="Menu">
  <div class="linha-topo"><img src="/assets/img/la_pomba_branco.png" alt="la pomba"><button class="fecha">fechar</button></div>
  <ol>{gav}</ol>
  <img class="gina-gaveta" src="/assets/img/h_coracao.png" alt="">
</div>
<main id="conteudo">
{corpo}
{nav_cap}
</main>
<footer class="rodape">
  <div class="wrap">
    <div>
      <img class="logo-rodape" src="/assets/img/la_pomba_branco.png" alt="la pomba">
      <p style="margin-top:14px;max-width:34ch">Manual de marca da La Pomba, loja online de sex toys. Quem prova, não quer pousar.</p>
      <div class="assinatura"><img src="/assets/img/dgr_logo.png" alt="DGR Creative"><div><b>Identidade visual por DGR Creative</b><span>Diana Ribeiro · @dgr.creative</span></div></div>
    </div>
    <div><h4>Capítulos</h4><ul>{''.join(f'<li><a href="/{a}">{m}</a></li>' for a, m, _ in CAPS[1:6])}</ul></div>
    <div><h4>&nbsp;</h4><ul>{''.join(f'<li><a href="/{a}">{m}</a></li>' for a, m, _ in CAPS[6:])}</ul></div>
  </div>
</footer>
<button class="gina-guia" aria-label="Gina, a guia. Clique para receber uma dica">
  <span class="corpo" aria-hidden="true"><img class="on" src="/assets/img/g_frente.png" alt=""><img src="/assets/img/g_tres4.png" alt=""><img src="/assets/img/g_lado_d.png" alt=""><img src="/assets/img/g_costas.png" alt=""><img src="/assets/img/g_lado_e.png" alt=""></span>
</button>
<div class="balao" role="status" aria-live="polite"><button class="fecha-balao" aria-label="Fechar dica">×</button><span class="texto-balao"></span></div>
<div class="toast" role="status" aria-live="polite"></div>
<script src="/assets/js/main.js?v={VERSAO}" defer></script>
</body>
</html>
'''

DESCR = {
    'index.html': 'O manual de marca da La Pomba: quem ela é, como fala, como aparece e o que nunca fazer com ela.',
    'marca.html': 'Manifesto, origem, propósito, personalidade e público da La Pomba.',
    'logo.html': 'Assinatura, família, versões de cor, área de proteção, mau uso e versão 3D da logo La Pomba.',
    'gina.html': 'Conheça a Gina: looks, giro 360°, humores e regras de uso da personagem da La Pomba.',
    'cores.html': 'O degradê La Pomba, cores de apoio, proporções e combinações.',
    'tipografia.html': 'Milne Rounded, Patita e Berthold Block: as três vozes da La Pomba.',
    'elementos.html': 'Acessórios, objetos kitsch e texturas da La Pomba, com mesa de montagem.',
    'aplicacao.html': 'Direção de imagem e anatomia das peças da La Pomba.',
    'voz.html': 'Tom de voz, slogans e jeito de falar da La Pomba.',
    'downloads.html': 'Logos, personagem, elementos, texturas e cores da La Pomba para baixar.',
    '404.html': 'Página não encontrada.',
}

def main():
    nomes = {a: m for a, m, _ in CAPS}
    ordem = [a for a, _, _ in CAPS]
    for i, (arq, menu, titulo) in enumerate(CAPS + [('404.html', '404', 'Página não encontrada · La Pomba')]):
        corpo = open(os.path.join(PAG, arq), encoding='utf-8').read()
        ant = prox = None
        if arq in ordem and 1 <= ordem.index(arq):
            k = ordem.index(arq)
            ant = (ordem[k - 1] if k > 1 else '/', nomes[ordem[k - 1]] if k > 1 else 'Início')
            prox = (ordem[k + 1], nomes[ordem[k + 1]]) if k + 1 < len(ordem) else None
        out = pagina(arq, titulo, DESCR[arq], corpo, ant, prox)
        open(os.path.join(RAIZ, arq), 'w', encoding='utf-8').write(out)
        print('ok', arq)

if __name__ == '__main__':
    main()
