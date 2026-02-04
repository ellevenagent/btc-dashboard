#!/bin/bash
#
# Script de Deploy - BTC Dashboard
# Executar no VPS: bash deploy.sh
#

set -e

REPO_NAME="btc-dashboard"
GITHUB_USER="ellevenagent"

echo "🚀 Deploy do BTC Dashboard"
echo "=========================="

# 1. Configurar Git
echo ""
echo "1️⃣ Configurando Git..."
git config user.name "James"
git config user.email "james@btc-monitor.local"

# 2. Criar repositório no GitHub (via CLI ou manual)
echo ""
echo "2️⃣ Criando repositório no GitHub..."
echo "   Acesse: https://github.com/new"
echo "   Nome: $REPO_NAME"
echo "   Descrição: BTC Monitor Dashboard - Game 72h"
echo "   Público: ✅"
echo "   README: ❌ (iremos criar)"
echo ""
read -p "   Repositório criado? (s/n): " CREATED

if [ "$CREATED" != "s" ]; then
    echo "❌ Por favor, crie o repositório primeiro!"
    exit 1
fi

# 3. Adicionar remote
echo ""
echo "3️⃣ Adicionando remote..."
git remote add origin https://github.com/$GITHUB_USER/$REPO_NAME.git
git remote -v

# 4. Fazer push
echo ""
echo "4️⃣ Fazendo push para GitHub..."
echo "   Usuário: $GITHUB_USER"
echo "   Senha: (use token ou senha)"
git push -u origin master

echo ""
echo "✅ Código enviado para GitHub!"
echo ""

# 5. Conectar Netlify
echo "5️⃣ Conectando Netlify..."
echo "   Acesse: https://app.netlify.com/start"
echo "   1. Clique em 'Add new site' → 'Import an existing project'"
echo "   2. Selecione GitHub"
echo "   3. Escolha o repositório: $GITHUB_USER/$REPO_NAME"
echo "   4. Build command: (deixe vazio para site estático)"
echo "   5. Publish directory: public"
echo "   6. Clique em 'Deploy site'"
echo ""

echo "🌐 URL do seu dashboard:"
echo "   https://$REPO_NAME.netlify.app"
echo ""
echo "=========================="
echo "✅ Deploy completo!"
