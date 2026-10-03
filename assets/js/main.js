/* LA POMBA — Brandbook · interações do site */
(function(){
'use strict';
const doc=document.documentElement;
doc.classList.add('js');
const calma=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];

/* ---------- Barra de progresso da leitura ---------- */
const barra=$('.progresso');
function progresso(){
  if(!barra)return;
  const max=doc.scrollHeight-innerHeight;
  barra.style.transform='scaleX('+(max>0?Math.min(1,scrollY/max):0)+')';
}
addEventListener('scroll',progresso,{passive:true});progresso();

/* ---------- Menu do celular ---------- */
const gaveta=$('.gaveta'),abre=$('.abre-menu');
if(gaveta&&abre){
  const fecha=$('.fecha',gaveta);
  const set=v=>{gaveta.classList.toggle('aberta',v);abre.setAttribute('aria-expanded',v);document.body.style.overflow=v?'hidden':'';if(v)fecha.focus();else abre.focus()};
  abre.addEventListener('click',()=>set(true));
  fecha.addEventListener('click',()=>set(false));
  addEventListener('keydown',e=>{if(e.key==='Escape'&&gaveta.classList.contains('aberta'))set(false)});
}

/* ---------- Revelar ao rolar ---------- */
if('IntersectionObserver' in window&&!calma){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visivel');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px',threshold:.08});
  $$('.revela,.revela-grupo').forEach(el=>io.observe(el));
}else{$$('.revela,.revela-grupo').forEach(el=>el.classList.add('visivel'))}

/* ---------- Vídeos: tocam só quando aparecem ---------- */
$$('video').forEach(v=>{
  if(calma){v.removeAttribute('autoplay');v.pause();return}
  if('IntersectionObserver' in window){
    new IntersectionObserver(es=>es.forEach(e=>{e.isIntersecting?v.play().catch(()=>{}):v.pause()}),{threshold:.2}).observe(v);
  }
});

/* ---------- Título da capa letra a letra ---------- */
$$('[data-letras]').forEach(h=>{
  if(calma)return;
  const txt=h.textContent;h.setAttribute('aria-label',txt);h.textContent='';
  let i=0;
  txt.split(' ').forEach((pal,w)=>{
    const p=document.createElement('span');p.style.display='inline-block';p.style.whiteSpace='nowrap';p.setAttribute('aria-hidden','true');
    [...pal].forEach(ch=>{const s=document.createElement('span');s.className='letra';s.textContent=ch;s.style.animationDelay=(i++*0.03)+'s';p.appendChild(s)});
    h.appendChild(p);if(w<txt.split(' ').length-1)h.appendChild(document.createTextNode(' '));
  });
});

/* ---------- Toast + confete ---------- */
const toast=$('.toast');let tt;
function aviso(m){if(!toast)return;toast.textContent=m;toast.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>toast.classList.remove('on'),1700)}
const coresConfete=['#FF8A25','#EE3E4F','#D41455','#BFAFCE','#E4962C','#FFF8F2'];
function confete(x,y){
  if(calma)return;
  for(let i=0;i<18;i++){
    const c=document.createElement('span');c.className='confete';
    c.style.left=x+'px';c.style.top=y+'px';c.style.background=coresConfete[i%coresConfete.length];
    const a=Math.random()*Math.PI*2,d=60+Math.random()*90;
    c.style.setProperty('--dx',Math.cos(a)*d+'px');c.style.setProperty('--dy',(Math.sin(a)*d+80)+'px');c.style.setProperty('--r',(Math.random()*720-360)+'deg');
    document.body.appendChild(c);setTimeout(()=>c.remove(),1300);
  }
}
function copia(texto,msg,ev){
  const ok=()=>{aviso(msg||texto+' copiado');if(ev)confete(ev.clientX,ev.clientY)};
  if(navigator.clipboard)navigator.clipboard.writeText(texto).then(ok,()=>aviso(texto));else aviso(texto);
}
$$('[data-copiar]').forEach(b=>b.addEventListener('click',e=>copia(b.dataset.copiar,b.dataset.msg,e)));

/* ---------- Gina guia: gira no canto e dá dicas ---------- */
const guia=$('.gina-guia'),balao=$('.balao');
if(guia&&balao){
  const quadros=$$('img',guia);
  const seq=[0,1,2,3,4,0],tempos=[2600,240,240,420,240,240];
  let i=0,pausa=false;
  const mostra=n=>{quadros.forEach((q,k)=>q.classList.toggle('on',k===n));guia.classList.remove('vira');void guia.offsetWidth;guia.classList.add('vira')};
  function gira(){if(pausa){mostra(0);i=0;setTimeout(gira,1500);return}i=(i+1)%seq.length;mostra(seq[i]);setTimeout(gira,tempos[i])}
  if(!calma)setTimeout(gira,tempos[0]);
  let dicas=[];try{dicas=JSON.parse(document.body.dataset.dicas||'[]')}catch(e){}
  const texto=$('.texto-balao',balao);let d=0,tb;
  const abreBalao=t=>{texto.innerHTML=t;balao.classList.add('on');pausa=true;clearTimeout(tb);tb=setTimeout(fechaBalao,7000)};
  const fechaBalao=()=>{balao.classList.remove('on');pausa=false};
  guia.addEventListener('click',()=>{if(!dicas.length)return;abreBalao(dicas[d%dicas.length]);d++});
  $('.fecha-balao',balao).addEventListener('click',fechaBalao);
  // primeira dica aparece sozinha uma vez por página
  if(dicas.length){setTimeout(()=>{if(scrollY<innerHeight*1.5){abreBalao(dicas[0]);d=1}},1600)}
  // no fim da página, ela se despede
  let despediu=false;
  addEventListener('scroll',()=>{const max=doc.scrollHeight-innerHeight;if(!despediu&&max>0&&scrollY/max>.97){despediu=true;abreBalao(document.body.dataset.tchau||'tchau, tesoro! até o próximo capítulo.')}},{passive:true});
}

/* ---------- Giro 360° (arrastar ou deslizar) ---------- */
$$('.giro360').forEach(g=>{
  const palco=$('.palco-giro',g),imgs=$$('img',palco),range=$('input[type=range]',g),btns=$$('.vistas button',g);
  const n=imgs.length;
  const set=k=>{k=((k%n)+n)%n;imgs.forEach((im,j)=>im.classList.toggle('on',j===k));if(range)range.value=k;btns.forEach((b,j)=>b.setAttribute('aria-pressed',j===k))};
  if(range)range.addEventListener('input',()=>set(+range.value));
  btns.forEach((b,j)=>b.addEventListener('click',()=>set(j)));
  let x0=null,k0=0;
  palco.addEventListener('pointerdown',e=>{x0=e.clientX;k0=+(range?range.value:0);palco.setPointerCapture(e.pointerId)});
  palco.addEventListener('pointermove',e=>{if(x0===null)return;const passo=Math.round((e.clientX-x0)/45);set(k0-passo)});
  ['pointerup','pointercancel'].forEach(t=>palco.addEventListener(t,()=>{x0=null}));
  palco.addEventListener('keydown',e=>{if(e.key==='ArrowRight')set(+range.value+1);if(e.key==='ArrowLeft')set(+range.value-1)});
  set(0);
});

/* ---------- Filtro de humores ---------- */
$$('[data-filtros]').forEach(box=>{
  const alvo=$(box.dataset.filtros),cards=$$('[data-temas]',alvo),btns=$$('button',box);
  btns.forEach(b=>b.addEventListener('click',()=>{
    btns.forEach(x=>x.setAttribute('aria-pressed',x===b));
    const t=b.dataset.tema;
    cards.forEach(c=>c.classList.toggle('apaga',t!=='todos'&&!c.dataset.temas.split(' ').includes(t)));
  }));
});

/* ---------- Testador de fundo da logo ---------- */
$$('.testador').forEach(t=>{
  const tela=$('.tela',t),img=$('img',tela),selo=$('.selo',tela),ver=$('.veredito',t),dica=$('.dica-testador',t),btns=$$('.fundos button',t);
  btns.forEach(b=>b.addEventListener('click',()=>{
    btns.forEach(x=>x.setAttribute('aria-pressed',x===b));
    tela.style.background=b.dataset.bg;
    img.classList.add('troca');
    setTimeout(()=>{img.src=b.dataset.logo;img.alt=b.dataset.nome;img.classList.remove('troca')},220);
    selo.textContent=b.dataset.nome;
    ver.textContent=b.dataset.ok==='1'?'pode usar.':'evite este fundo.';
    ver.className='veredito '+(b.dataset.ok==='1'?'ok':'nao');
    dica.textContent=b.dataset.dica;
  }));
});

/* ---------- Mesa de montagem: arrastar acessórios ---------- */
$$('.mesa').forEach(m=>{
  const quadro=$('.quadro',m);
  const fundos=$$('[data-fundo]',m),pecas=$$('[data-peca]',m);
  fundos.forEach(b=>b.addEventListener('click',()=>{fundos.forEach(x=>x.setAttribute('aria-pressed',x===b));quadro.style.backgroundImage='url('+b.dataset.fundo+')'}));
  function arrasta(el){
    let dx,dy;
    el.addEventListener('pointerdown',e=>{e.preventDefault();const r=el.getBoundingClientRect();dx=e.clientX-r.left;dy=e.clientY-r.top;el.setPointerCapture(e.pointerId);el.style.zIndex=Date.now()%100000});
    el.addEventListener('pointermove',e=>{if(dx===undefined||!el.hasPointerCapture(e.pointerId))return;const q=quadro.getBoundingClientRect();el.style.left=((e.clientX-q.left-dx)/q.width*100)+'%';el.style.top=((e.clientY-q.top-dy)/q.height*100)+'%'});
    el.addEventListener('pointerup',()=>{dx=undefined});
  }
  $$('.peca',quadro).forEach(arrasta);
  pecas.forEach(b=>b.addEventListener('click',()=>{
    const atual=$$('.peca',quadro);
    const ja=atual.find(p=>p.dataset.src===b.dataset.peca);
    if(ja){ja.remove();b.setAttribute('aria-pressed','false');return}
    if(atual.length>=2){aviso('máximo de dois acessórios por peça, tesoro.');return}
    const im=document.createElement('img');im.src=b.dataset.peca;im.dataset.src=b.dataset.peca;im.alt='';im.className='peca';im.draggable=false;
    im.style.left=(atual.length?58:6)+'%';im.style.top=(atual.length?6:66)+'%';
    quadro.appendChild(im);arrasta(im);b.setAttribute('aria-pressed','true');
  }));
});

/* ---------- Anatomia do pôster ---------- */
$$('.anatomia-box').forEach(box=>{
  const nums=$$('.n',box),itens=$$('.lista-anatomia li',box),lista=$('.lista-anatomia',box);
  const ativa=k=>{lista.classList.toggle('foco',k!==null);nums.forEach((n,j)=>n.classList.toggle('ativo',j===k));itens.forEach((li,j)=>li.classList.toggle('ativo',j===k))};
  nums.forEach((n,j)=>{n.addEventListener('mouseenter',()=>ativa(j));n.addEventListener('focus',()=>ativa(j));n.addEventListener('click',()=>ativa(j));n.addEventListener('mouseleave',()=>ativa(null));n.addEventListener('blur',()=>ativa(null))});
  itens.forEach((li,j)=>{li.addEventListener('mouseenter',()=>ativa(j));li.addEventListener('mouseleave',()=>ativa(null))});
});

/* ---------- Tradutor do tom de voz ---------- */
$$('.tradutor-box').forEach(box=>{
  const pares=JSON.parse(box.dataset.pares),de=$('.de p',box),para=$('.para p',box),btn=$('.outra',box);
  let i=0;
  btn.addEventListener('click',()=>{i=(i+1)%pares.length;[de,para].forEach(p=>p.style.opacity=0);setTimeout(()=>{de.textContent=pares[i][0];para.textContent=pares[i][1];[de,para].forEach(p=>p.style.opacity=1)},250)});
});

/* ---------- Gerador de degradê ---------- */
$$('.gerador').forEach(g=>{
  const ang=$('input[type=range]',g),prev=$('.faixa-ger',g),cod=$('.codigo',g),lab=$('.angulo',g),btn=$('.copia-css',g);
  const css=()=>`linear-gradient(${ang.value}deg, #FF8A25, #FF6238 25%, #EE3E4F 50%, #D41455 75%, #B8004B)`;
  const up=()=>{prev.style.background=css();cod.textContent='background: '+css()+';';lab.textContent=ang.value+'°'};
  ang.addEventListener('input',up);up();
  btn.addEventListener('click',e=>copia('background: '+css()+';','CSS do degradê copiado',e));
});
})();
