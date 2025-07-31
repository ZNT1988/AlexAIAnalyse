@echo off
echo.
echo ===========================================
echo    ALEX ULTIMATE - DEMARRAGE SIMPLE
echo ===========================================
echo.
echo Demarrage du backend Alex Ultimate...
echo.

cd backend
start "Alex Backend" cmd /k "echo Backend Alex Ultimate sur PORT 3001 && node -e "const express=require('express');const app=express();app.use(require('cors')());app.use(express.json());app.get('/api/alex/status',(req,res)=>res.json({status:'ACTIVE',message:'Alex Ultimate operationnel',port:3001}));app.listen(3001,()=>console.log('Alex Ultimate Backend: http://localhost:3001'));" "

timeout /t 3

echo.
echo Demarrage du frontend...
echo.

cd ..\frontend  
start "Alex Frontend" cmd /k "echo Frontend Alex Ultimate sur PORT 3000 && npx serve -p 3000 public"

echo.
echo ===========================================
echo    ALEX ULTIMATE PRET !
echo ===========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Ouvre ton navigateur sur: http://localhost:3000
echo.
pause