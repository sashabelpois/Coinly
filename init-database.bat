@echo off
echo ========================================
echo Initialisation de la base de donnees
echo ========================================
echo.

REM Vérifier que le conteneur backend est en cours d'exécution
docker ps | findstr "heycash_backend" >nul
if errorlevel 1 (
    echo [ERREUR] Le conteneur backend n'est pas en cours d'execution
    echo.
    echo Lancez d'abord: start-local.bat
    pause
    exit /b 1
)

echo [OK] Conteneur backend detecte
echo.

echo [1/3] Generation de Prisma Client...
docker exec -it heycash_backend npm run prisma:generate
if errorlevel 1 (
    echo [ERREUR] Echec de la generation Prisma
    pause
    exit /b 1
)
echo.

echo [2/3] Creation des migrations...
docker exec -it heycash_backend npm run prisma:migrate
if errorlevel 1 (
    echo [ERREUR] Echec des migrations
    pause
    exit /b 1
)
echo.

echo [3/3] Seed de la base de donnees (optionnel)...
docker exec -it heycash_backend npm run prisma:seed
if errorlevel 1 (
    echo [ATTENTION] Le seed a echoue (peut etre normal si deja execute)
) else (
    echo [OK] Base de donnees seedee
)
echo.

echo ========================================
echo [SUCCES] Base de donnees initialisee!
echo ========================================
echo.
echo Vous pouvez maintenant utiliser l'application:
echo   - Frontend: http://localhost:3000
echo   - Backend:  http://localhost:3001
echo.

pause


