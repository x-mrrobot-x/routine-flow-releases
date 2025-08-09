const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5000;
const WATCH_DIR = './src';

// MIME types mapping
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Armazenar conexões SSE
let sseClients = [];

// Script de live reload para injetar no HTML
const liveReloadScript = `
<script>
(function() {
  const eventSource = new EventSource('/live-reload');
  eventSource.onmessage = function(event) {
    if (event.data === 'reload') {
      console.log('🔄 Arquivo modificado, recarregando página...');
      location.reload();
    }
  };
  eventSource.onopen = function() {
    console.log('🔌 Live reload conectado');
  };
  eventSource.onerror = function() {
    console.log('🔌 Live reload erro, tentando reconectar...');
  };
})();
</script>
`;

const server = http.createServer((req, res) => {
  // Endpoint para Server-Sent Events
  if (req.url === '/live-reload') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });
    
    // Adicionar cliente à lista
    sseClients.push(res);
    
    // Remover cliente quando conexão for fechada
    req.on('close', () => {
      sseClients = sseClients.filter(client => client !== res);
    });
    
    // Enviar ping inicial
    res.write('data: connected\n\n');
    return;
  }
  
  let filePath = '.' + req.url;
  
  // Default to index.html for root path
  if (filePath === './') {
    filePath = './index.html';
  }
  
  // Handle SPA routing - serve index.html for unknown routes
  if (!fs.existsSync(filePath) && !path.extname(filePath)) {
    filePath = './index.html';
  }
  
  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeType = mimeTypes[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - File Not Found</h1>');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      let finalContent = content;
      
      // Injetar script de live reload em arquivos HTML
      if (extname === '.html') {
        const contentStr = content.toString();
        if (contentStr.includes('</body>')) {
          finalContent = contentStr.replace('</body>', liveReloadScript + '\n</body>');
        } else if (contentStr.includes('</html>')) {
          finalContent = contentStr.replace('</html>', liveReloadScript + '\n</html>');
        } else {
          finalContent = contentStr + liveReloadScript;
        }
      }
      
      res.writeHead(200, { 
        'Content-Type': mimeType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      res.end(finalContent, 'utf-8');
    }
  });
});

// Função para notificar clientes sobre mudanças
function notifyReload() {
  console.log(`📡 Notificando ${sseClients.length} clientes conectados`);
  sseClients.forEach(client => {
    try {
      client.write('data: reload\n\n');
    } catch (err) {
      // Remover clientes desconectados
      sseClients = sseClients.filter(c => c !== client);
    }
  });
}

// Função para monitorar mudanças nos arquivos
function watchFiles() {
  if (!fs.existsSync(WATCH_DIR)) {
    console.log(`⚠️  Pasta ${WATCH_DIR} não encontrada. Criando...`);
    fs.mkdirSync(WATCH_DIR, { recursive: true });
  }

  let reloadTimeout;
  
  const watcher = fs.watch(WATCH_DIR, { recursive: true }, (eventType, filename) => {
    if (filename && !filename.includes('.tmp') && !filename.startsWith('.')) {
      console.log(`📝 Arquivo modificado: ${filename}`);
      
      if (reloadTimeout) {
        clearTimeout(reloadTimeout);
      }
      
      // Debounce de 300ms
      reloadTimeout = setTimeout(() => {
        notifyReload();
      }, 300);
    }
  });

  // Também monitorar arquivos na raiz
  const rootWatcher = fs.watch('.', (eventType, filename) => {
    if (filename && (filename.endsWith('.html') || filename.endsWith('.css') || filename.endsWith('.js')) && !filename.startsWith('.')) {
      console.log(`📝 Arquivo raiz modificado: ${filename}`);
      
      if (reloadTimeout) {
        clearTimeout(reloadTimeout);
      }
      
      reloadTimeout = setTimeout(() => {
        notifyReload();
      }, 300);
    }
  });

  process.on('SIGINT', () => {
    console.log('\n👋 Parando servidor...');
    watcher.close();
    rootWatcher.close();
    server.close();
    process.exit(0);
  });
}

// Iniciar servidor
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando em http://0.0.0.0:${PORT}`);
  console.log(`📱 Routine Flow disponível no preview`);
  console.log(`👀 Monitorando mudanças em: ${WATCH_DIR} e arquivos raiz`);
  console.log(`✨ Live reload ativo! (Server-Sent Events)`);
});

// Iniciar monitoramento
watchFiles();