# Instructions pour pousser sur GitHub

## Prérequis
1. Installer Git si ce n'est pas déjà fait : https://git-scm.com/download/win
2. Créer un nouveau dépôt sur GitHub (https://github.com/new)

## Commandes à exécuter

Une fois Git installé et le dépôt GitHub créé, exécutez ces commandes dans PowerShell :

```powershell
# Initialiser Git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Créer le premier commit
git commit -m "Initial commit: HeyCash+ platform - Complete MVP with Next.js frontend and NestJS backend"

# Ajouter le remote GitHub (remplacez YOUR_USERNAME et YOUR_REPO par vos valeurs)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Pousser vers GitHub
git branch -M main
git push -u origin main
```

## Alternative avec GitHub CLI

Si vous avez GitHub CLI installé :

```powershell
# Créer le dépôt et pousser en une commande
gh repo create YOUR_REPO --public --source=. --remote=origin --push
```

## Notes importantes

- Ne poussez JAMAIS les fichiers `.env` contenant des secrets
- Le fichier `.gitignore` est déjà configuré pour exclure les fichiers sensibles
- Vérifiez que tous les secrets sont dans `.env.example` (sans valeurs réelles)


