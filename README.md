# 🏥 Quiz da Saúde - Jogo da Velha Educativo

Um jogo da velha onde você precisa acertar perguntas sobre saúde para marcar sua jogada! Feito com React Native + Expo.

## 📱 Como rodar no seu celular

### 1. Instalar o necessário no computador

Você precisa ter instalado:
- **Node.js** → Baixe em: https://nodejs.org (versão LTS)
- **Git Bash** (opcional, mas recomendado) → Vem junto com o Git: https://git-scm.com

### 2. Instalar o Expo Go no celular

- **Android** → Baixe o **Expo Go** na Play Store
- **iPhone** → Baixe o **Expo Go** na App Store

### 3. Instalar as dependências do projeto

Abra o **Git Bash** (ou terminal de sua preferência), navegue até a pasta do projeto e rode:

```bash
cd ReactNative
npm install
```

### 4. Iniciar o projeto

```bash
npx expo start
```

Vai aparecer um **QR Code** no terminal.

### 5. Abrir no celular

1. Certifique-se de que o **celular e o computador estão na mesma rede Wi-Fi**
2. Abra o app **Expo Go** no celular
3. Escaneie o **QR Code** que apareceu no terminal
4. O jogo vai abrir no celular!

## 🎮 Como jogar

1. Escolha o modo: **vs IA** ou **vs Jogador**
2. Digite os nomes dos jogadores
3. Clique em **Começar Jogo**
4. Responda a pergunta de saúde corretamente
5. Se acertar, escolha uma casa no tabuleiro
6. Se errar, a vez passa pro outro jogador
7. Vence quem alinhar 3 símbolos primeiro!

## 🛠️ Solução de problemas

**Erro de versão do Expo Go:**
```bash
npx expo install --fix
```

**Erro de módulo não encontrado:**
```bash
npm install
npx expo start -c
```

**O QR Code não funciona:**
- Verifique se celular e computador estão na mesma rede Wi-Fi
- Tente pressionar `s` no terminal para trocar o modo de conexão

## 📂 Estrutura do projeto

```
ReactNative/
├── App.js                    ← Entrada do app
├── app.json                  ← Configuração do Expo
├── package.json              ← Dependências
└── src/
    ├── theme.js              ← Cores e estilos
    ├── data/
    │   └── questions.js      ← Perguntas de saúde
    ├── screens/
    │   ├── MenuScreen.js     ← Tela do menu
    │   └── GameScreen.js     ← Tela do jogo
    └── utils/
        └── gameLogic.js      ← Lógica do jogo da velha e IA
```

## 💚 Créditos

Projeto acadêmico desenvolvido para educação em saúde.
