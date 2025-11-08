# 🔧 Configuration Upstash - plug-certifie

## Variables d'environnement à configurer dans Vercel

### Nouvelle instance Upstash - regular-vulture-33719

Configurez ces variables dans **Settings → Environment Variables** sur Vercel :

#### Variables principales (pour Redis.fromEnv())
- **UPSTASH_REDIS_REST_URL** : `https://regular-vulture-33719.upstash.io`
- **UPSTASH_REDIS_REST_TOKEN** : `AYO3AAIncDI0NzYyZWViM2VmZWU0MmMyOTI1NDdmN2I5YWRlYzE1MnAyMzM3MTk`

#### Variables KV (pour compatibilité)
- **UPSTASH_KV_REST_API_URL** : `https://regular-vulture-33719.upstash.io`
- **UPSTASH_KV_REST_API_TOKEN** : `AYO3AAIncDI0NzYyZWViM2VmZWU0MmMyOTI1NDdmN2I5YWRlYzE1MnAyMzM3MTk`
- **UPSTASH_KV_REST_API_READ_ONLY_TOKEN** : `AoO3AAIgcDKEUHABy3nBeHCdEPsqpoj_598kVBjzKrK5R2QAg3na2Q`

#### Variables supplémentaires (optionnelles)
- **UPSTASH_KV_URL** : `rediss://default:AYO3AAIncDI0NzYyZWViM2VmZWU0MmMyOTI1NDdmN2I5YWRlYzE1MnAyMzM3MTk@regular-vulture-33719.upstash.io:6379`
- **UPSTASH_REDIS_URL** : `rediss://default:AYO3AAIncDI0NzYyZWViM2VmZWU0MmMyOTI1NDdmN2I5YWRlYzE1MnAyMzM3MTk@regular-vulture-33719.upstash.io:6379`

**⚠️ Important** : Cochez toutes les cases pour **Production**, **Preview**, et **Development**

## 🌐 Nouveau domaine

**URL de production** : `https://plug-certifie.vercel.app`

## 🚀 Déploiement

Après avoir configuré les variables d'environnement dans Vercel :

```bash
# Redéployer en production
vercel --prod
```

Ou via le dashboard Vercel en poussant vers votre repository Git.

## ✅ Vérification

Pour vérifier que les variables sont bien configurées :

```bash
# Vérifier les variables d'environnement
curl "https://plug-certifie.vercel.app/api/db/config.json?debug=1"
```

Vous devriez voir :
```json
{
  "ok": true,
  "env": {
    "UPSTASH_REDIS_REST_URL": true,
    "UPSTASH_REDIS_REST_TOKEN": true
  }
}
```

## 📝 Notes

- L'ancienne instance était : `choice-sunbeam-5206.upstash.io`
- La nouvelle instance est : `regular-vulture-33719.upstash.io`
- Le domaine a changé de `mexicain59.vercel.app` à `plug-certifie.vercel.app`

