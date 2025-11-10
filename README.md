# HeyCash+ / CoinPlay

Plateforme moderne et ludique permettant aux utilisateurs de gagner de l'argent réel en ligne via des actions rémunérées et des mini-jeux.

## 🚀 Démarrage rapide

### Méthode simple (Windows)

1. **Installer Docker Desktop** : https://www.docker.com/products/docker-desktop/

2. **Lancer le script automatique** :
   ```cmd
   start-local.bat
   ```

3. **Initialiser la base de données** (dans un nouveau terminal) :
   ```cmd
   init-database.bat
   ```

4. **Accéder au site** : http://localhost:3000

### Méthode manuelle

1. **Créer les fichiers `.env`** :
   - `backend/.env` (copier depuis `backend/.env.example`)
   - `frontend/.env.local` (copier depuis `frontend/.env.example`)

2. **Lancer avec Docker** :
   ```bash
   docker compose up --build
   ```

3. **Initialiser la base de données** (nouveau terminal) :
   ```bash
   docker exec -it heycash_backend sh
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```

4. **Accéder à l'application** :
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Swagger: http://localhost:3001/api

📖 **Guide complet** : Voir [LANCER_LOCAL.md](./LANCER_LOCAL.md) pour les détails et le dépannage

### Développement local (sans Docker)

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
├── frontend/          # Next.js App Router
├── backend/           # NestJS API
├── docker-compose.yml # Configuration Docker
└── README.md
```

## 🛠️ Technologies

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- NextAuth.js
- shadcn/ui
- React Query
- Recharts

### Backend
- NestJS
- Prisma
- PostgreSQL
- Redis + BullMQ
- JWT Auth
- WebSocket
- Swagger

## 🔐 Variables d'environnement

Voir `.env.example` dans chaque dossier (frontend/backend)

## 📝 Pousser sur GitHub

**Dépôt GitHub** : https://github.com/sashabelpois/Coinly.git

### Méthode rapide (Windows)

1. **Installer Git** : https://git-scm.com/download/win
2. **Exécuter le script** :
   ```cmd
   push-to-github.bat
   ```

### Méthode manuelle

```bash
git init
git add .
git commit -m "Initial commit: HeyCash+ platform"
git remote add origin https://github.com/sashabelpois/Coinly.git
git branch -M main
git push -u origin main
```

📖 **Instructions détaillées** : Voir [PUSH_INSTRUCTIONS.md](./PUSH_INSTRUCTIONS.md)

## 📝 License

MIT

