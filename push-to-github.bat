@echo off
echo ========================================
echo Push vers GitHub - Coinly
echo ========================================
echo.

REM Vérifier si Git est installé
git --version >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Git n'est pas installe ou pas dans le PATH
    echo.
    echo Installez Git depuis: https://git-scm.com/download/win
    echo Apres l'installation, redemarrez ce script
    pause
    exit /b 1
)

echo [OK] Git detecte
echo.

REM Initialiser Git si nécessaire
if not exist .git (
    echo [1/5] Initialisation du depot Git...
    git init
) else (
    echo [1/5] Depot Git deja initialise
)
echo.

REM Ajouter tous les fichiers
echo [2/5] Ajout des fichiers...
git add .
echo.

REM Créer le commit
echo [3/5] Creation du commit...
git commit -m "Initial commit: HeyCash+ platform - Complete MVP with Next.js frontend and NestJS backend"
if errorlevel 1 (
    echo [ATTENTION] Aucun changement a commiter ou commit deja cree
) else (
    echo [OK] Commit cree
)
echo.

REM Configurer le remote
echo [4/5] Configuration du remote GitHub...
git remote remove origin 2>nul
git remote add origin https://github.com/sashabelpois/Coinly.git
echo [OK] Remote configure: https://github.com/sashabelpois/Coinly.git
echo.

REM Créer la branche main
echo [5/5] Configuration de la branche main...
git branch -M main
echo.

REM Pousser vers GitHub
echo ========================================
echo Push vers GitHub...
echo ========================================
echo.
echo IMPORTANT: Vous devrez peut-etre vous authentifier
echo - Si vous utilisez HTTPS, entrez votre nom d'utilisateur GitHub
echo - Pour le mot de passe, utilisez un Personal Access Token (PAT)
echo   Creez-en un ici: https://github.com/settings/tokens
echo.
pause

git push -u origin main

if errorlevel 1 (
    echo.
    echo [ERREUR] Le push a echoue
    echo.
    echo Verifiez que:
    echo   1. Le depot existe sur GitHub: https://github.com/sashabelpois/Coinly
    echo   2. Vous etes authentifie (git config --global user.name et user.email)
    echo   3. Vous avez les permissions sur le depot
    echo   4. Vous utilisez un Personal Access Token si l'authentification echoue
    echo.
) else (
    echo.
    echo ========================================
    echo [SUCCES] Push reussi! ^_^
    echo ========================================
    echo.
    echo Votre depot: https://github.com/sashabelpois/Coinly
    echo.
)

pause


