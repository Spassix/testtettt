import { Redis } from '@upstash/redis';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-admin-key'
};

function getDefaults(name) {
  if (name.includes('admin_users')) return [];
  if (name.includes('products')) return [];
  if (name.includes('categories')) return [];
  if (name.includes('farms')) return [];
  if (name.includes('promos')) return [];
  if (name.includes('socials')) return [];
  if (name.includes('cart_services')) return {};
  if (name.includes('cart_options')) return [];
  if (name.includes('cart_slots')) return [];
  if (name.includes('reviews')) return [];
  if (name.includes('messages')) return [];
  if (name.includes('config')) return {
    shopName: '',
    shopTagline: '',
    siteBackground: '',
    heroTitle: '',
    heroBrand: '',
    heroSubtitle: '',
    servicesButtons: [],
    backendUrl: ''
  };
  return {};
}

export default async function handler(req, res) {
  const method = req.method || 'GET';

  if (method === 'OPTIONS') {
    res.writeHead(200, { ...corsHeaders });
    res.end();
    return;
  }

  try {
    const { key = '', debug } = req.query;
    const safeKey = Array.isArray(key) ? key[0] : String(key || '');
    if (!safeKey || safeKey.includes('..') || safeKey.includes('/')) {
      res.writeHead(400, { 'Content-Type': 'application/json', ...corsHeaders });
      res.end(JSON.stringify({ error: 'Clé invalide' }));
      return;
    }

    const storageKey = `data:${safeKey}`;

    // Debug: vérifier la présence des variables d'env
    if (debug) {
      const present = {
        UPSTASH_REDIS_REST_URL: Boolean(process.env.UPSTASH_REDIS_REST_URL),
        UPSTASH_REDIS_REST_TOKEN: Boolean(process.env.UPSTASH_REDIS_REST_TOKEN),
      };
      res.writeHead(200, { 'Content-Type': 'application/json', ...corsHeaders });
      res.end(JSON.stringify({ ok: true, env: present }));
      return;
    }

    if (method === 'GET') {
      const redis = Redis.fromEnv();
      const value = await redis.get(storageKey);
      const data = value ?? getDefaults(safeKey);
      res.writeHead(200, { 'Content-Type': 'application/json', ...corsHeaders });
      res.end(typeof data === 'string' ? data : JSON.stringify(data));
      return;
    }

    if (method === 'PUT') {
      let body = '';
      await new Promise(resolve => {
        req.on('data', chunk => (body += chunk));
        req.on('end', resolve);
      });

      const parsed = JSON.parse(body || 'null');
      const redis = Redis.fromEnv();
      await redis.set(storageKey, parsed);
      res.writeHead(200, { 'Content-Type': 'application/json', ...corsHeaders });
      res.end(JSON.stringify({ success: true }));
      return;
    }

    res.writeHead(405, { 'Content-Type': 'application/json', ...corsHeaders });
    res.end(JSON.stringify({ error: 'Méthode non supportée' }));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json', ...corsHeaders });
    res.end(JSON.stringify({ error: 'Erreur serveur', details: String(err && err.message ? err.message : err) }));
  }
}

export const config = {
  api: {
    bodyParser: false,
    // Augmenter la limite de taille pour accepter des données volumineuses (50MB max)
    maxDuration: 60,
  },
  // Configuration pour augmenter la limite de payload
  maxDuration: 60,
};


