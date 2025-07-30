#!/bin/bash

echo ""
echo "========================================"
echo "  🧹 HustleFinderIA - Redémarrage Propre"
echo "========================================"
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

cd "$(dirname "$0")"

echo -e "${BLUE}1️⃣ Nettoyage des processus existants...${NC}"
pkill -f "node.*index.js" 2>/dev/null || true
pkill -f "nodemon.*index.js" 2>/dev/null || true
sleep 2

echo -e "${BLUE}2️⃣ Vérification des ports...${NC}"
if lsof -i :8081 >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 8081 encore occupé, nettoyage...${NC}"
    lsof -ti :8081 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

if lsof -i :5173 >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 5173 encore occupé, nettoyage...${NC}"
    lsof -ti :5173 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

echo -e "${BLUE}3️⃣ Démarrage Backend (Port 8081)...${NC}"
cd backend
npm run dev:force &
BACKEND_PID=$!
cd ..

echo -e "${YELLOW}⏳ Attente backend...${NC}"
sleep 8

echo -e "${BLUE}4️⃣ Démarrage Frontend (Port 5173)...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo -e "${GREEN}✅ HustleFinderIA redémarré proprement !${NC}"
echo ""
echo "📖 Configuration finale:"
echo "   • Backend API: http://localhost:8081"
echo "   • Frontend UI: http://localhost:5173"
echo "   • Tous les modules IA activés"
echo "   • ContextIntelligence opérationnel"
echo ""
echo -e "${GREEN}🌐 Interface: http://localhost:5173${NC}"
echo ""

# Fonction de nettoyage
cleanup() {
    echo ""
    echo -e "${RED}🛑 Arrêt des processus...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    echo -e "${GREEN}✅ Processus arrêtés proprement${NC}"
    exit 0
}

# Intercepter Ctrl+C
trap cleanup SIGINT SIGTERM

echo "Pressez Ctrl+C pour arrêter les serveurs..."
wait