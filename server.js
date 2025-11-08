#!/usr/bin/env node
// Serveur local avec API pour tester le site

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8080;
const HOST = '0.0.0.0'; // Permet d'accéder depuis d'autres appareils sur le réseau
const DATA_DIR = './api'; // Dossier pour les fichiers JSON

// Créer le dossier api s'il n'existe pas
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

// Headers CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

// Gérer les routes API
function handleAPI(req, res, pathname) {
  const method = req.method;

  // OPTIONS pour CORS
  if (method === 'OPTIONS') {
    res.writeHead(200, { ...corsHeaders });
    res.end();
    return;
  }

  // Health check
  if (pathname === '/api/health' && method === 'GET') {
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      ...corsHeaders 
    });
    res.end(JSON.stringify({ status: 'ok', connected: true }));
    return;
  }

  // Upload de fichiers
  if (pathname === '/api/upload' && method === 'POST') {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      // Pour l'instant, on retourne un DataURL (fallback)
      // Dans un vrai backend, on sauvegarderait le fichier
      res.writeHead(200, { 
        'Content-Type': 'application/json',
        ...corsHeaders 
      });
      res.end(JSON.stringify({ 
        success: true, 
        message: 'Upload géré par localStorage (fallback)' 
      }));
    });
    return;
  }

  // Envoyer un message de contact
  if (pathname === '/api/messages' && method === 'POST') {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      try {
        const data = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        const { telegramUsername, message } = data;

        if (!telegramUsername || !message) {
          res.writeHead(400, { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          });
          res.end(JSON.stringify({ error: 'Nom d\'utilisateur Telegram et message requis' }));
          return;
        }

        // Charger les messages existants
        const messagesPath = path.join(DATA_DIR, 'messages.json');
        let messages = [];
        if (fs.existsSync(messagesPath)) {
          const content = fs.readFileSync(messagesPath, 'utf8');
          messages = JSON.parse(content);
        }

        // Ajouter le nouveau message
        const newMessage = {
          id: Date.now(),
          telegramUsername: telegramUsername.trim(),
          message: message.trim(),
          read: false,
          createdAt: new Date().toISOString()
        };

        messages.push(newMessage);

        // Sauvegarder
        fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2), 'utf8');

        res.writeHead(200, { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        });
        res.end(JSON.stringify({ success: true, message: 'Message envoyé avec succès' }));
      } catch (error) {
        console.error('Erreur POST /api/messages:', error);
        res.writeHead(500, { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        });
        res.end(JSON.stringify({ error: 'Erreur serveur' }));
      }
    });
    return;
  }

  // Extraire le nom du fichier depuis l'URL
  // /api/products.json -> products.json
  const fileName = pathname.replace('/api/', '');
  const filePath = path.join(DATA_DIR, fileName);

  // GET: Lire le fichier JSON
  if (method === 'GET') {
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        res.writeHead(200, { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        });
        res.end(content);
      } else {
        // Fichier n'existe pas, retourner un objet vide ou tableau vide
        const defaultData = fileName.includes('admin_users') ? [] : 
                           fileName.includes('products') ? [] :
                           fileName.includes('categories') ? [] :
                           fileName.includes('farms') ? [] :
                           fileName.includes('promos') ? [] :
                           fileName.includes('socials') ? [] :
                           fileName.includes('cart_services') ? [] :
                           fileName.includes('cart_options') ? [] :
                           fileName.includes('cart_slots') ? [] :
                           fileName.includes('homeSections') ? [] :
                           fileName.includes('messages') ? [] :
                           fileName.includes('reviews') ? [] :
                           {};
        res.writeHead(200, { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        });
        res.end(JSON.stringify(defaultData));
      }
    } catch (error) {
      console.error(`Erreur GET ${filePath}:`, error);
      res.writeHead(500, { 
        'Content-Type': 'application/json',
        ...corsHeaders 
      });
      res.end(JSON.stringify({ error: 'Erreur serveur' }));
    }
    return;
  }

  // PUT: Sauvegarder le fichier JSON
  if (method === 'PUT') {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      try {
        const data = Buffer.concat(chunks).toString('utf8');
        // Valider que c'est du JSON valide
        JSON.parse(data);
        // Sauvegarder le fichier
        fs.writeFileSync(filePath, data, 'utf8');
        res.writeHead(200, { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        });
        res.end(JSON.stringify({ success: true, message: 'Données sauvegardées' }));
      } catch (error) {
        console.error(`Erreur PUT ${filePath}:`, error);
        res.writeHead(400, { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        });
        res.end(JSON.stringify({ error: 'JSON invalide' }));
      }
    });
    return;
  }

  // Méthode non supportée
  res.writeHead(405, { 
    'Content-Type': 'application/json',
    ...corsHeaders 
  });
  res.end(JSON.stringify({ error: 'Méthode non supportée' }));
}

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  const parsedUrl = url.parse(req.url);
  const pathname = parsedUrl.pathname;

  // Gérer les routes API
  if (pathname.startsWith('/api/')) {
    handleAPI(req, res, pathname);
    return;
  }

  // Normaliser l'URL (retirer les backslashes et les query strings)
  let normalizedUrl = pathname.replace(/\\/g, '/');
  
  let filePath = '.' + normalizedUrl;
  
  // Gérer la route racine
  if (filePath === './' || filePath === '.') {
    filePath = './index.html';
  }
  
  // Gérer les routes admin
  if (filePath === './admin' || filePath === './admin/') {
    filePath = './admin/index.html';
  }

  // Les fichiers CSS/JS dans admin/index.html sont référencés comme css/admin.css ou js/utils.js
  // Depuis /admin, le navigateur demande /css/admin.css ou /js/utils.js
  // Il faut donc chercher dans ./admin/css/ et ./admin/js/
  if (normalizedUrl.startsWith('/css/') || normalizedUrl.startsWith('/js/')) {
    const assetPath = './admin' + normalizedUrl;
    // Normaliser avant de vérifier
    const normalizedAssetPath = assetPath.replace(/\\/g, '/');
    try {
      if (fs.existsSync(normalizedAssetPath)) {
        filePath = normalizedAssetPath;
      }
    } catch (e) {
      // Continuer avec le chemin par défaut
    }
  }

  // Normaliser le chemin pour Windows (convertir tous les backslashes en slashes)
  filePath = filePath.replace(/\\/g, '/');
  // Normaliser avec path mais en utilisant les slashes
  filePath = path.join(...filePath.split('/')).replace(/\\/g, '/');

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  // Ajouter CORS pour permettre les requêtes depuis différents ports
  const headers = {
    'Content-Type': contentType,
    ...corsHeaders
  };

  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        console.error(`404: ${filePath} (requête: ${req.url}, normalisée: ${normalizedUrl})`);
        res.writeHead(404, headers);
        res.end('<h1>404 - File Not Found</h1>', 'utf-8');
      } else {
        console.error(`500: ${error.code} - ${filePath}`);
        res.writeHead(500, headers);
        res.end(`Server Error: ${error.code}`, 'utf-8');
      }
    } else {
      res.writeHead(200, headers);
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, HOST, () => {
  const networkInterfaces = require('os').networkInterfaces();
  let ipAddress = 'localhost';
  
  for (const name of Object.keys(networkInterfaces)) {
    for (const net of networkInterfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        ipAddress = net.address;
        break;
      }
    }
  }

  console.log('\n🚀 Serveur démarré avec API!');
  console.log(`\n📍 Accès local:`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`   http://127.0.0.1:${PORT}`);
  console.log(`\n📱 Accès depuis votre téléphone:`);
  console.log(`   http://${ipAddress}:${PORT}`);
  console.log(`\n🔌 API Backend:`);
  console.log(`   http://localhost:${PORT}/api/`);
  console.log(`\n💡 Assurez-vous que votre téléphone est sur le même réseau Wi-Fi`);
  console.log(`\n⏹️  Appuyez sur Ctrl+C pour arrêter le serveur\n`);
});
