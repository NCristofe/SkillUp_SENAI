# SENAI Suíço-Brasileira — App de Cursos de Desenvolvimento

Aplicativo mobile desenvolvido com **React Native + Expo** para divulgação dos cursos de desenvolvimento tecnológico da Escola SENAI Suíço-Brasileira.

---

## Sumário

1. [Sobre o Projeto](#sobre-o-projeto)
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Pré-requisitos](#pré-requisitos)
5. [Instalação e Configuração do Ambiente](#instalação-e-configuração-do-ambiente)
6. [Criação do App](#criação-do-app)
7. [Instalação dos Pacotes](#instalação-dos-pacotes)
8. [Organização do Projeto](#organização-do-projeto)
9. [Banco de Dados SQLite](#banco-de-dados-sqlite)
10. [Serviço de API com Axios](#serviço-de-api-com-axios)
11. [Componentes](#componentes)
12. [Telas](#telas)
13. [Navegação](#navegação)
14. [Estilos e Tema](#estilos-e-tema)
15. [Configurações do App](#configurações-do-app)
16. [Como Testar](#como-testar)
17. [Funcionalidades](#funcionalidades)
18. [Cursos Disponíveis](#cursos-disponíveis)

---

## Sobre o Projeto

Este aplicativo foi criado para divulgar os cursos de desenvolvimento da SENAI Suíço-Brasileira. Ele permite que os usuários:

- Naveguem pela lista completa de cursos
- Filtrem cursos por área de conhecimento
- Pesquisem cursos por título, professor ou área
- Visualizem detalhes completos de cada curso
- Solicitem matrícula diretamente pelo app
- Entrem em contato com a escola

---

## Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|---|---|---|
| React Native | 0.74.x | Framework mobile multiplataforma |
| Expo | ~51.0.x | Plataforma de desenvolvimento |
| Expo SQLite | ~14.x | Banco de dados local |
| Axios | ^1.7.x | Cliente HTTP para APIs |
| React Native Paper | ^5.12.x | Biblioteca de componentes UI (Material Design 3) |
| React Navigation | ^6.x | Navegação entre telas |
| @expo/vector-icons | ^14.x | Ícones (MaterialCommunityIcons) |

---

## Estrutura do Projeto

```
senai-suico-brasileira/
├── App.js                        # Ponto de entrada — Provider + init DB
├── app.json                      # Configuração Expo
├── package.json                  # Dependências
├── babel.config.js               # Configuração Babel
├── assets/                       # Ícones e splash screen
└── src/
    ├── components/
    │   ├── Button.js             # Botão customizado (primary/secondary/outline/ghost)
    │   ├── CourseCard.js         # Card de curso na lista
    │   └── CourseModal.js        # Modal de resumo do curso (bottom sheet)
    ├── data/
    │   └── seedCourses.js        # 15+ cursos iniciais (≥3 por área)
    ├── navigation/
    │   └── AppNavigator.js       # Bottom tabs + Stack Navigator
    ├── screens/
    │   ├── HomeScreen.js         # Lista de cursos + busca + filtro por área
    │   ├── CourseDetailScreen.js # Detalhes completos do curso
    │   ├── AboutScreen.js        # Informações sobre a escola
    │   └── ContactScreen.js      # Formulário de contato + canais rápidos
    ├── services/
    │   ├── database.js           # CRUD SQLite (expo-sqlite v14 async API)
    │   └── api.js                # Instância Axios + serviços de contato/matrícula
    └── styles/
        ├── colors.js             # Paleta de cores SENAI + mapeamentos por área
        └── globalStyles.js       # StyleSheet global + tema React Native Paper
```

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18 LTS ou superior → [nodejs.org](https://nodejs.org)
- **npm** 9+ (vem com Node.js) ou **yarn** 1.22+
- **Expo CLI** (instalado globalmente)
- **Expo Go** no celular (Android/iOS) — para testar sem emulador

### Verificar instalações

```bash
node --version      # deve mostrar v18.x.x ou superior
npm --version       # deve mostrar 9.x.x ou superior
```

---

## Instalação e Configuração do Ambiente

### 1. Instalar o Expo CLI globalmente

```bash
npm install -g expo-cli
```

### 2. (Opcional) Instalar emulador Android

Se quiser testar no emulador:

1. Instale o [Android Studio](https://developer.android.com/studio)
2. No Android Studio → **SDK Manager** → instale Android SDK 34
3. Crie um **Virtual Device** (AVD) via **Device Manager**
4. Execute `expo start --android` para abrir no emulador

### 3. Instalar Expo Go no celular

- **Android**: [Play Store — Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: [App Store — Expo Go](https://apps.apple.com/app/expo-go/id982107779)

---

## Criação do App

Se você quiser criar o projeto do zero (sem clonar este repositório):

```bash
# Cria novo projeto Expo com template em branco
npx create-expo-app senai-suico-brasileira --template blank

# Entra na pasta
cd senai-suico-brasileira
```

---

## Instalação dos Pacotes

No diretório raiz do projeto, instale todas as dependências:

```bash
npm install
```

Caso esteja criando do zero, instale os pacotes individualmente:

```bash
# Navegação
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack

# Dependências da navegação (requeridas pelo Expo)
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler

# Banco de dados SQLite
npx expo install expo-sqlite

# Cliente HTTP
npm install axios

# Biblioteca de UI
npm install react-native-paper

# Ícones (já incluído no Expo, mas declarar explicitamente)
npx expo install @expo/vector-icons
```

> **Dica:** Use `npx expo install` para pacotes nativos — ele instala a versão compatível com sua versão do Expo SDK automaticamente.

### Verificar dependências instaladas

```bash
npx expo doctor
```

Este comando verifica incompatibilidades e avisa se algum pacote precisar de atualização.

---

## Organização do Projeto

### Criar a estrutura de pastas

```bash
mkdir -p src/components src/screens src/services src/data src/styles src/navigation assets
```

A separação por responsabilidades segue o padrão:

| Pasta | O que fica aqui |
|---|---|
| `components/` | Peças reutilizáveis de UI |
| `screens/` | Telas completas do app |
| `services/` | Acesso a dados (banco local, API) |
| `data/` | Dados estáticos (seed, constantes) |
| `styles/` | Cores, temas e estilos globais |
| `navigation/` | Configuração dos navegadores |

---

## Banco de Dados SQLite

O banco é gerenciado pelo arquivo `src/services/database.js` usando a **API assíncrona** do `expo-sqlite` v14 (Expo SDK 51+).

### Como funciona

```
App inicia
    └── initDatabase()
            ├── openDatabaseAsync('senai_suico.db')
            ├── CREATE TABLE IF NOT EXISTS courses (...)
            ├── CREATE TABLE IF NOT EXISTS contacts (...)
            └── seedIfEmpty() → insere os 15 cursos se o banco estiver vazio
```

### Tabelas criadas

#### `courses`
```sql
CREATE TABLE IF NOT EXISTS courses (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo        TEXT    NOT NULL,
  subtitulo     TEXT,
  nivel         TEXT,
  duracao       TEXT,
  area          TEXT,
  professor     TEXT,
  classificacao REAL    DEFAULT 0,
  descricao     TEXT,
  vagas         INTEGER DEFAULT 0,
  preco         TEXT    DEFAULT 'Gratuito',
  modalidade    TEXT,
  certificado   INTEGER DEFAULT 1,
  created_at    TEXT    DEFAULT (datetime('now'))
);
```

#### `contacts`
```sql
CREATE TABLE IF NOT EXISTS contacts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  nome       TEXT NOT NULL,
  email      TEXT NOT NULL,
  telefone   TEXT,
  mensagem   TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);
```

### Funções exportadas

```js
// database.js
initDatabase()               // inicializa tabelas + seed
getAllCourses()               // SELECT * FROM courses ORDER BY area, titulo
getCourseById(id)            // SELECT * WHERE id = ?
getCoursesByArea(area)       // filtrar por área
searchCourses(query)         // busca em titulo, subtitulo, area, professor
getAreas()                   // lista de áreas distintas
saveContact({ nome, email, telefone, mensagem })  // INSERT em contacts
```

### Exemplo de uso

```js
import { getAllCourses, searchCourses } from '../services/database';

// Listar todos os cursos
const courses = await getAllCourses();

// Buscar por termo
const results = await searchCourses('React');
```

---

## Serviço de API com Axios

O arquivo `src/services/api.js` configura uma instância do Axios para comunicação com o servidor.

### Instância configurada

```js
const api = axios.create({
  baseURL: 'https://api.senai-suico.example.com/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
```

### Interceptors implementados

**Request interceptor** — ideal para adicionar token JWT:
```js
api.interceptors.request.use(config => {
  // config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

**Response interceptor** — normaliza erros:
```js
api.interceptors.response.use(
  response => response.data,
  error => Promise.reject(new Error(error.response?.data?.message ?? error.message))
);
```

### Funções exportadas

```js
sendContactMessage({ nome, email, telefone, mensagem })  // POST /contact
requestEnrollment({ courseId, nome, email, telefone })   // POST /enrollment
subscribeNewsletter({ email })                           // POST /newsletter
```

> **Nota de desenvolvimento:** Em ambiente local sem servidor, as chamadas Axios falharão com erro de rede. O app trata isso com `try/catch` — os contatos são salvos localmente no SQLite e a UX não é prejudicada.

---

## Componentes

### `Button.js`

Botão customizado com quatro variantes e dois tamanhos.

**Props:**
| Prop | Tipo | Padrão | Descrição |
|---|---|---|---|
| `label` | string | — | Texto do botão |
| `onPress` | function | — | Callback de clique |
| `variant` | `'primary'` \| `'secondary'` \| `'outline'` \| `'ghost'` | `'primary'` | Visual |
| `size` | `'sm'` \| `'md'` \| `'lg'` | `'md'` | Tamanho |
| `loading` | boolean | `false` | Mostra spinner |
| `disabled` | boolean | `false` | Desabilita interação |
| `fullWidth` | boolean | `false` | Largura 100% |
| `icon` | ReactNode | — | Ícone à esquerda |

**Exemplo:**
```jsx
<Button
  label="Matricular-se"
  variant="primary"
  size="lg"
  fullWidth
  onPress={handleEnroll}
  icon={<MaterialCommunityIcons name="school-outline" size={18} color="#fff" />}
/>
```

---

### `CourseCard.js`

Card exibido na lista da `HomeScreen`. Mostra faixa colorida por área, título, subtítulo, nível, duração, professor e classificação em estrelas.

**Props:**
| Prop | Tipo | Descrição |
|---|---|---|
| `course` | object | Objeto do curso (vindo do SQLite) |
| `onPress` | function | Callback quando o card é tocado |

---

### `CourseModal.js`

Bottom sheet modal que abre ao tocar em um card. Exibe informações resumidas do curso com botões de **Contato** e **Matricular-se**.

**Props:**
| Prop | Tipo | Descrição |
|---|---|---|
| `visible` | boolean | Controla visibilidade |
| `course` | object | Dados do curso |
| `onClose` | function | Fechar o modal |
| `onViewDetail` | function | Navegar para detalhes completos |

**Campos exibidos:** título, subtítulo, área (com ícone), nível, duração, modalidade, vagas, preço, certificado, professor, classificação, descrição.

---

## Telas

### `HomeScreen.js`

Tela principal com:
- Header com nome da escola e contador de cursos
- Barra de busca com filtro em tempo real (dispara com ≥ 2 caracteres)
- Chips de filtro por área (toggle — clicar novamente remove o filtro)
- `FlatList` paginada com `RefreshControl` (pull-to-refresh)
- `CourseModal` controlado por estado local

### `CourseDetailScreen.js`

Tela de detalhes completos, acessível via:
1. Botão "Ver detalhes completos" no `CourseModal`
2. (Extensível) link direto via parâmetros de navegação

Exibe: hero colorido por área, cards de informações rápidas, professor, descrição, tópicos abordados, pré-requisitos e barra de ação fixada com botões **Contato** e **Matricular-se**.

### `AboutScreen.js`

Página institucional com:
- Estatísticas da escola (70+ anos, 50k+ alunos, 120+ cursos, 300+ empresas)
- Missão, história e valores
- Infraestrutura
- Links de contato e localização clicáveis (abre mapa, telefone, e-mail, site)

### `ContactScreen.js`

Formulário de contato com:
- Canais rápidos (WhatsApp, ligação, e-mail direto)
- Campos: nome, e-mail, telefone, assunto (chips), mensagem
- Validação inline com feedback visual
- Salva localmente no SQLite + tenta enviar via Axios
- Tela de sucesso após envio

---

## Navegação

O app usa **React Navigation v6** com dois navegadores aninhados:

```
NavigationContainer
└── BottomTabNavigator
    ├── Tab: "Cursos"
    │   └── StackNavigator
    │       ├── Screen: HomeMain → HomeScreen
    │       └── Screen: CourseDetail → CourseDetailScreen
    ├── Tab: "Sobre" → AboutScreen
    └── Tab: "Contato" → ContactScreen
```

### Como navegar entre telas

```js
// De HomeScreen para CourseDetailScreen
navigation.navigate('CourseDetail', { course });

// Voltar
navigation.goBack();
```

---

## Estilos e Tema

### Paleta de cores (`colors.js`)

```js
colors.primary      // #CC0000 — vermelho SENAI
colors.secondary    // #003594 — azul escuro
colors.accent       // #FFB81C — dourado
colors.background   // #F5F5F5
colors.surface      // #FFFFFF
```

### Cores por área (`areaColors`)

Cada área tem uma cor distinta para identificação visual nos cards e modais:

```js
'Desenvolvimento Web'    → #4285F4 (azul Google)
'Desenvolvimento Mobile' → #34A853 (verde)
'Backend e APIs'         → #9C27B0 (roxo)
'Banco de Dados'         → #FF5722 (laranja)
'DevOps e Nuvem'         → #607D8B (cinza azulado)
```

### Tema React Native Paper

O tema MD3 é configurado no `App.js` e injetado via `<PaperProvider theme={senaiTheme}>`.

---

## Configurações do App

### `app.json`

```json
{
  "expo": {
    "name": "SENAI Suíço-Brasileira",
    "slug": "senai-suico-brasileira",
    "version": "1.0.0",
    "orientation": "portrait",
    "splash": { "backgroundColor": "#CC0000" },
    "plugins": [["expo-sqlite", { "enableFTS": true }]]
  }
}
```

### `babel.config.js`

```js
module.exports = function (api) {
  api.cache(true);
  return { presets: ['babel-preset-expo'] };
};
```

---

## Como Testar

### 1. Instalar dependências

```bash
npm install
```

### 2. Iniciar o servidor de desenvolvimento

```bash
npx expo start
```

Você verá um **QR Code** no terminal.

### 3. Abrir no celular

- Abra o **Expo Go** no celular
- Escaneie o QR Code
- O app carregará automaticamente

### 4. Abrir no emulador Android

```bash
npx expo start --android
```

> Requer Android Studio com emulador configurado.

### 5. Abrir no simulador iOS (somente macOS)

```bash
npx expo start --ios
```

### 6. Abrir no navegador (Web)

```bash
npx expo start --web
```

### Fluxo de teste recomendado

| Passo | Ação | Resultado esperado |
|---|---|---|
| 1 | Abrir o app | Splash SENAI → lista de 15 cursos |
| 2 | Digitar "React" na busca | Filtrar cursos com React no nome |
| 3 | Tocar em um chip de área | Filtrar por aquela área |
| 4 | Tocar em um card | Abrir CourseModal (bottom sheet) |
| 5 | Tocar "Ver detalhes completos" | Navegar para CourseDetailScreen |
| 6 | Tocar "Matricular-se" | Alerta de confirmação → sucesso |
| 7 | Ir para aba "Sobre" | Ver informações da escola |
| 8 | Ir para aba "Contato" | Preencher formulário |
| 9 | Enviar formulário válido | Tela de sucesso verde |
| 10 | Enviar formulário inválido | Mensagens de erro inline |

### Verificar dados no SQLite

Para inspecionar o banco durante desenvolvimento, use a extensão **SQLite Viewer** no VS Code ou instale o DB Browser for SQLite.

O banco fica em:
```
# Android (via adb)
/data/data/br.com.senai.suicobrasileira/files/SQLite/senai_suico.db

# iOS Simulator
~/Library/Developer/CoreSimulator/Devices/<device-id>/data/Containers/Data/Application/<app-id>/Documents/senai_suico.db
```

---

## Funcionalidades

- [x] Lista de cursos carregada do SQLite
- [x] Busca em tempo real (título, área, professor, subtítulo)
- [x] Filtro por área com chips coloridos
- [x] Pull-to-refresh na lista
- [x] CourseModal (bottom sheet) ao tocar no card
- [x] Tela de detalhes completos do curso
- [x] Botão de matrícula com alerta de confirmação
- [x] Botão de contato abre cliente de e-mail
- [x] AboutScreen com informações institucionais
- [x] Links clicáveis (telefone, e-mail, mapa)
- [x] ContactScreen com formulário validado
- [x] Canais rápidos (WhatsApp, ligação, e-mail)
- [x] Mensagem salva localmente no SQLite
- [x] Tela de sucesso após envio
- [x] Splash screen com carregamento do banco
- [x] Navegação por abas com ícones
- [x] Tema SENAI aplicado globalmente

---

## Cursos Disponíveis

O app inclui **15 cursos** distribuídos em **5 áreas** (≥ 3 por área):

### Desenvolvimento Web (4 cursos)
1. HTML5, CSS3 e JavaScript Essencial — Iniciante — 80h
2. React.js — Desenvolvimento Frontend Avançado — Intermediário — 120h
3. Vue.js 3 e Nuxt — Framework Progressivo — Intermediário — 100h
4. TypeScript para Desenvolvedores JavaScript — Intermediário — 60h

### Desenvolvimento Mobile (3 cursos)
5. React Native com Expo — Do Zero ao App — Intermediário — 140h
6. Flutter e Dart — Apps Nativos Multiplataforma — Iniciante — 130h
7. Desenvolvimento Android com Kotlin e Jetpack — Avançado — 160h

### Backend e APIs (3 cursos)
8. Node.js e Express — API REST Completa — Intermediário — 100h
9. Python com Django REST e FastAPI — Intermediário — 120h
10. GraphQL com Apollo Server e Prisma — Avançado — 80h

### Banco de Dados (3 cursos)
11. PostgreSQL — Banco Relacional Profissional — Iniciante — 80h
12. MongoDB para Desenvolvedores — Intermediário — 70h
13. Redis — Cache e Alta Performance — Avançado — 60h

### DevOps e Nuvem (3 cursos)
14. Docker e Kubernetes na Prática — Intermediário — 110h
15. AWS Cloud — Fundamentos e Certificação — Iniciante — 90h
16. CI/CD com GitHub Actions e GitLab CI — Intermediário — 70h

---

## Licença

Este projeto é de uso educacional e foi desenvolvido para fins de avaliação curricular no SENAI Suíço-Brasileira.

---

*Desenvolvido por alunos do SENAI Suíço-Brasileira · 2025*
