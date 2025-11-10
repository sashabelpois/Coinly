# 🚀 Guide pour lancer le site en local

## Option 1 : Avec Docker (Recommandé - Plus simple)

### Étape 1 : Installer Docker Desktop

1. **Téléchargez Docker Desktop pour Windows** :
   - https://www.docker.com/products/docker-desktop/
   - Téléchargez l'installateur `.exe`

2. **Installez Docker Desktop** :
   - Exécutez l'installateur
   - Suivez les instructions (redémarrage peut être nécessaire)
   - Démarrez Docker Desktop après l'installation

3. **Vérifiez l'installation** :
   ```cmd
   docker --version
   docker compose version
   ```

### Étape 2 : Configurer les variables d'environnement

#### Backend
Créez le fichier `backend/.env` :
```bash
cd backend
copy .env.example .env
```

Puis éditez `backend/.env` avec ces valeurs minimales :
```env
DATABASE_URL=postgresql://coinly:coinly_password@postgres:5432/coinly_db
REDIS_URL=redis://redis:6379
JWT_SECRET=changez-moi-en-production-avec-une-cle-secrete-longue
JWT_EXPIRES_IN=7d
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

#### Frontend
Créez le fichier `frontend/.env.local` :
```bash
cd frontend
copy .env.example .env.local
```

Puis éditez `frontend/.env.local` :
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=changez-moi-en-production-avec-une-cle-secrete-longue
```

### Étape 3 : Lancer avec Docker Compose

Depuis la racine du projet (`earnapp`) :
```cmd
docker compose up --build
```

Cette commande va :
- Télécharger les images (PostgreSQL, Redis)
- Construire le backend et le frontend
- Démarrer tous les services

**Premier lancement** : Cela peut prendre 5-10 minutes pour télécharger les images.

### Étape 4 : Initialiser la base de données

Dans un **nouveau terminal** (gardez Docker en cours d'exécution) :

```cmd
# Accéder au conteneur backend
docker exec -it coinly_backend sh

# Générer Prisma Client
npm run prisma:generate

# Créer les tables
npm run prisma:migrate

# Remplir avec des données de test (optionnel)
npm run prisma:seed

# Sortir du conteneur
exit
```

### Étape 5 : Accéder au site

Une fois tout démarré, ouvrez votre navigateur :

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:3001
- **Swagger (Documentation API)** : http://localhost:3001/api

### Commandes utiles Docker

```cmd
# Arrêter les conteneurs
docker compose down

# Voir les logs
docker compose logs -f

# Redémarrer
docker compose restart

# Reconstruire après modifications
docker compose up --build
```

---

## Option 2 : Sans Docker (Développement local)

Si vous préférez ne pas utiliser Docker, vous devez installer manuellement :

### Prérequis

1. **Node.js 18+** : https://nodejs.org/
2. **PostgreSQL** : https://www.postgresql.org/download/windows/
3. **Redis** : https://redis.io/download (ou utiliser Redis Cloud gratuit)

### Installation

#### 1. Installer PostgreSQL

- Téléchargez depuis : https://www.postgresql.org/download/windows/
- Installez avec un mot de passe (ex: `postgres`)
- Notez le mot de passe, vous en aurez besoin

#### 2. Installer Redis (optionnel - peut utiliser Redis Cloud)

- Windows : Utilisez WSL2 ou Redis Cloud (gratuit) : https://redis.com/try-free/

#### 3. Configurer le Backend

```cmd
cd backend

# Installer les dépendances
npm install

# Créer le fichier .env
copy .env.example .env
```

Éditez `backend/.env` :
```env
DATABASE_URL=postgresql://postgres:VOTRE_MOT_DE_PASSE@localhost:5432/coinly_db
REDIS_URL=redis://localhost:6379
# ou pour Redis Cloud : redis://default:password@redis-cloud-url:port
JWT_SECRET=changez-moi-en-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

```cmd
# Générer Prisma Client
npm run prisma:generate

# Créer la base de données (dans PostgreSQL)
# Créez une base de données nommée "coinly_db"

# Créer les tables
npm run prisma:migrate

# Seed (optionnel)
npm run prisma:seed

# Démarrer le backend
npm run start:dev
```

Le backend sera sur : http://localhost:3001

#### 4. Configurer le Frontend

Dans un **nouveau terminal** :

```cmd
cd frontend

# Installer les dépendances
npm install

# Créer le fichier .env.local
copy .env.example .env.local
```

Éditez `frontend/.env.local` :
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=changez-moi-en-production
```

```cmd
# Démarrer le frontend
npm run dev
```

Le frontend sera sur : http://localhost:3000

---

## 🐛 Dépannage

### Erreur : "Cannot connect to Docker daemon"
- Vérifiez que Docker Desktop est démarré
- Redémarrez Docker Desktop

### Erreur : "Port already in use"
- Arrêtez les autres applications utilisant les ports 3000, 3001, 5432, 6379
- Ou changez les ports dans `docker-compose.yml`

### Erreur : "Database connection failed"
- Vérifiez que PostgreSQL est démarré (si sans Docker)
- Vérifiez `DATABASE_URL` dans `backend/.env`

### Erreur : "Prisma Client not generated"
```cmd
docker exec -it coinly_backend sh
npm run prisma:generate
```

### Les pages ne se chargent pas
- Vérifiez les logs : `docker compose logs -f`
- Vérifiez que tous les services sont démarrés : `docker compose ps`

---

## ✅ Vérification que tout fonctionne

1. **Frontend accessible** : http://localhost:3000
2. **Backend accessible** : http://localhost:3001/api (devrait afficher Swagger)
3. **Base de données** : Les tables sont créées
4. **Test d'inscription** : Créez un compte sur http://localhost:3000/auth/register

---

## 📝 Notes

- **Premier lancement** : Peut prendre 5-10 minutes (téléchargement des images Docker)
- **Modifications de code** : Le hot-reload fonctionne automatiquement
- **Base de données** : Les données persistent dans Docker volumes
- **Arrêter tout** : `docker compose down` (garde les données) ou `docker compose down -v` (supprime tout)


