/* CONSENTIMENTO DE COOKIES DA BIPVIEW — o aviso proprio do site (BIPVIEW-MKT-VENDAS, S05, 09/10/2026)
 *
 * Substitui o banner da AdOpt (bloqueado pela AdOpt em 07/10, fim do teste; decisao do Denis em 09/10: "fazer a
 * nossa seguindo o basico da LGPD"). Sem biblioteca de terceiro e sem chamada a fornecedor: o arquivo e servido
 * pelo proprio bipview.com.
 *
 * O QUE ELE FAZ (e so isto):
 *   1. desenha o aviso de 1o nivel com TRES botoes iguais — Rejeitar, Escolher, Aceitar (guia da ANPD de 2022:
 *      rejeitar tao facil quanto aceitar, sem destaque so no aceite);
 *   2. desenha o 2o nivel ("Preferencias de cookies"): Necessarios sempre ligados, Estatisticas DESLIGADAS por
 *      padrao, cada cookie com quem o grava, para que serve e quanto dura;
 *   3. guarda a escolha num cookie NOSSO (bv_consent, 12 meses) e volta a perguntar quando o aviso mudar de versao;
 *   4. avisa a escolha no dataLayer no formato do Consent Mode do Google —
 *      gtag('consent','update',{analytics_storage:'granted'|'denied'}) — e quem liga ou desliga o GA4 e o Clarity
 *      e a PONTE do site/medicao.py, que ja escutava esse sinal no tempo da AdOpt (nada de medicao aqui dentro);
 *   5. manda o registro da escolha para a API da BipView, SE o endereco estiver configurado (ENDPOINT). O registro
 *      leva um codigo aleatorio (nao identifica a pessoa), a acao, a escolha, a versao do aviso e a lingua — e a
 *      prova do consentimento que a LGPD poe na conta de quem coleta (art. 8o, par. 2o).
 *
 * ORDEM NA PAGINA: depois do "consent default" e ANTES da ponte (o bloco do medicao.py ja sai assim). Assim a
 * escolha guardada entra na fila do dataLayer antes de a ponte ler a fila.
 *
 * PORTAS DE SERVICO: window.bipviewPreferencias() abre o 2o nivel (o link do rodape chama esta).
 */
(function () {
  'use strict';

  // Sobe quando o aviso ou a lista de cookies mudar de um jeito que pede escolha nova (todo mundo e perguntado de novo).
  var VERSAO_AVISO = '2026-10-09';
  // Versao da Politica de Privacidade que o aviso descreve (vai junto no registro).
  var POLITICA = '1.3';
  // Endereco do registro na API da BipView. VAZIO = nao manda nada (a escolha fica so no cookie do navegador).
  // Preencher quando o PRODUTO publicar a rota (pedido no BALDE-ENTRADA__mkt.md, 09/10).
  var ENDPOINT = '';
  var COOKIE = 'bv_consent';
  var DIAS = 365;

  var TEXTOS = {
    pt: {
      regiao: 'Aviso de cookies',
      texto: 'Usamos cookies de medição (Google Analytics e Microsoft Clarity, nos EUA) só se você aceitar. Os necessários para o site funcionar ficam sempre ligados.',
      politica: 'Política de privacidade',
      rejeitar: 'Rejeitar', escolher: 'Escolher', aceitar: 'Aceitar',
      titulo: 'Preferências de cookies',
      intro: 'Escolha o que o site pode usar. Você muda quando quiser em "Preferências de cookies", no rodapé.',
      necessarios: 'Necessários', sempre: 'sempre ligados',
      necessariosTxt: 'Guardam a sua escolha sobre cookies. Sem eles o site não lembra o que você decidiu.',
      estatisticas: 'Estatísticas',
      estatisticasTxt: 'Contam quantas pessoas visitam o site, de onde vêm e se clicam para baixar o app (Google Analytics), e mostram como as páginas são usadas: cliques, rolagem e movimento do mouse, com o que você digitar mascarado (Microsoft Clarity). Os dados vão para os EUA.',
      cookie: 'Cookie', quem: 'Quem grava', paraQue: 'Para quê', duracao: 'Duração',
      fEscolha: 'guarda a sua escolha sobre cookies', fGa: 'distingue visitantes para contar visitas',
      fClck: 'reconhece o navegador entre visitas', fClsk: 'junta as páginas de uma mesma visita',
      fMuid: 'identifica o navegador para a Microsoft',
      d12m: '12 meses', d2a: '2 anos', d1a: '1 ano', d1d: '1 dia',
      rejeitarTudo: 'Rejeitar tudo', salvar: 'Salvar escolha', aceitarTudo: 'Aceitar tudo', fechar: 'Fechar'
    },
    es: {
      regiao: 'Aviso de cookies',
      texto: 'Usamos cookies de medición (Google Analytics y Microsoft Clarity, en EE. UU.) solo si aceptas. Las necesarias para que el sitio funcione están siempre activas.',
      politica: 'Política de privacidad',
      rejeitar: 'Rechazar', escolher: 'Elegir', aceitar: 'Aceptar',
      titulo: 'Preferencias de cookies',
      intro: 'Elige lo que el sitio puede usar. Puedes cambiarlo cuando quieras en "Preferencias de cookies", al pie de la página.',
      necessarios: 'Necesarias', sempre: 'siempre activas',
      necessariosTxt: 'Guardan tu elección sobre cookies. Sin ellas el sitio no recuerda lo que decidiste.',
      estatisticas: 'Estadísticas',
      estatisticasTxt: 'Cuentan cuántas personas visitan el sitio, de dónde vienen y si hacen clic para descargar la app (Google Analytics), y muestran cómo se usan las páginas: clics, desplazamiento y movimiento del ratón, con lo que escribas enmascarado (Microsoft Clarity). Los datos van a EE. UU.',
      cookie: 'Cookie', quem: 'Quién la guarda', paraQue: 'Para qué', duracao: 'Duración',
      fEscolha: 'guarda tu elección sobre cookies', fGa: 'distingue visitantes para contar visitas',
      fClck: 'reconoce el navegador entre visitas', fClsk: 'une las páginas de una misma visita',
      fMuid: 'identifica el navegador para Microsoft',
      d12m: '12 meses', d2a: '2 años', d1a: '1 año', d1d: '1 día',
      rejeitarTudo: 'Rechazar todo', salvar: 'Guardar elección', aceitarTudo: 'Aceptar todo', fechar: 'Cerrar'
    },
    en: {
      regiao: 'Cookie notice',
      texto: 'We use measurement cookies (Google Analytics and Microsoft Clarity, in the US) only if you accept. The ones the site needs to work are always on.',
      politica: 'Privacy policy',
      rejeitar: 'Reject', escolher: 'Choose', aceitar: 'Accept',
      titulo: 'Cookie preferences',
      intro: 'Choose what the site may use. You can change it anytime in "Cookie preferences", in the footer.',
      necessarios: 'Necessary', sempre: 'always on',
      necessariosTxt: 'They store your cookie choice. Without them the site cannot remember what you decided.',
      estatisticas: 'Statistics',
      estatisticasTxt: 'They count how many people visit the site, where they come from and whether they click to download the app (Google Analytics), and show how pages are used: clicks, scrolling and mouse movement, with anything you type masked (Microsoft Clarity). The data goes to the US.',
      cookie: 'Cookie', quem: 'Set by', paraQue: 'Purpose', duracao: 'Duration',
      fEscolha: 'stores your cookie choice', fGa: 'tells visitors apart to count visits',
      fClck: 'recognizes the browser across visits', fClsk: 'groups the pages of one visit',
      fMuid: 'identifies the browser for Microsoft',
      d12m: '12 months', d2a: '2 years', d1a: '1 year', d1d: '1 day',
      rejeitarTudo: 'Reject all', salvar: 'Save choice', aceitarTudo: 'Accept all', fechar: 'Close'
    }
  };

  var lingua = (document.documentElement.getAttribute('lang') || 'pt').slice(0, 2).toLowerCase();
  if (!TEXTOS[lingua]) lingua = 'pt';
  var T = TEXTOS[lingua];

  // ---------------------------------------------------------------- o sinal (Consent Mode), sem depender do gtag global
  window.dataLayer = window.dataLayer || [];
  function sinal() { window.dataLayer.push(arguments); }   // o gtag.js so le objetos "arguments", nunca arrays
  function avisarDataLayer(estatisticas) {
    sinal('consent', 'update', { 'analytics_storage': estatisticas ? 'granted' : 'denied' });
  }

  // ---------------------------------------------------------------- o cookie da escolha
  function ler() {
    var m = document.cookie.match(new RegExp('(?:^|;\\s*)' + COOKIE + '=([^;]*)'));
    if (!m) return null;
    try {
      var c = JSON.parse(decodeURIComponent(m[1]));
      if (!c || c.aviso !== VERSAO_AVISO || typeof c.est !== 'boolean' || !c.id) return null;
      return c;
    } catch (e) { return null; }
  }
  function novoId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    var b = new Uint8Array(16); (window.crypto || window.msCrypto).getRandomValues(b);
    b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128;
    var h = Array.prototype.map.call(b, function (x) { return (x + 256).toString(16).slice(1); }).join('');
    return h.slice(0, 8) + '-' + h.slice(8, 12) + '-' + h.slice(12, 16) + '-' + h.slice(16, 20) + '-' + h.slice(20);
  }
  function gravar(c) {
    var seguro = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = COOKIE + '=' + encodeURIComponent(JSON.stringify(c)) + '; Max-Age=' + (DIAS * 86400) +
      '; Path=/; SameSite=Lax' + seguro;
  }

  // ---------------------------------------------------------------- o registro na API (so com ENDPOINT)
  function registrar(c, acao) {
    if (!ENDPOINT) return;
    var corpo = JSON.stringify({
      id: c.id, acao: acao, estatisticas: c.est, aviso: VERSAO_AVISO, politica: POLITICA,
      lingua: lingua, pagina: location.pathname, quando_navegador: c.t
    });
    try {
      // text/plain: pedido "simples", sem a consulta previa de CORS; o servidor le o JSON do corpo
      if (navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, new Blob([corpo], { type: 'text/plain' }))) return;
      fetch(ENDPOINT, { method: 'POST', body: corpo, keepalive: true, headers: { 'Content-Type': 'text/plain' } });
    } catch (e) {}
  }

  var atual = ler();
  if (atual) avisarDataLayer(atual.est);   // quem ja escolheu: o sinal entra na fila antes da ponte ler

  function decidir(estatisticas, acao) {
    var antes = atual;
    atual = { v: 1, id: (antes && antes.id) || novoId(), aviso: VERSAO_AVISO, est: !!estatisticas, t: new Date().toISOString() };
    gravar(atual);
    avisarDataLayer(atual.est);
    registrar(atual, acao);
    esconderAviso();
  }

  // ---------------------------------------------------------------- o desenho
  var CSS = '' +
    '#bv-ck,#bv-ck-pref{font-family:"Open Sans","Segoe UI",Roboto,Arial,sans-serif;color:#fff;box-sizing:border-box}' +
    '#bv-ck *,#bv-ck-pref *{box-sizing:border-box}' +
    '#bv-ck{position:fixed;z-index:2147483000;left:16px;right:16px;bottom:16px;max-width:440px;background:#141519;' +
      'border:1px solid #2c2f36;border-radius:12px;padding:16px;font-size:14px;line-height:1.5;box-shadow:0 8px 24px rgba(0,0,0,.45)}' +
    '#bv-ck p{margin:0 0 12px;color:#e6e7e9}' +
    '#bv-ck a,#bv-ck-pref a{color:#6fa8ff}' +
    '.bv-ck-botoes{display:flex;gap:8px;flex-wrap:wrap}' +
    '.bv-ck-b{flex:1 1 0;min-width:96px;min-height:40px;padding:8px 12px;border-radius:8px;border:1px solid #6fa8ff;' +
      'background:transparent;color:#fff;font:600 14px/1.2 "Open Sans","Segoe UI",Roboto,Arial,sans-serif;cursor:pointer}' +
    '.bv-ck-b:hover{background:#1e2025}' +
    '.bv-ck-b:focus-visible,#bv-ck-pref input:focus-visible,#bv-ck a:focus-visible{outline:2px solid #6fa8ff;outline-offset:2px}' +
    // margin:auto e inset:0 de volta: o site zera a margem de tudo, e sem ela o <dialog> abre colado no canto
    '#bv-ck-pref{background:#141519;border:1px solid #2c2f36;border-radius:12px;padding:0;width:min(560px,calc(100vw - 32px));' +
      'max-height:calc(100vh - 32px);font-size:14px;line-height:1.5;margin:auto;inset:0;height:fit-content}' +
    '#bv-ck-pref::backdrop{background:rgba(0,0,0,.6)}' +
    '.bv-ck-corpo{padding:20px;overflow:auto;max-height:calc(100vh - 140px)}' +
    '#bv-ck-pref h2{font:700 18px/1.3 "Open Sans","Segoe UI",Roboto,Arial,sans-serif;text-transform:none;letter-spacing:0;margin:0 40px 8px 0;color:#fff}' +
    '#bv-ck-pref .bv-ck-intro{color:#a3a4a7;margin:0 0 16px}' +
    '.bv-ck-cat{border-top:1px solid #2c2f36;padding:12px 0}' +
    '.bv-ck-cab{display:flex;justify-content:space-between;align-items:center;gap:12px;font-weight:600}' +
    '.bv-ck-cab small{color:#a3a4a7;font-weight:400}' +
    '.bv-ck-cat p{margin:6px 0 8px;color:#a3a4a7}' +
    '.bv-ck-cat input{width:20px;height:20px;accent-color:#0f6ae6}' +
    '.bv-ck-tab{width:100%;border-collapse:collapse;font-size:12px;color:#a3a4a7}' +
    '.bv-ck-tab th,.bv-ck-tab td{text-align:left;padding:4px 6px 4px 0;border-top:1px solid #1e2025;vertical-align:top}' +
    '.bv-ck-tab th{color:#e6e7e9;font-weight:600}' +
    '.bv-ck-tab code{color:#e6e7e9}' +
    '.bv-ck-pe{padding:12px 20px 20px;border-top:1px solid #2c2f36}' +
    '.bv-ck-x{position:absolute;top:8px;right:8px;width:40px;height:40px;border:0;background:transparent;color:#a3a4a7;font-size:22px;cursor:pointer}' +
    // tela estreita: os tres botoes do 2o nivel em coluna, todos da mesma largura (nenhum ganha destaque por sobrar sozinho)
    '@media (max-width:480px){.bv-ck-tab th:nth-child(2),.bv-ck-tab td:nth-child(2){display:none}.bv-ck-pe .bv-ck-b{flex-basis:100%}}';

  function el(tag, attrs, filhos) {
    var e = document.createElement(tag);
    for (var k in attrs || {}) if (Object.prototype.hasOwnProperty.call(attrs, k)) {
      if (k === 'texto') e.textContent = attrs[k]; else e.setAttribute(k, attrs[k]);
    }
    (filhos || []).forEach(function (f) { if (f) e.appendChild(typeof f === 'string' ? document.createTextNode(f) : f); });
    return e;
  }
  function botao(id, texto, aoClicar) {
    var b = el('button', { type: 'button', id: id, 'class': 'bv-ck-b', texto: texto });
    b.addEventListener('click', aoClicar);
    return b;
  }
  function linkPolitica() {
    return el('a', { href: '/' + lingua + '/privacidade.html', texto: T.politica });
  }

  var aviso = null, pref = null;

  function montarEstilo() {
    if (document.getElementById('bv-ck-css')) return;
    var s = el('style', { id: 'bv-ck-css' }); s.textContent = CSS;
    document.head.appendChild(s);
  }

  function mostrarAviso() {
    if (aviso) return;
    montarEstilo();
    aviso = el('section', { id: 'bv-ck', role: 'region', 'aria-label': T.regiao }, [
      el('p', {}, [T.texto + ' ', linkPolitica(), '.']),
      el('div', { 'class': 'bv-ck-botoes' }, [
        botao('bv-ck-rejeitar', T.rejeitar, function () { decidir(false, 'rejeitar'); }),
        botao('bv-ck-escolher', T.escolher, function () { abrirPreferencias(); }),
        botao('bv-ck-aceitar', T.aceitar, function () { decidir(true, 'aceitar'); })
      ])
    ]);
    document.body.appendChild(aviso);
  }
  function esconderAviso() {
    if (aviso && aviso.parentNode) aviso.parentNode.removeChild(aviso);
    aviso = null;
  }

  function linhaCookie(nome, quem, paraQue, duracao) {
    return el('tr', {}, [el('td', {}, [el('code', { texto: nome })]), el('td', { texto: quem }), el('td', { texto: paraQue }), el('td', { texto: duracao })]);
  }
  function tabela(linhas) {
    return el('table', { 'class': 'bv-ck-tab' }, [
      el('thead', {}, [el('tr', {}, [el('th', { texto: T.cookie }), el('th', { texto: T.quem }), el('th', { texto: T.paraQue }), el('th', { texto: T.duracao })])]),
      el('tbody', {}, linhas)
    ]);
  }

  function montarPreferencias() {
    montarEstilo();
    var caixaEst = el('input', { type: 'checkbox', id: 'bv-ck-est', 'aria-describedby': 'bv-ck-est-txt' });
    var caixaNec = el('input', { type: 'checkbox', id: 'bv-ck-nec', checked: 'checked', disabled: 'disabled', 'aria-describedby': 'bv-ck-nec-txt' });
    pref = el('dialog', { id: 'bv-ck-pref', 'aria-labelledby': 'bv-ck-titulo' }, [
      botao('bv-ck-fechar', '×', function () { pref.close(); }),
      el('div', { 'class': 'bv-ck-corpo' }, [
        el('h2', { id: 'bv-ck-titulo', texto: T.titulo }),
        el('p', { 'class': 'bv-ck-intro' }, [T.intro + ' ', linkPolitica(), '.']),
        el('div', { 'class': 'bv-ck-cat' }, [
          el('label', { 'class': 'bv-ck-cab', 'for': 'bv-ck-nec' }, [el('span', {}, [T.necessarios + ' ', el('small', { texto: '(' + T.sempre + ')' })]), caixaNec]),
          el('p', { id: 'bv-ck-nec-txt', texto: T.necessariosTxt }),
          tabela([linhaCookie(COOKIE, 'BipView', T.fEscolha, T.d12m)])
        ]),
        el('div', { 'class': 'bv-ck-cat' }, [
          el('label', { 'class': 'bv-ck-cab', 'for': 'bv-ck-est' }, [el('span', { texto: T.estatisticas }), caixaEst]),
          el('p', { id: 'bv-ck-est-txt', texto: T.estatisticasTxt }),
          tabela([
            linhaCookie('_ga', 'Google', T.fGa, T.d2a),
            linhaCookie('_ga_GNWHTXJ1Z2', 'Google', T.fGa, T.d2a),
            linhaCookie('_clck', 'Microsoft', T.fClck, T.d1a),
            linhaCookie('_clsk', 'Microsoft', T.fClsk, T.d1d),
            linhaCookie('MUID', 'Microsoft', T.fMuid, T.d1a)
          ])
        ])
      ]),
      el('div', { 'class': 'bv-ck-pe' }, [
        el('div', { 'class': 'bv-ck-botoes' }, [
          botao('bv-ck-rejeitar-tudo', T.rejeitarTudo, function () { pref.close(); decidir(false, 'rejeitar'); }),
          botao('bv-ck-salvar', T.salvar, function () { var est = caixaEst.checked; pref.close(); decidir(est, 'escolher'); }),
          botao('bv-ck-aceitar-tudo', T.aceitarTudo, function () { pref.close(); decidir(true, 'aceitar'); })
        ])
      ])
    ]);
    pref.querySelector('#bv-ck-fechar').setAttribute('aria-label', T.fechar);
    pref.querySelector('#bv-ck-fechar').className = 'bv-ck-x';
    document.body.appendChild(pref);
  }

  function abrirPreferencias() {
    if (!document.body) return;
    if (!pref) montarPreferencias();
    // a caixa mostra o que esta valendo; sem escolha ainda, DESLIGADA (padrao da ANPD)
    pref.querySelector('#bv-ck-est').checked = !!(atual && atual.est);
    if (typeof pref.showModal === 'function') { if (!pref.open) pref.showModal(); }
    else pref.setAttribute('open', 'open');   // navegador antigo sem <dialog>: abre sem o fundo escuro
  }
  window.bipviewPreferencias = abrirPreferencias;

  function iniciar() { if (!atual) mostrarAviso(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
