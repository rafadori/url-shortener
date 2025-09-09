# 🔗 Encurtador de URLs

Um encurtador de URLs simples e funcional desenvolvido com Node.js e Express.js. Este projeto foi criado com foco no aprendizado e demonstra conceitos fundamentais de desenvolvimento web backend.

## 🚀 Funcionalidades

- ✅ Encurtamento de URLs longas
- ✅ Redirecionamento automático
- ✅ Validação de URLs
- ✅ Interface web intuitiva
- ✅ Estatísticas de cliques
- ✅ API REST completa
- ✅ Tratamento de erros
- ✅ Armazenamento em memória

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web minimalista
- **Validator** - Biblioteca para validação de dados
- **CORS** - Middleware para Cross-Origin Resource Sharing
- **dotenv** - Gerenciamento de variáveis de ambiente

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd url-shortener
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (opcional):
```bash
# O arquivo .env já está configurado com valores padrão
# Você pode modificar a porta se necessário
PORT=3000
```

4. Inicie o servidor:
```bash
npm start
```

Ou para desenvolvimento com auto-reload:
```bash
npm run dev
```

## 🌐 Como Usar

### Interface Web
1. Acesse `http://localhost:3000`
2. Digite uma URL válida (ex: https://www.google.com)
3. Clique em "Encurtar URL"
4. Use a URL encurtada gerada

### API Endpoints

#### Encurtar URL
```http
POST /shorten
Content-Type: application/json

{
  "url": "https://www.exemplo.com"
}
```

**Resposta:**
```json
{
  "shortUrl": "http://localhost:3000/abc123",
  "code": "abc123"
}
```

#### Redirecionar
```http
GET /:code
```
Redirecionará automaticamente para a URL original.

#### Ver Estatísticas
```http
GET /stats/:code
```

**Resposta:**
```json
{
  "code": "abc123",
  "originalUrl": "https://www.exemplo.com",
  "createdAt": "2024-01-10T10:30:00.000Z",
  "totalClicks": 5,
  "recentClicks": [...]
}
```

#### Listar Todas as URLs
```http
GET /api/urls
```

## 🏗️ Arquitetura do Projeto

```
url-shortener/
├── server.js          # Servidor principal
├── package.json       # Dependências e scripts
├── .env              # Variáveis de ambiente
└── README.md         # Documentação
```

## 🧠 Conceitos Aprendidos

### 1. **Servidor HTTP com Express.js**
- Criação de rotas GET e POST
- Middleware para parsing de JSON
- Servir arquivos estáticos
- Tratamento de parâmetros de rota

### 2. **Validação de Dados**
- Uso da biblioteca `validator` para validar URLs
- Tratamento de erros de validação
- Respostas HTTP apropriadas (400, 404, etc.)

### 3. **Geração de Códigos Únicos**
- Algoritmo para gerar códigos aleatórios
- Verificação de unicidade
- Caracteres alfanuméricos seguros

### 4. **Armazenamento de Dados**
- Uso de `Map` para armazenamento em memória
- Estrutura de dados para URLs e analytics
- Relacionamento entre códigos e URLs originais

### 5. **API RESTful**
- Endpoints bem definidos
- Códigos de status HTTP corretos
- Respostas em JSON padronizadas

### 6. **Frontend Integrado**
- HTML, CSS e JavaScript vanilla
- Fetch API para comunicação com backend
- Interface responsiva e intuitiva

### 7. **Analytics Básicas**
- Contagem de cliques
- Histórico de acessos
- Coleta de metadados (User-Agent, IP)

## 🔧 Melhorias Futuras

- [ ] Banco de dados persistente (MongoDB/PostgreSQL)
- [ ] Autenticação de usuários
- [ ] Dashboard de analytics avançado
- [ ] Cache com Redis
- [ ] Rate limiting
- [ ] URLs customizadas
- [ ] Expiração de URLs
- [ ] QR Code generation
- [ ] Testes automatizados

## 🚨 Limitações Atuais

- **Armazenamento em memória**: Os dados são perdidos quando o servidor reinicia
- **Sem autenticação**: Qualquer pessoa pode criar URLs encurtadas
- **Sem rate limiting**: Possível spam de criação de URLs
- **Códigos não customizáveis**: Códigos são sempre gerados aleatoriamente

## 📚 Recursos para Aprendizado

### Node.js
- [Documentação oficial do Node.js](https://nodejs.org/docs/)
- [Node.js Tutorial - W3Schools](https://www.w3schools.com/nodejs/)

### Express.js
- [Documentação oficial do Express](https://expressjs.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

### JavaScript
- [MDN Web Docs - JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- [JavaScript.info](https://javascript.info/)

---

⭐ Se este projeto te ajudou a aprender, considere dar uma estrela no repositório!