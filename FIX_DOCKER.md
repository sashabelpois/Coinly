# 🔧 Correction du problème Docker

## Problème résolu

Le problème était que `npm ci` nécessite un fichier `package-lock.json` qui n'existait pas.

## Solution appliquée

J'ai modifié les Dockerfiles pour utiliser `npm install` au lieu de `npm ci` :

- ✅ `backend/Dockerfile` : `npm ci` → `npm install`
- ✅ `frontend/Dockerfile` : `npm ci` → `npm install`

## Relancer Docker

Maintenant vous pouvez relancer :

```cmd
docker compose up --build
```

## Note

`npm install` fonctionne sans `package-lock.json` et le générera automatiquement lors de la première installation dans Docker.

Pour une meilleure reproductibilité en production, vous pouvez générer les `package-lock.json` localement plus tard avec :
```bash
cd backend && npm install
cd ../frontend && npm install
```

Mais pour le développement, `npm install` dans Docker fonctionne parfaitement.

