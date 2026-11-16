// ===== CONFIGURAÇÕES (troque aqui) =====
const CFG = {
  whatsapp: "5598985239493",            // EXEMPLO: troque pelo número real (55 + DDD + número)
  pix: "5598985239493",            // EXEMPLO: troque pela sua chave Pix
  instagram: "https://www.instagram.com/doccitos_slz",
  dias: [2, 3, 4, 5, 6],                // dias de atendimento: 0=domingo ... 6=sábado
  abre: 16, fecha: 18,
  horarioTexto: "Terça a sábado, das 16h às 18h",
  mensagem: "Obrigada por adoçar o seu dia com a Doccitos Slz! Cada doce é feito com muito carinho, e logo o seu pedido chega até você. Que ele traga muitos sorrisos. 💗"
};

// ===== SEÇÕES DO CARROSSEL (todas sob encomenda, 50% de sinal) =====
const CATS = {
  bolo:  { titulo: "Bolos de Aniversário", sub: "Deslize para o lado e escolha o seu", arte: "cake" },
  festa: { titulo: "Doces para Festa", sub: "Deslize para o lado e escolha o seu", arte: "cup" }
};

// ===== PRODUTOS (exemplos: troque nome, descrição e preço) =====
// foto: caminho da imagem, ex.: "imagem/bolo-p.png". Vazio "" = desenho genérico.
const PRODUTOS = [
  { id: "b1", cat: "bolo",  nome: "Bolo por kg", desc: "Massa manteigada. A partir de 1 kg, de meio em meio quilo. Informe o recheio nas observações do pedido.", preco: 105, foto: "imagems/bolo m-img.png", un: "kg", min: 1, passo: 0.5 },

  { id: "f1", cat: "festa", nome: "Brigadeiros Gourmet", desc: ".", preco: 130, foto: "imagems/kit 25-img.png" },
  { id: "f2", cat: "festa", nome: "Brigadeiros Tradicionais", desc: ".", preco: 120, foto: "imagems/kit 50-img.png" },
  { id: "f3", cat: "festa", nome: "Brigadeiros Personalizados", desc: ".", preco: 140, foto: "imagems/cento brigadeiro-img.png" }
];

// ===== REVISTA: bolos que já fizemos (t = título, d = descrição, foto = imagem, h = tom do desenho genérico) =====
const REVISTA = [
  { t: "Bolo de princesa", d: "aniverário 15 anos.", foto: "imagems/bolo 1.png", h: 0 },
  { t: "Bolo de brigadeiro", d: "aniversários.", foto: "imagems/bolo 2.png", h: 160 },
  { t: "kit aniversário", d: "Bolo, Doces e Salgados.", foto: "imagems/bolo 3.png", h: 330 },
  { t: "Mini ovo de páscoa", d: "mini ovo ferrero.", foto: "imagems/ferrero.png", h: 40 },
  { t: "Mini ovo de páscoa", d: "mini ovo kinder.", foto: "imagems/kinder.png", h: 250 },
  { t: "Brownie", d: "Brownie de Morango e Ninho.", foto: "imagems/Brownie-img.png", h: 120 },
  { t: "Bolo de flores", d: "Decoração delicada feita à mão.", foto: "", h: 300 },
  { t: "Bolo personalizado", d: "No tema da sua festa.", foto: "", h: 200 }
];

// ===== CÓDIGO DA PÁGINA =====
// ===== CARDÁPIOS (aparecem abaixo de cada carrossel; a chave é a mesma de CATS) =====
const MENUS = {
  bolo: {
    titulo: "Ver sabores e valores dos bolos",
    grupos: [
      { t: "Massas", s: ["Massa manteigada", "Massa de chocolate (+ R$ 8,00 por kg)"] },
      { t: "Recheios clássicos", s: ["Doce de leite", "Ninho", "Chocolate", "Beijinho", "Amendoim"] },
      { t: "Recheios especiais", p: "+ R$ 12,00 por kg", s: ["Ninho com Nutella", "Ameixa", "Ferrero Rocher", "Cupuaçu", "Ninho de morango"] }
    ],
    notas: [
      "O valor do topo varia de acordo com o modelo. Massa de chocolate tem adicional de R$ 8,00.",
      "Informe a massa e o recheio nas observações do pedido."
    ]
  },
  festa: {
    titulo: "Ver sabores e valores dos brigadeiros",
    grupos: [
      { t: "Gourmet", s: ["Ninho com Nutella", "Ferrero Rocher", "Amendoim", "Prestígio", "Chocolate com Nutella"] },
      { t: "Tradicionais", s: ["Chocolate", "Ninho", "Doce de leite", "Beijinho", "Casadinhos"] },
      { t: "Personalizados", s: ["Chocolate", "Ninho"], o: "Apenas com cores metalizadas." }
    ],
    notas: [
      "Valores conforme a quantidade da encomenda, consulte pelo WhatsApp.",
      "Informe o sabor nas observações do pedido."
    ]
  }
};

const cardapio = k => {
  const m = MENUS[k];
  if (!m) return "";
  return `<details class="menu"><summary>${m.titulo}</summary><div class="mg">` +
    m.grupos.map(g => `<div class="mb"><h4>${g.t}</h4>${g.p ? `<b>${g.p}</b>` : ""}<ul>${g.s.map(s => `<li>${s}</li>`).join("")}</ul>${g.o ? `<small>${g.o}</small>` : ""}</div>`).join("") +
    `</div>` + m.notas.map(n => `<p class="note">${n}</p>`).join("") + `</details>`;
};
const $ = id => document.getElementById(id);
const R = v => "R$ " + v.toFixed(2).replace(".", ",");
const Q = (v, p) => String(v).replace(".", ",") + (p.un ? " " + p.un : "");
const fq = (p, q) => p.un ? Q(q, p) + " – " + p.nome : q + "x " + p.nome;
const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const art = (svgStyle, arte, foto, nome) => `<div class="art"><svg viewBox="0 0 40 40" style="${svgStyle}"><use href="#${arte}"/></svg>` + (foto ? `<img src="${foto}" alt="${nome}" onerror="this.remove()">` : "") + `</div>`;
const cart = {};
document.querySelectorAll("[data-hor]").forEach(e => e.textContent = CFG.horarioTexto);
$("ig").href = CFG.instagram;

// Carrosséis
$("vitrine").innerHTML = Object.entries(CATS).map(([k, c]) =>
  `<section class="cat"><h2>${c.titulo}</h2><p class="sub">${c.sub}</p><div class="car"><button class="arr l" data-dir="-1" data-t="t-${k}" aria-label="Anterior">‹</button><div class="track" id="t-${k}">` +
  PRODUTOS.filter(p => p.cat === k).map(p =>
    `<article class="card">${art("", c.arte, p.foto, p.nome)}<span class="tag">Sob encomenda</span><h3>${p.nome}</h3><p>${p.desc}</p>` +
    `<div class="row"><b>${R(p.preco)}${p.un ? " /" + p.un : ""}</b><div class="qty"><button data-id="${p.id}" data-d="-1" aria-label="Diminuir">−</button><span id="q-${p.id}">0</span><button data-id="${p.id}" data-d="1" aria-label="Aumentar">+</button></div></div></article>`
   ).join("") + `</div><button class="arr r" data-dir="1" data-t="t-${k}" aria-label="Próximo">›</button></div>${cardapio(k)}</section>`).join("");
document.addEventListener("click", e => {
  const a = e.target.closest("[data-dir]");
  if (a) { const t = $(a.dataset.t); return t.scrollBy({ left: a.dataset.dir * t.clientWidth * .8, behavior: "smooth" }); }
  const b = e.target.closest("[data-id]");
  if (!b) return;
  const id = b.dataset.id;
   const p = PRODUTOS.find(x => x.id === id), st = p.passo || 1, mn = p.min || 1, d = Number(b.dataset.d), cur = cart[id] || 0;
  let nv = d > 0 ? (cur ? cur + st : mn) : cur - st;
  if (nv < mn) nv = 0;
  if (nv) cart[id] = nv; else delete cart[id];
  render();
});

// Revista
let pg = 0;
const mob = () => matchMedia("(max-width:640px)").matches;
const pagina = (it, n) => `<div class="pg">${art(`filter:hue-rotate(${it.h}deg)`, "cake", it.foto, it.t)}<h3>${it.t}</h3><p>${it.d}</p><small>${n}</small></div>`;
function revista(anim) {
  const a = REVISTA[pg], b = REVISTA[pg + 1];
  $("book").innerHTML = pagina(a, pg + 1) + (b ? pagina(b, pg + 2) : '<div class="pg"></div>');
  $("bn").textContent = `Página ${pg + 1}${!mob() && b ? "–" + (pg + 2) : ""} de ${REVISTA.length}`;
  if (anim) $("book").querySelector(mob() ? ".pg:nth-child(1)" : ".pg:nth-child(2)").classList.add("turn");
}
const passo = () => mob() ? 1 : 2;
$("bx").onclick = () => { if (pg + passo() < REVISTA.length) { pg += passo(); revista(true); } };
$("bp").onclick = () => { if (pg > 0) { pg = Math.max(0, pg - passo()); revista(true); } };

// Carrinho
function calc() {
  let total = 0, n = 0;
  const lin = [];
  for (const p of PRODUTOS) {
    const q = cart[p.id]; if (!q) continue;
    total += q * p.preco; n += p.un ? 1 : q;
    lin.push({ p, q, t: q * p.preco });
  }
  return { n, lin, total, sinal: total * 0.5, resto: total * 0.5 };
}

function render() {
  const c = calc();
  PRODUTOS.forEach(p => $("q-" + p.id).textContent = cart[p.id] || 0);
  $("cnt").textContent = c.n;
   $("itens").innerHTML = c.lin.length ? c.lin.map(l => `<div class="it"><span>${fq(l.p, l.q)}</span><b>${R(l.t)}</b></div>`).join("") : '<p class="note">Seu pedido está vazio. Escolha nos carrosséis com os botões + e −.</p>';
  $("tot").innerHTML = c.n ? `<div><span>Total</span><span>${R(c.total)}</span></div><div class="g"><span>Sinal de 50% para confirmar</span><span>${R(c.sinal)}</span></div><div><span>Restante, pago na entrega</span><span>${R(c.resto)}</span></div>` : "";
  $("aviso").textContent = c.n ? `Encomendas exigem 50% de sinal. Chave Pix para o sinal: ${CFG.pix}` : "";
}

function status() {
  const n = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Fortaleza" }));
  const h = n.getHours() + n.getMinutes() / 60;
  const on = CFG.dias.includes(n.getDay()) && h >= CFG.abre && h < CFG.fecha;
  $("st").className = "st" + (on ? " on" : "");
  $("stt").textContent = on ? "Atendendo agora" : "Fora do horário";
}

// Finalizar pedido e voucher
let wa = "";
$("fin").onclick = () => {
  const c = calc(), nome = $("nome").value.trim(), end = $("end").value.trim(), data = $("data").value.trim();
  if (!c.n) return $("erro").textContent = "Adicione pelo menos um item ao pedido.";
  if (!nome || !end || !data) return $("erro").textContent = "Preencha seu nome, o endereço e a data desejada para a entrega.";
  $("erro").textContent = "";
  const cod = "DS-" + String(Date.now()).slice(-6);
  const pag = $("pag").value, obs = $("obs").value.trim();
   const itens = c.lin.map(l => `• ${fq(l.p, l.q)} – ${R(l.t)}`).join("\n");
  const txt = `*Encomenda Doccitos Slz*\nVoucher: ${cod}\n\nCliente: ${nome}\nEndereço: ${end}\nData/horário: ${data}\n\n${itens}\n\nTotal: ${R(c.total)}\nSinal (50%): ${R(c.sinal)}\nPix: ${CFG.pix}\nRestante na entrega: ${R(c.resto)}\nPagamento: ${pag}` + (obs ? `\nObs.: ${obs}` : "") + `\n\n${CFG.mensagem}`;
  wa = `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(txt)}`;
  $("tk").innerHTML = `<h3>Voucher ${cod}</h3><div class="tk"><b>${esc(nome)}</b><br>${esc(end)}<br>Data: ${esc(data)}</div>` +
       `<div class="tk">${c.lin.map(l => `${esc(fq(l.p, l.q))} – ${R(l.t)}`).join("<br>")}</div>` +
    `<div class="tot"><div><span>Total</span><span>${R(c.total)}</span></div><div class="g"><span>Sinal 50%</span><span>${R(c.sinal)}</span></div><div><span>Na entrega</span><span>${R(c.resto)}</span></div><div><span>Pagamento</span><span>${esc(pag)}</span></div></div>` +
    (obs ? `<div class="tk">Obs.: ${esc(obs)}</div>` : "") + `<p class="thx">${CFG.mensagem}</p>` +
    `<a class="big" href="${wa}" target="_blank" rel="noopener">Enviar pedido pelo WhatsApp</a><button class="big sec" id="fx">Fechar</button>`;
  $("vm").hidden = false;
  $("fx").onclick = () => $("vm").hidden = true;
};

// Bolos e brigadeiros animados no fundo
["brig", "cake", "cup", "brig", "cake", "cup", "brig", "cup", "cake", "brig", "cup", "cake"].forEach((s, i) => {
  const z = 30 + Math.random() * 30;
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.setAttribute("viewBox", "0 0 40 40"); e.setAttribute("class", "fl"); e.setAttribute("aria-hidden", "true");
  e.style.cssText = `left:${(i * 8.4 + Math.random() * 5) % 96}%;width:${z}px;height:${z}px;animation-duration:${16 + Math.random() * 16}s;animation-delay:-${Math.random() * 24}s`;
  e.innerHTML = `<use href="#${s}"/>`;
  document.body.appendChild(e);
});

status(); setInterval(status, 60000); render(); revista(false);
