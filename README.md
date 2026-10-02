# 📱 Catálogo Interativo 3D de Smartphones & Comparador Lado a Lado

[![Angular](https://img.shields.io/badge/Angular-18.2-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![WebGL / 3D](https://img.shields.io/badge/WebGL-3D%20Model%20Viewer-00f2fe?style=for-the-badge&logo=webgl&logoColor=black)](https://modelviewer.dev/)
[![GSAP](https://img.shields.io/badge/GSAP-Animations-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/gsap/)
[![SCSS](https://img.shields.io/badge/SCSS-Glassmorphism-CC6699?style=for-the-badge&logo=sass&logoColor=white)](https://sass-lang.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

> **Aplicação Web Frontend de Alta Performance para Visualização, Comparação e Edição em Tempo Real de Smartphones 3D.**
> Desenvolvida com **Angular 18 (Standalone Components)**, **WebGL/Model-Viewer**, **GSAP** e um painel **CMS totalmente interativo**.

---

## 🌟 Destaques do Projeto (Recursos Principais)

### 🧊 1. Visualizador 3D Interativo de Hardware
- **Renderização WebGL em Tempo Real**: Rotação em 360°, zoom milimétrico e órbita de câmera personalizada para modelos `.GLB`.
- **Apontadores Técnicos Dinâmicos (Callouts)**: Balões e apontadores 2D/3D interativos com suporte a **Drag & Drop** direto na tela para reposicionamento com botões de confirmar (✔) e cancelar (✖).
- **Iluminação & Efeitos Neon Customizáveis**: Ajustes de brilho, sombra, reflexo metálico do vidro, rugosidade de texturas e auréola Neon ajustável por slide.

### ⚔️ 2. Modo Comparativo 3D Lado a Lado
- **Comparação em Tempo Real**: Visualização simultânea de 2 modelos de smartphones com sincronização de slides técnicos.
- **Sliders de Precisão de Distância/Zoom 3D**: Ajuste exato da câmera (de 0.40m a 4.00m) via painel lateral CMS.
- **Ajuste de Escala de Fonte (A- / A+)**: Controle de tamanho de texto individual para cartões de especificação técnica.
- **Responsividade Mobile 50/50**: Layout adaptativo para dispositivos móveis com divisória Neon vertical e tabela matriz comparativa lado a lado.

### ⚙️ 3. Painel CMS & Sistema de Edição Incorporado
- **Gerenciador de Camadas (Layers Tree)**: Reordenação de camadas de apontadores e elementos 3D via Drag & Drop.
- **Persistência de Dados Otimizada**: Armazenamento em `localStorage` otimizado para reutilização de modelos Base64 sem estourar cotas.

### 🤖 4. Assistente IA Embutido (Google Gemini 2.5 Flash API)
- **Geração de Fichas Técnicas por Prompt**: Digite o nome de qualquer smartphone para gerar automaticamente a estrutura JSON completa com slides e especificações.
- **Template de Prompt Editável**: Aba dedicada para personalização do prompt de sistema e validação de schema JSON antes da importação em 1 clique.

---

## 🚀 Arquitetura & Tecnologias Utilizadas

| Tecnologia | Descrição / Aplicação |
| :--- | :--- |
| **Angular 18** | Arquitetura moderna com Standalone Components, Control Flow Syntax (`@if`, `@for`), Signals e Services |
| **TypeScript** | Tipagem estrita de interfaces (`Smartphone`, `SlideAparelho`, `EspecificacaoAnimada`) |
| **`<model-viewer>` / WebGL** | Renderização 3D de arquivos `.GLB` com suporte a iluminação HDR e câmera orbital |
| **GSAP (GreenSock)** | Transições cinemáticas fluidas entre slides e animações de entrada de componentes |
| **SCSS / CSS3** | Design com estética Glassmorphism, efeitos Neon Cyberpunk, CSS Grid e Flexbox Responsivo |
| **RxJS** | Gerenciamento de estado reativo e fluxos de dados |

---

## 💻 Como Rodar o Projeto Localmente

### Pré-requisitos
- **Node.js** v18+ ou superior
- **npm** v9+ ou superior
- **Angular CLI** v18+ (`npm install -g @angular/cli`)

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/felixsantos/smartphone-interactive-catalog.git
   cd smartphone-interactive-catalog
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   ng serve --port 4200
   ```

4. **Acesse no seu navegador:**
   Abra [http://localhost:4200/](http://localhost:4200/) para explorar o catálogo!

---

## 🛠️ Comandos de Build & Testes

- **Build de Produção:**
  ```bash
  ng build --configuration production
  ```
- **Executar Testes:**
  ```bash
  ng test
  ```

---

## 👤 Autor

Desenvolvido com 💡 por **Felix Santos**.

- **GitHub**: [@felixsantos](https://github.com/felixsantos)
- **LinkedIn**: [Seu LinkedIn](https://www.linkedin.com/in/seu-perfil)

---

*Se este projeto ajudou você ou você achou interessante, considere dar uma ⭐️ no repositório!*
