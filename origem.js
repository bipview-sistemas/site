/* origem.js — leva a etiqueta do link de entrada ate os botoes de baixar (BIPVIEW-MKT-VENDAS, 16/11/2026).
 *
 * O QUE FAZ: le da barra de endereco SO a lista branca (a chave `o` do catalogo de origens e as cinco utm_*) e
 * reescreve o endereco dos botoes [data-loja] desta pagina, para a loja e o app saberem de qual link a pessoa veio.
 * Sem etiqueta na barra, nao mexe em nada: cada botao ja sai da fonte com a chave da propria pagina.
 *
 * O QUE NAO FAZ: nao guarda nada no navegador (nem cookie, nem armazenamento local), nao manda nada a ninguem e
 * ignora gclid, fbclid e qualquer outro parametro. E a regra do Denis (14/11/2026): a origem vem da etiqueta do
 * link, sem perguntar nada ao cliente.
 *
 * A REGRA E A DO SERVIDOR (BipView-Sistema/06-INFRA/lambda_src/origem_campanha.py): a chave em minusculas, digitos
 * e hifen, comecando e terminando com letra ou digito, ate 30 caracteres; cada utm com ate 100, so letras, digitos
 * e " _.:/+~-". O que nao passa e descartado, nunca "consertado".
 *
 * O catalogo das chaves: BIPVIEW-MKT-VENDAS/catalogo/origens.csv. Prova: node site/teste_origem.js
 */
(function (raiz) {
  'use strict';

  var ORIGEM_MAX = 30;
  var UTM_MAX = 100;
  var RE_O = /^[a-z0-9](?:[a-z0-9-]{0,28}[a-z0-9])?$/;
  var RE_UTM = /^[\p{L}\p{N}_ .:\/+~-]{1,100}$/u;
  var UTMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

  // A etiqueta que veio no link de entrada: { o: 'chave' ou '', utm: { utm_source: '...', ... } }.
  function entrada(busca) {
    var q = new URLSearchParams(busca || '');
    var o = (q.get('o') || '').trim();
    var e = { o: RE_O.test(o) ? o : '', utm: {} };
    UTMS.forEach(function (k) {
      var v = (q.get(k) || '').trim();
      if (v && RE_UTM.test(v)) { e.utm[k] = v; }
    });
    return e;
  }

  function temUtm(e) { return Object.keys(e.utm).length > 0; }

  // A chave de entrada troca a chave da pagina. As utm de entrada, quando existem, trocam TODAS as utm do botao:
  // nao se mistura a campanha de dois links.
  function aplicar(params, e) {
    if (e.o) { params.set('o', e.o); }
    if (temUtm(e)) {
      UTMS.forEach(function (k) { params.delete(k); });
      UTMS.forEach(function (k) { if (e.utm[k]) { params.set(k, e.utm[k]); } });
    }
  }

  // O endereco novo de um botao. loja: 'web', 'android' ou 'ios'. Sem etiqueta de entrada, devolve o mesmo endereco.
  function montar(href, loja, e) {
    if (!href || !e || (!e.o && !temUtm(e))) { return href; }
    var u;
    try { u = new URL(href); } catch (x) { return href; }
    if (loja === 'web') {
      aplicar(u.searchParams, e);
    } else if (loja === 'android') {
      // A Play entrega ao app, na instalacao, o que vai dentro de `referrer`.
      var ref = new URLSearchParams(u.searchParams.get('referrer') || '');
      aplicar(ref, e);
      u.searchParams.set('referrer', ref.toString());
    } else if (loja === 'ios') {
      // A Apple so conta a campanha (`ct`) quando o link leva o `pt` da conta. Sem ele, o link fica como esta.
      if (!e.o || !u.searchParams.get('pt')) { return href; }
      u.searchParams.set('ct', e.o);
    } else {
      return href;
    }
    return u.toString();
  }

  // Reescreve os botoes da pagina. Devolve quantos mudaram.
  function ligar(doc, busca) {
    var e = entrada(busca);
    if (!e.o && !temUtm(e)) { return 0; }
    var n = 0;
    doc.querySelectorAll('a[data-loja]').forEach(function (a) {
      var antes = a.getAttribute('href');
      var depois = montar(antes, a.getAttribute('data-loja'), e);
      if (depois !== antes) { a.setAttribute('href', depois); n += 1; }
    });
    return n;
  }

  var api = { ORIGEM_MAX: ORIGEM_MAX, UTM_MAX: UTM_MAX, UTMS: UTMS, entrada: entrada, montar: montar, ligar: ligar };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (raiz && raiz.document) {
    raiz.bipviewOrigem = api;
    var ir = function () { ligar(raiz.document, raiz.location.search); };
    if (raiz.document.readyState === 'loading') {
      raiz.document.addEventListener('DOMContentLoaded', ir);
    } else {
      ir();
    }
  }
})(typeof window !== 'undefined' ? window : null);
