# Script pour pousser le projet sur GitHub
# Usage: .\push-to-github.ps1 -GitHubUsername "votre-username" -RepoName "nom-du-repo"

param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubUsername,
    
    [Parameter(Mandatory=$true)]
    [string]$RepoName
)

Write-Host "🚀 Configuration du dépôt Git pour GitHub..." -ForegroundColor Cyan

# Vérifier si Git est installé
try {
    $gitVersion = git --version
    Write-Host "✅ Git trouvé: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git n'est pas installé ou pas dans le PATH" -ForegroundColor Red
    Write-Host "📥 Installez Git depuis: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Initialiser Git si nécessaire
if (-not (Test-Path .git)) {
    Write-Host "📦 Initialisation du dépôt Git..." -ForegroundColor Cyan
    git init
} else {
    Write-Host "✅ Dépôt Git déjà initialisé" -ForegroundColor Green
}

# Ajouter tous les fichiers
Write-Host "📝 Ajout des fichiers..." -ForegroundColor Cyan
git add .

# Créer le commit
Write-Host "💾 Création du commit..." -ForegroundColor Cyan
$commitMessage = "Initial commit: Coinly platform - Complete MVP with Next.js frontend and NestJS backend"
git commit -m $commitMessage

# Configurer le remote
$remoteUrl = "https://github.com/$GitHubUsername/$RepoName.git"
Write-Host "🔗 Configuration du remote GitHub: $remoteUrl" -ForegroundColor Cyan

# Vérifier si le remote existe déjà
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    Write-Host "⚠️  Remote 'origin' existe déjà: $existingRemote" -ForegroundColor Yellow
    $overwrite = Read-Host "Voulez-vous le remplacer? (o/N)"
    if ($overwrite -eq "o" -or $overwrite -eq "O") {
        git remote set-url origin $remoteUrl
    } else {
        Write-Host "❌ Opération annulée" -ForegroundColor Red
        exit 1
    }
} else {
    git remote add origin $remoteUrl
}

# Créer la branche main si nécessaire
$currentBranch = git branch --show-current
if (-not $currentBranch) {
    git branch -M main
    Write-Host "✅ Branche 'main' créée" -ForegroundColor Green
}

# Pousser vers GitHub
Write-Host "⬆️  Push vers GitHub..." -ForegroundColor Cyan
Write-Host "⚠️  Assurez-vous d'avoir créé le dépôt sur GitHub: https://github.com/new" -ForegroundColor Yellow
Write-Host "⚠️  Vous devrez peut-être vous authentifier" -ForegroundColor Yellow

$push = Read-Host "Continuer le push? (O/n)"
if ($push -eq "n" -or $push -eq "N") {
    Write-Host "❌ Push annulé" -ForegroundColor Red
    exit 1
}

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Push réussi! 🎉" -ForegroundColor Green
    Write-Host "🔗 Votre dépôt: https://github.com/$GitHubUsername/$RepoName" -ForegroundColor Cyan
} else {
    Write-Host "❌ Erreur lors du push" -ForegroundColor Red
    Write-Host "💡 Vérifiez que:" -ForegroundColor Yellow
    Write-Host "   1. Le dépôt existe sur GitHub" -ForegroundColor Yellow
    Write-Host "   2. Vous êtes authentifié (git config --global user.name/email)" -ForegroundColor Yellow
    Write-Host "   3. Vous avez les permissions sur le dépôt" -ForegroundColor Yellow
}


