# Instructions pour pousser vers GitHub

## Votre dépôt GitHub
**URL**: https://github.com/sashabelpois/Coinly.git

## Option 1 : Script automatique (Windows)

1. **Installer Git** (si pas déjà fait) :
   - Téléchargez depuis : https://git-scm.com/download/win
   - Installez avec les options par défaut
   - **Redémarrez votre terminal/PowerShell après l'installation**

2. **Exécutez le script** :
   ```cmd
   push-to-github.bat
   ```

3. **Authentification** :
   - Si demandé, entrez votre nom d'utilisateur GitHub : `sashabelpois`
   - Pour le mot de passe, utilisez un **Personal Access Token (PAT)** :
     - Créez-en un ici : https://github.com/settings/tokens
     - Sélectionnez les scopes : `repo` (toutes les permissions repo)
     - Copiez le token et utilisez-le comme mot de passe

## Option 2 : Commandes manuelles

Ouvrez PowerShell ou CMD et exécutez :

```bash
# 1. Initialiser Git (si pas déjà fait)
git init

# 2. Configurer votre identité (une seule fois)
git config --global user.name "sashabelpois"
git config --global user.email "votre-email@example.com"

# 3. Ajouter tous les fichiers
git add .

# 4. Créer le commit
git commit -m "Initial commit: HeyCash+ platform - Complete MVP"

# 5. Ajouter le remote GitHub
git remote add origin https://github.com/sashabelpois/Coinly.git

# 6. Créer la branche main
git branch -M main

# 7. Pousser vers GitHub
git push -u origin main
```

## Option 3 : GitHub Desktop (Interface graphique)

1. Téléchargez GitHub Desktop : https://desktop.github.com/
2. Connectez-vous avec votre compte GitHub
3. File → Add Local Repository → Sélectionnez le dossier `earnapp`
4. Cliquez sur "Publish repository"
5. Le dépôt sera poussé automatiquement

## Dépannage

### Erreur : "Git n'est pas reconnu"
- Installez Git depuis https://git-scm.com/download/win
- Redémarrez votre terminal après l'installation
- Vérifiez avec : `git --version`

### Erreur : "Authentication failed"
- Utilisez un Personal Access Token au lieu de votre mot de passe
- Créez un PAT : https://github.com/settings/tokens
- Scope requis : `repo` (toutes les permissions repo)

### Erreur : "Repository not found"
- Vérifiez que le dépôt existe : https://github.com/sashabelpois/Coinly
- Vérifiez que vous avez les permissions d'écriture

### Erreur : "Remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/sashabelpois/Coinly.git
```

## Vérification

Une fois le push réussi, visitez :
https://github.com/sashabelpois/Coinly

Vous devriez voir tous vos fichiers !

