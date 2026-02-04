#!/bin/bash
# Criar repositório GitHub e fazer push

REPO_NAME="btc-dashboard"
GITHUB_USER="ellevenagent"

echo "🚀 Criando repositório $GITHUB_USER/$REPO_NAME..."

# Verificar remote
if git remote -v | grep -q origin; then
    echo "Remote origin já existe"
else
    echo "Adicionando remote..."
    git remote add origin https://github.com/$GITHUB_USER/$REPO_NAME.git
fi

echo ""
echo "📋 PRÓXIMOS PASSOS (execute manualmente):"
echo "=========================================="
echo ""
echo "1️⃣ Criar repositório no GitHub:"
echo "   → Acesse: https://github.com/new"
echo "   → Repository name: $REPO_NAME"
echo "   → Description: BTC Monitor Dashboard"
echo "   → Public: ✓"
echo "   → README: ❌"
echo "   → Create repository"
echo ""
echo "2️⃣ Fazer push:"
echo "   cd /home/ubuntu/btc-dashboard"
echo "   git push -u origin master"
echo ""
echo "3️⃣ Conectar Netlify:"
echo "   → Acesse: https://app.netlify.com/start"
echo "   → 'Add new site' → 'Import an existing project'"
echo "   → Selecione GitHub → repositório $REPO_NAME"
echo "   → Publish directory: public"
echo "   → Deploy!"
echo ""
echo "🌐 URL final: https://$REPO_NAME.netlify.app"
echo ""
echo "=========================================="
