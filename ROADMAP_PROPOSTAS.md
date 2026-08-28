# 🍎 Studio POMAR — Guia de Propostas & Ideias de Evolução do Site

Este documento reúne sugestões práticas e visões de futuro para expandir o site do **Studio POMAR**, tornando-o ainda mais interativo, informativo e uma referência indispensável para a comunidade de síntese vocal brasileira e internacional.

---

## 1. 🎵 Experiência Sonora & Mídia (Áudio de Alta Qualidade)

### 1.1. Amostras Oficiais em Áudio Real para Todas as Vozes
- **Situação atual**: VIICTOR, Llane Crow e Kodama Kito possuem amostras em arquivo `.mp3` real; Yohji, Eddie e Mizuki usam o sintetizador Web Audio algorítmico como demonstração melódica.
- **Proposta**: Adicionar arquivos `.mp3` curtos com frases ou trechos cantados clássicos em alta fidelidade para Yohji, Eddie e Mizuki.

### 1.2. Seletor de Timbres e Idiomas no Player Flutuante
- Para vozes polifônicas/multilíngues (ex: **Kodama Kito** com suas *Voice Colors*: *Dark, Mature, Power, Sweet, Weak, -tired-* ou **VIICTOR** com bancos em Português, Japonês e Árabe), permitir alternar o sample diretamente no player flutuante ou no modal de detalhes.

### 1.3. Vitrine Musical: "Canções do Pomar" (Covers & Originais)
- Uma seção ou playlist com player integrado destacando músicas completas criadas pela comunidade com as vozes do Studio Pomar, com link para o vídeo original no YouTube, USTX/UST de download e créditos do produtor.

---

## 2. 🎹 Recursos Interativos & Playground

### 2.1. Mini Teclado / Piano Roll Interativo no Navegador
- Um teclado minimalista na tela onde os visitantes possam clicar em notas (C3, E3, G3...) e ouvir as vozes cantando uma vogal (*"A"*, *"O"* ou o timbre característico) em tempo real via Web Audio API.

### 2.2. Filtro Rápido e Busca na Grade de Vozes
- Barra de filtros rápidos acima da seção `#vozes`:
  - **Filtros por Tag**: `Todas`, `Brasileiras`, `Multilíngues`, `DiffSinger`, `UTAU / OpenUTAU`, `Pioneiros`.
  - Busca instantânea por nome ou geração.

### 2.3. Comparador Visual de Motores (UTAU vs. OpenUTAU vs. DiffSinger)
- Uma aba explicativa e ilustrada mostrando como cada motor processa a voz, ajudando iniciantes a escolher onde começar a produzir suas músicas.

---

## 3. 🛠️ Seção de Ferramentas & Downloads Diretos

### 3.1. Badges Dinâmicas de Releases do GitHub (Kamafeu & Copaíba)
- Integrar a API pública do GitHub para exibir a versão mais recente em tempo real (ex: `Kamafeu v0.2.0`, `Copaíba NEO v0.1.4`), tamanho do instalador e data da última atualização.

### 3.2. Botões de Download Direto por Sistema Operacional
- No card de ferramentas, disponibilizar botões inteligentes com ícones:
  - `Windows (.exe / .zip)`
  - `Linux (.AppImage / .tar.gz)`
  - `macOS (.dmg / Apple Silicon & Intel)`

### 3.3. Modal com Galeria de Screenshots das Ferramentas
- Ao clicar em uma ferramenta, abrir modal com galeria de capturas de tela da interface do Kamafeu e Copaíba, lista de atalhos e especificações técnicas de DSP.

---

## 4. 📚 Central de Conhecimento & Recursos para Criadores

### 4.1. Tabela de Fonemas BRAPA / Guia Fonético Interativo
- Um dicionário/tabela interativa de fonemas do Português Brasileiro (CVC, CVVC, VCV), onde o usuário clica no fonema e ouve a pronúncia ou vê exemplos de palavras (*"pra"*, *"lhe"*, *"nham"*).

### 4.2. Pacote de Reclists & OTO Presets para Download
- Área para download de arquivos `.reclist`, guias de gravação e modelos de configuração para quem deseja gravar seu próprio banco de voz e se juntar ao ecossistema do Pomar.

### 4.3. Tutoriais Rápidos em 1 Minuto (GIFs / Vídeos Curtos)
- Guias visuais animados para a seção *Quickstart*:
  1. *Como arrastar o ZIP no OpenUTAU*.
  2. *Como ajustar notas e phonemizers*.
  3. *Como renderizar o áudio*.

---

## 5. 🎨 Design, Temas & Acessibilidade

### 5.1. Seletor de Estações do Ano / Ambientes
- Alternador de atmosfera estética para o fundo interativo do pomar:
  - 🌿 **Brisa de Verão** (atual, tons quentes e folhas vivas)
  - 🍂 **Outono Dourado** (tons âmbar e folhas secas)
  - 🌙 **Noite no Pomar** (dark mode profundo com vaga-lumes bioluminescentes)

### 5.2. PWA (Progressive Web App) & Modo Offline
- Adicionar manifesto PWA para que os usuários possam instalar o site do Studio Pomar como aplicativo nativo no celular ou computador, com carregamento ultrarrápido mesmo sem internet.

---

## 6. 🤝 Comunidade & Colaboração

### 6.1. Formulário ou Guia: "Como Integrar seu Voicebank ao Coletivo"
- Um guia claro com os critérios e padrões de qualidade LTS (gravação limpa, oto.ini consistente, licença livre) para criadores independentes submeterem suas vozes para avaliação e acolhimento no Studio Pomar.

### 6.2. Mural de Produtores & Hall da Fama
- Créditos e links para canais de ilustradores, voice providers, configuradores de oto.ini, programadores e músicos que ajudam a cultivar o projeto.

---

## 📋 Resumo Priorizado de Próximos Passos

| Prioridade | Recurso / Ideia | Impacto | Complexidade |
| :--- | :--- | :--- | :--- |
| **Alta** 🟢 | Amostras em `.mp3` para Yohji, Eddie e Mizuki | Alto (áudio 100% autêntico) | Baixa |
| **Alta** 🟢 | Seletor de Voice Colors/Idiomas no player flutuante | Alto (destaca a versatilidade) | Média |
| **Média** 🟡 | Filtros rápidos por categoria na seção `#vozes` | Médio (melhora navegação) | Baixa |
| **Média** 🟡 | Seção "Canções do Pomar" (Vitrine de músicas completas) | Alto (engajamento da comunidade) | Média |
| **Futuro** 🔵 | Mini Piano Roll / Teclado interativo no navegador | Muito Alto (fator "Uau!") | Alta |
| **Futuro** 🔵 | Tabela interativa de fonemas BRAPA & Tutoriais | Alto (educacional) | Média |
