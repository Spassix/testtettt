# 🔧 Configuration des variables d'environnement Vercel

## 📋 Instructions pour configurer les variables dans Vercel Dashboard

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet **plug-certifie**
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez/modifiez les variables suivantes :

### Variables à ajouter

| Variable | Valeur | Environnements |
|----------|--------|----------------|
| `UPSTASH_REDIS_REST_URL` | `https://regular-vulture-33719.upstash.io` | ✅ Production, ✅ Preview, ✅ Development |
| `UPSTASH_REDIS_REST_TOKEN` | `AYO3AAIncDI0NzYyZWViM2VmZWU0MmMyOTI1NDdmN2I5YWRlYzE1MnAyMzM3MTk` | ✅ Production, ✅ Preview, ✅ Development |
| `UPSTASH_KV_REST_API_URL` | `https://regular-vulture-33719.upstash.io` | ✅ Production, ✅ Preview, ✅ Development |
| `UPSTASH_KV_REST_API_TOKEN` | `AYO3AAIncDI0NzYyZWViM2VmZWU0MmMyOTI1NDdmN2I5YWRlYzE1MnAyMzM3MTk` | ✅ Production, ✅ Preview, ✅ Development |
| `UPSTASH_KV_REST_API_READ_ONLY_TOKEN` | `AoO3AAIgcDKEUHABy3nBeHCdEPsqpoj_598kVBjzKrK5R2QAg3na2Q` | ✅ Production, ✅ Preview, ✅ Development |

### Optionnel (si nécessaire)

| Variable | Valeur | Environnements |
|----------|--------|----------------|
| `UPSTASH_KV_URL` | `rediss://default:AYO3AAIncDI0NzYyZWViM2VmZWU0MmMyOTI1NDdmN2I5YWRlYzE1MnAyMzM3MTk@regular-vulture-33719.upstash.io:6379` | ✅ Production, ✅ Preview, ✅ Development |
| `UPSTASH_REDIS_URL` | `rediss://default:AYO3AAIncDI0NzYyZWViM2VmZWU0MmMyOTI1NDdmN2I5YWRlYzE1MnAyMzM3MTk@regular-vulture-33719.upstash.io:6379` | ✅ Production, ✅ Preview, ✅ Development |

## ⚠️ Important

- **Cochez TOUTES les cases** (Production, Preview, Development) pour chaque variable
- Après avoir ajouté les variables, **redéployez** le projet
- Les anciennes variables liées à `choice-sunbeam-5206` peuvent être supprimées

## 🚀 Après configuration

1. Redéployez le projet via le dashboard Vercel ou utilisez :
   ```bash
   vercel --prod
   ```

2. Vérifiez que tout fonctionne :
   ```bash
   curl "https://plug-certifie.vercel.app/api/db/config.json?debug=1"
   ```

## 📝 Notes

- L'instance Upstash a changé de `choice-sunbeam-5206` à `regular-vulture-33719`
- Le domaine a changé de `mexicain59.vercel.app` à `plug-certifie.vercel.app`

