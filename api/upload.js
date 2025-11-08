import { put } from '@vercel/blob';

export default async function handler(req, res) {
  // Gestion CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Seulement POST autorisé
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode non autorisée. Utilisez POST.' });
    return;
  }

  try {
    // Vérifier que le token est disponible
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      console.error('❌ BLOB_READ_WRITE_TOKEN non défini');
      res.status(500).json({ 
        error: 'Configuration serveur: token Blob manquant',
        details: 'La variable d\'environnement BLOB_READ_WRITE_TOKEN n\'est pas configurée.' 
      });
      return;
    }

    const contentType = req.headers['content-type'] || '';
    
    // Parser le body manuellement pour éviter la limite de 4.5MB
    let body = '';
    await new Promise((resolve, reject) => {
      req.on('data', chunk => {
        body += chunk.toString();
        // Limite de sécurité : arrêter si > 100MB en JSON
        if (body.length > 100 * 1024 * 1024) {
          reject(new Error('Fichier trop volumineux (>100MB)'));
        }
      });
      req.on('end', resolve);
      req.on('error', reject);
    });

    // Si c'est du JSON avec une base64 image
    if (contentType.includes('application/json')) {
      const parsed = JSON.parse(body);
      const { file, filename, path } = parsed;
      
      if (!file) {
        res.status(400).json({ error: 'Aucun fichier fourni dans le body' });
        return;
      }

      // Convertir base64 en buffer
      let fileBuffer;
      let fileType = 'application/octet-stream';
      
      if (typeof file === 'string' && file.startsWith('data:')) {
        // Extraire le type MIME
        const mimeMatch = file.match(/data:([^;]+);base64/);
        if (mimeMatch) fileType = mimeMatch[1];
        
        // Extraire les données base64
        const base64Data = file.split(',')[1] || file;
        
        // Vérifier la taille estimée
        const estimatedSize = (base64Data.length * 3) / 4;
        if (estimatedSize > 50 * 1024 * 1024) {
          res.status(413).json({ 
            error: 'Fichier trop volumineux',
            details: `Taille estimée: ${(estimatedSize / (1024 * 1024)).toFixed(2)}MB (limite: 50MB)`
          });
          return;
        }
        
        fileBuffer = Buffer.from(base64Data, 'base64');
      } else if (typeof file === 'string') {
        fileBuffer = Buffer.from(file, 'base64');
      } else {
        res.status(400).json({ error: 'Format de fichier non supporté' });
        return;
      }

      // Générer un nom de fichier unique
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const providedName = filename || 'file';
      const extension = providedName.includes('.') ? providedName.split('.').pop() : '';
      const baseName = providedName.includes('.') 
        ? providedName.substring(0, providedName.lastIndexOf('.')) 
        : providedName;
      const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9-_]/g, '_');
      
      const blobFileName = path 
        ? `${path}/${sanitizedBaseName}_${timestamp}_${randomSuffix}.${extension || 'bin'}`
        : `${sanitizedBaseName}_${timestamp}_${randomSuffix}.${extension || 'bin'}`;

      console.log(`📤 Upload vers Blob: ${blobFileName} (${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB)`);

      // Upload vers Vercel Blob avec put() - approche simple et directe
      const blob = await put(blobFileName, fileBuffer, {
        access: 'public',
        contentType: fileType,
        token: token,
        addRandomSuffix: false,
      });

      console.log(`✅ Fichier uploadé: ${blob.url}`);

      res.status(200).json({
        success: true,
        url: blob.url,
        pathname: blob.pathname,
        size: fileBuffer.length,
        contentType: fileType,
      });
      return;
    }

    // Si c'est du FormData (multipart/form-data) - non supporté pour l'instant
    res.status(400).json({ 
      error: 'Format non supporté',
      details: 'Utilisez application/json avec le fichier en base64.'
    });

  } catch (error) {
    console.error('❌ Erreur upload Blob:', error);
    
    // Gérer spécifiquement les erreurs de taille
    if (error.message && error.message.includes('trop volumineux')) {
      res.status(413).json({
        error: 'Fichier trop volumineux',
        details: error.message,
      });
      return;
    }
    
    res.status(500).json({
      error: 'Erreur lors de l\'upload',
      details: error.message || String(error),
    });
  }
}

export const config = {
  api: {
    bodyParser: false, // Désactiver le parsing automatique pour gérer manuellement le streaming
  },
  maxDuration: 300, // 5 minutes pour les gros fichiers
};
