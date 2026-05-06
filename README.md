# cloker98.github.io

[![Jekyll](https://img.shields.io/badge/Jekyll-4.x-red.svg)](https://jekyllrb.com/)
[![GitHub Pages](https://img.shields.io/badge/Host-GitHub%20Pages-blue.svg)](https://pages.github.com/)

Site pessoal de Elizeu Neto, construído com **Jekyll** e hospedado no **GitHub Pages**. Contém uma página de links estilo Linktree, um plano de fitness protegido por autenticação e um portfólio profissional.

---

## Páginas

| Rota | Arquivo | Descrição |
|---|---|---|
| `/` | `index.md` | Linktree — links principais |
| `/login` | `login.md` | Autenticação client-side |
| `/vshape` | `vshape.md` | Plano fitness V-Shape (protegido) |
| `/portfolio` | `portfolio.md` | Maverick Studio — portfólio profissional |

---

## Estrutura

```
cloker98.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD para GitHub Pages
│
├── _layouts/
│   ├── default.html            # Layout: index, login, vshape
│   └── portfolio.html          # Layout: portfolio
│
├── assets/
│   ├── css/
│   │   ├── linktree.css        # Estilos da página de links
│   │   ├── portfolio.css       # Estilos do portfólio
│   │   └── v-shape.css         # Estilos do plano fitness
│   ├── docs/
│   │   ├── Profile.pdf
│   │   ├── Proposta Giglio (Site eCommerce).pdf
│   │   ├── Proposta MPCMAA (Site Institucional).pdf
│   │   └── Tabela de Preços 2025.pdf
│   ├── img/
│   │   ├── profile.svg         # Avatar do Linktree
│   │   ├── eu.jpg              # Foto de perfil do portfólio
│   │   └── clientes/           # Logos de clientes (PNG + SVG)
│   ├── js/
│   │   ├── portfolio.js        # Animações e cursor do portfólio
│   │   └── v-shape.js          # Navegação por seções do plano fitness
│   └── media/
│       └── video.mp4           # Vídeo do preloader do portfólio
│
├── _config.yml
├── Gemfile
├── favicon.ico
├── favicon.svg
├── index.md
├── login.md
├── portfolio.md
└── vshape.md
```

---

## Stack

- **Jekyll** `~> 4.3.0` + Ruby 3.0+
- **Plugins**: jekyll-sitemap, jekyll-feed, jekyll-seo-tag
- **Frontend**: HTML5, CSS3, JavaScript (sem frameworks)
- **Deploy**: GitHub Actions → GitHub Pages (branch `gh-pages`)

---

## Desenvolvimento local

```bash
# Instalar dependências
bundle install

# Servidor local com live reload
bundle exec jekyll serve --livereload
```

Acesse: `http://localhost:4000`

---

## Deploy

O deploy é automático via GitHub Actions a cada push na branch `master`. O workflow está em `.github/workflows/deploy.yml`.
