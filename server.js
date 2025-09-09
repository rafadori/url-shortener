const express = require('express');
const cors = require('cors');
const validator = require('validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Armazenamento em memória para URLs (em produção, use um banco de dados)
const urlDatabase = new Map();
const analytics = new Map();

// Função para gerar código único
function generateShortCode() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Função para validar URL
function isValidUrl(url) {
  return validator.isURL(url, {
    protocols: ['http', 'https'],
    require_protocol: true
  });
}

// Rota principal - página inicial
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Encurtador de URLs</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: 50px auto;
                padding: 20px;
                background-color: #f5f5f5;
            }
            .container {
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 {
                color: #333;
                text-align: center;
            }
            input[type="url"] {
                width: 100%;
                padding: 12px;
                margin: 10px 0;
                border: 1px solid #ddd;
                border-radius: 5px;
                font-size: 16px;
            }
            button {
                background-color: #007bff;
                color: white;
                padding: 12px 24px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                width: 100%;
            }
            button:hover {
                background-color: #0056b3;
            }
            .result {
                margin-top: 20px;
                padding: 15px;
                background-color: #e9f7ef;
                border-radius: 5px;
                display: none;
            }
            .error {
                background-color: #f8d7da;
                color: #721c24;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔗 Encurtador de URLs</h1>
            <p>Digite uma URL para encurtar:</p>
            <input type="url" id="urlInput" placeholder="https://exemplo.com" required>
            <button onclick="shortenUrl()">Encurtar URL</button>
            <div id="result" class="result"></div>
        </div>

        <script>
            async function shortenUrl() {
                const url = document.getElementById('urlInput').value;
                const resultDiv = document.getElementById('result');
                
                if (!url) {
                    showResult('Por favor, digite uma URL válida.', true);
                    return;
                }

                try {
                    const response = await fetch('/shorten', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ url: url })
                    });

                    const data = await response.json();
                    
                    if (response.ok) {
                        showResult(\`URL encurtada: <a href="\${data.shortUrl}" target="_blank">\${data.shortUrl}</a>\`, false);
                    } else {
                        showResult(data.error || 'Erro ao encurtar URL', true);
                    }
                } catch (error) {
                    showResult('Erro de conexão. Tente novamente.', true);
                }
            }

            function showResult(message, isError) {
                const resultDiv = document.getElementById('result');
                resultDiv.innerHTML = message;
                resultDiv.className = isError ? 'result error' : 'result';
                resultDiv.style.display = 'block';
            }

            // Permitir envio com Enter
            document.getElementById('urlInput').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    shortenUrl();
                }
            });
        </script>
    </body>
    </html>
  `);
});

// Rota para encurtar URL
app.post('/shorten', (req, res) => {
  const { url } = req.body;
  
  // Validar URL
  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: 'URL inválida. Use o formato: https://exemplo.com' });
  }
  
  // Verificar se a URL já foi encurtada
  for (const [code, data] of urlDatabase.entries()) {
    if (data.originalUrl === url) {
      const shortUrl = `${req.protocol}://${req.get('host')}/${code}`;
      return res.json({ shortUrl, code });
    }
  }
  
  // Gerar código único
  let shortCode;
  do {
    shortCode = generateShortCode();
  } while (urlDatabase.has(shortCode));
  
  // Salvar no "banco de dados"
  urlDatabase.set(shortCode, {
    originalUrl: url,
    createdAt: new Date(),
    clicks: 0
  });
  
  // Inicializar analytics
  analytics.set(shortCode, {
    totalClicks: 0,
    clickHistory: []
  });
  
  const shortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;
  
  res.json({ shortUrl, code: shortCode });
});

// Rota para redirecionar URL encurtada
app.get('/:code', (req, res) => {
  const { code } = req.params;
  
  const urlData = urlDatabase.get(code);
  
  if (!urlData) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>URL não encontrada</title>
          <style>
              body { font-family: Arial, sans-serif; text-align: center; margin-top: 100px; }
              .error { color: #dc3545; }
          </style>
      </head>
      <body>
          <h1 class="error">❌ URL não encontrada</h1>
          <p>O código fornecido não corresponde a nenhuma URL encurtada.</p>
          <a href="/">← Voltar ao início</a>
      </body>
      </html>
    `);
  }
  
  // Incrementar contador de cliques
  urlData.clicks++;
  
  // Atualizar analytics
  const analyticsData = analytics.get(code);
  analyticsData.totalClicks++;
  analyticsData.clickHistory.push({
    timestamp: new Date(),
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });
  
  // Redirecionar para a URL original
  res.redirect(urlData.originalUrl);
});

// Rota para ver estatísticas
app.get('/stats/:code', (req, res) => {
  const { code } = req.params;
  
  const urlData = urlDatabase.get(code);
  const analyticsData = analytics.get(code);
  
  if (!urlData) {
    return res.status(404).json({ error: 'URL não encontrada' });
  }
  
  res.json({
    code,
    originalUrl: urlData.originalUrl,
    createdAt: urlData.createdAt,
    totalClicks: analyticsData.totalClicks,
    recentClicks: analyticsData.clickHistory.slice(-10) // Últimos 10 cliques
  });
});

// Rota para listar todas as URLs (para desenvolvimento)
app.get('/api/urls', (req, res) => {
  const urls = [];
  for (const [code, data] of urlDatabase.entries()) {
    urls.push({
      code,
      originalUrl: data.originalUrl,
      shortUrl: `${req.protocol}://${req.get('host')}/${code}`,
      createdAt: data.createdAt,
      clicks: data.clicks
    });
  }
  res.json(urls);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📝 Acesse http://localhost:${PORT} para usar o encurtador`);
  console.log(`📊 Veja todas as URLs em http://localhost:${PORT}/api/urls`);
});

// Tratamento de erros
process.on('uncaughtException', (err) => {
  console.error('Erro não capturado:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promise rejeitada:', reason);
});