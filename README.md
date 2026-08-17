# Site oficial da BipView — bipview.com

Página única, **self-contained**: fontes (Anton + Open Sans) e logos da marca vão inline no
próprio HTML, sem CDN. Sem build, sem dependência — o GitHub Pages serve o arquivo direto.

## Não edite o `index.html` aqui

Ele é **gerado** a partir da marca oficial e das telas reais do app, no repositório de
desenvolvimento (`bipview-app`), por `_tmp/gerar_site.py`. Editar aqui é perder a alteração na
próxima geração. A fonte de verdade da marca é `BipView-Sistema/00-DOCS/marca/`.

## Domínio

- `bipview.com` → este site (arquivo `CNAME`), registrado no GoDaddy.
- `bipview.com.br` → redirecionamento 301 para cá, via Route 53 + CloudFront (pendente: depende
  da conta AWS de produção existir).

## O que a página não diz, de propósito

Não promete IA nem análise preditiva (o produto de hoje não entrega), não usa "criptografia de
ponta a ponta" (o correto é o cofre por envelope) e não enquadra a BipView como derivada da
Declare Cripto — a BipView é empresa independente, CNPJ 63.306.772/0001-76.
