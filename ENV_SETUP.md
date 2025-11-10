# Configuration des variables d'environnement

## Fichiers à créer

1. **`.env`** à la racine du projet (copiez depuis `.env.example`)
2. **`backend/.env`** pour le backend (optionnel, utilise les variables du `.env` racine)
3. **`frontend/.env.local`** pour le frontend (optionnel, utilise les variables du `.env` racine)

## Variables d'environnement requises

### Application de base

```env
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001
PORT=3001
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Base de données

```env
DATABASE_URL=postgresql://coinly:coinly_password@postgres:5432/coinly_db
```

### Redis

```env
REDIS_URL=redis://redis:6379
REDIS_HOST=redis
REDIS_PORT=6379
```

### Authentification

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-change-this-in-production
```

### OAuth (Google & Apple)

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

APPLE_CLIENT_ID=your-apple-client-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY=your-apple-private-key
```

### Offerwalls

```env
# CPX Research
CPX_APP_ID=29900
CPX_SECURE_HASH=your_cpx_secure_hash
# Postback URL à configurer dans CPX Dashboard: https://yourdomain.com/api/postbacks/cpx

# AdGate Media
ADGATE_API_KEY=your_adgate_api_key
ADGATE_API_SECRET=your_adgate_api_secret

# AyeT-Studios
AYET_API_KEY=your_ayet_api_key
AYET_API_SECRET=your_ayet_api_secret

# Lootably
LOOTABLY_API_KEY=your_lootably_api_key
LOOTABLY_API_SECRET=your_lootably_api_secret
```

### Anti-fraude

```env
# FingerprintJS (clé publique pour le frontend)
NEXT_PUBLIC_FINGERPRINTJS_API_KEY=your_fingerprintjs_public_key

# IPQualityScore
IPQUALITYSCORE_API_KEY=your_ipqualityscore_api_key
```

### KYC

```env
# Sumsub
SUMSUB_APP_TOKEN=your_sumsub_app_token
SUMSUB_SECRET_KEY=your_sumsub_secret_key

# Veriff
VERIFF_API_KEY=your_veriff_api_key
VERIFF_SECRET_KEY=your_veriff_secret_key
```

### Paiements

```env
# Tremendous (pour les cartes cadeaux)
TREMENDOUS_API_KEY=your_tremendous_api_key
```

### Captcha

```env
# hCaptcha
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your_hcaptcha_site_key
HCAPTCHA_SECRET_KEY=your_hcaptcha_secret_key

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
TURNSTILE_SECRET_KEY=your_turnstile_secret_key
```

### Monitoring (optionnel)

```env
SENTRY_DSN=your_sentry_dsn
```

## Instructions

1. Copiez le fichier `.env.example` en `.env` :
   ```bash
   cp .env.example .env
   ```

2. Modifiez le fichier `.env` et remplissez les valeurs nécessaires

3. Pour le développement local avec Docker, les valeurs par défaut fonctionnent pour :
   - Database (via docker-compose)
   - Redis (via docker-compose)
   - JWT_SECRET (généré automatiquement)

4. Les clés API des offerwalls doivent être obtenues depuis les dashboards respectifs :
   - CPX Research : https://www.cpx-research.com/
   - AdGate Media : https://www.adgatemedia.com/
   - AyeT-Studios : https://ayet-studios.com/
   - Lootably : https://lootably.com/

## Sécurité

⚠️ **IMPORTANT** : Ne commitez jamais le fichier `.env` dans Git. Il est déjà dans `.gitignore`.

Pour la production, utilisez les variables d'environnement de votre plateforme :
- Vercel (frontend)
- Railway/Render (backend)

