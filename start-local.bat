@echo off
echo ========================================
echo Lancement de Coinly en local
echo ========================================
echo.

REM Vérifier Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Docker n'est pas installe
    echo.
    echo Installez Docker Desktop depuis:
    echo https://www.docker.com/products/docker-desktop/
    echo.
    echo Apres l'installation, redemarrez ce script
    pause
    exit /b 1
)

echo [OK] Docker detecte
echo.

REM Vérifier les fichiers .env
if not exist "backend\.env" (
    echo [ATTENTION] backend\.env n'existe pas
    echo Creation du fichier .env depuis .env.example...
    if exist "backend\.env.example" (
        copy "backend\.env.example" "backend\.env" >nul
        echo [OK] backend\.env cree
        echo [IMPORTANT] Editez backend\.env avec vos valeurs
    ) else (
        echo [ERREUR] backend\.env.example introuvable
    )
    echo.
)

if not exist "frontend\.env.local" (
    echo [ATTENTION] frontend\.env.local n'existe pas
    echo Creation du fichier .env.local depuis .env.example...
    if exist "frontend\.env.example" (
        copy "frontend\.env.example" "frontend\.env.local" >nul
        echo [OK] frontend\.env.local cree
        echo [IMPORTANT] Editez frontend\.env.local avec vos valeurs
    ) else (
        echo [ERREUR] frontend\.env.example introuvable
    )
    echo.
)

echo ========================================
echo Demarrage des services Docker...
echo ========================================
echo.
echo Cette operation peut prendre quelques minutes la premiere fois
echo (telechargement des images Docker)
echo.
echo Les services seront accessibles sur:
echo   - Frontend: http://localhost:3000
echo   - Backend:  http://localhost:3001
echo   - Swagger:  http://localhost:3001/api
echo.
echo Appuyez sur Ctrl+C pour arreter les services
echo.

REM Lancer Docker Compose
docker compose up --build

pause


