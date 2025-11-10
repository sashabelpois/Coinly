# Coinly - Guide de démarrage

## 🚀 Installation rapide

### 1. Prérequis
- Docker & Docker Compose
- Node.js 18+ (optionnel, pour développement local)

### 2. Configuration

#### Backend
Créez `backend/.env` à partir de `backend/.env.example` :
```bash
cd backend
cp .env.example .env
# Éditez .env avec vos valeurs
```

#### Frontend
Créez `frontend/.env.local` à partir de `frontend/.env.example` :
```bash
cd frontend
cp .env.example .env.local
# Éditez .env.local avec vos valeurs
```

### 3. Lancer avec Docker

```bash
# Depuis la racine du projet
docker compose up --build
```

L'application sera accessible sur :
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Swagger: http://localhost:3001/api

### 4. Initialiser la base de données

Dans un nouveau terminal :

```bash
# Accéder au conteneur backend
docker exec -it coinly_backend sh

# Générer Prisma Client
npm run prisma:generate

# Créer les migrations
npm run prisma:migrate

# Seed la base de données (optionnel)
npm run prisma:seed
```

### 5. Développement local (sans Docker)

#### Backend
```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📁 Structure du projet

```
earnapp/
├── frontend/          # Next.js 14 (App Router)
│   ├── app/          # Pages et routes
│   ├── components/   # Composants React
│   └── lib/          # Utilitaires et API
├── backend/          # NestJS API
│   ├── src/          # Code source
│   └── prisma/       # Schéma et migrations
└── docker-compose.yml # Configuration Docker
```

## 🔐 Variables d'environnement importantes

### Backend
- `DATABASE_URL` : URL PostgreSQL
- `REDIS_URL` : URL Redis
- `JWT_SECRET` : Secret pour JWT (changez en production !)
- `CPX_RESEARCH_SECRET`, `ADGATE_SECRET`, etc. : Secrets pour les postbacks

### Frontend
- `NEXT_PUBLIC_API_URL` : URL de l'API backend
- `NEXTAUTH_URL` : URL de l'application
- `NEXTAUTH_SECRET` : Secret NextAuth (changez en production !)

## 🎮 Fonctionnalités

- ✅ Authentification (email/password)
- ✅ Gagner des coins (offres, sondages)
- ✅ Jeux (Pile ou Face, Caisses)
- ✅ Wallet et retraits
- ✅ Parrainage
- ✅ Dashboard admin

## 📝 Prochaines étapes

1. Configurer les providers d'offres (CPX Research, AdGate, etc.)
2. Ajouter NextAuth avec Google/Apple OAuth
3. Implémenter FingerprintJS et anti-fraude
4. Ajouter les duels 1v1
5. Créer l'extension navigateur (SerpClix-like)

## 🐛 Dépannage

### Erreur de connexion à la base de données
- Vérifiez que PostgreSQL est démarré : `docker ps`
- Vérifiez `DATABASE_URL` dans `backend/.env`

### Erreur CORS
- Vérifiez `FRONTEND_URL` dans `backend/.env`
- Vérifiez `NEXT_PUBLIC_API_URL` dans `frontend/.env.local`

### Prisma errors
- Exécutez `npm run prisma:generate` dans le conteneur backend
- Vérifiez que les migrations sont appliquées : `npm run prisma:migrate`


