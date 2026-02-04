#!/usr/bin/env node

/**
 * GitHub Repository Creator via API
 * Cria repositório e faz push do código
 */

const { execSync } = require('child_process');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuração
const REPO_NAME = 'btc-dashboard';
const GITHUB_USER = 'ellevenagent';
const DESCRIPTION = 'BTC Monitor Dashboard - Game 72h';
const DIR = path.dirname(__dirname);

// Ler token do GitHub (criar em: https://github.com/settings/tokens)
const getGitHubToken = () => {
    return process.env.GITHUB_TOKEN || '';
};

async function createRepoViaAPI(token) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            name: REPO_NAME,
            description: DESCRIPTION,
            private: false,
            auto_init: false
        });

        const options = {
            hostname: 'api.github.com',
            path: `/user/repos`,
            method: 'POST',
            headers: {
                'Authorization': `token ${token}`,
                'User-Agent': 'Node.js',
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if (res.statusCode === 201) {
                    resolve(JSON.parse(body));
                } else {
                    reject(new Error(`Status ${res.statusCode}: ${body}`));
                }
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function deploy() {
    console.log('🚀 Deploy BTC Dashboard\n');
    
    // Verificar se já tem remote
    try {
        const remote = execSync('git remote get-url origin').toString().trim();
        console.log('✅ Remote já existe:', remote);
    } catch {
        console.log('📡 Adicionando remote...');
        execSync(`git remote add origin https://github.com/${GITHUB_USER}/${REPO_NAME}.git`);
    }
    
    // Verificar token
    const token = getGitHubToken();
    
    if (!token) {
        console.log('\n❌ Token GitHub não encontrado\n');
        console.log('📝 Para criar token:');
        console.log('   1. Acesse: https://github.com/settings/tokens');
        console.log('   2. Clique em "Generate new token (classic)"');
        console.log('   3. Note: "repo" (acesso completo a repositórios)');
        console.log('   4. Copie o token\n');
        console.log('📋 OU execute manualmente:\n');
        console.log('   # Criar repositório no GitHub:');
        console.log('   → https://github.com/new');
        console.log(`   → Name: ${REPO_NAME}`);
        console.log(`   → Description: ${DESCRIPTION}`);
        console.log('   → Public: ✓');
        console.log('   → Create repository\n');
        console.log('   # Fazer push:');
        console.log('   cd /home/ubuntu/btc-dashboard');
        console.log('   git push -u origin master\n');
        return;
    }
    
    // Tentar criar repo via API
    try {
        console.log('📡 Criando repositório via GitHub API...');
        const repo = await createRepoViaAPI(token);
        console.log('✅ Repositório criado:', repo.html_url);
    } catch (err) {
        if (err.message.includes('422')) {
            console.log('⚠️ Repositório já existe ou nome indisponível');
        } else {
            console.log('⚠️ Erro ao criar:', err.message);
        }
        console.log('   Continuando com push...\n');
    }
    
    // Configurar Git
    console.log('⚙️ Configurando Git...');
    execSync('git config user.name "James"');
    execSync('git config user.email "james@btc-monitor.local"');
    
    // Verificar se há commits
    try {
        execSync('git log --oneline -1');
        console.log('✅ Commit já existe');
    } catch {
        console.log('📝 Fazendo commit inicial...');
        execSync('git add .');
        execSync('git commit -m "Initial commit: BTC Monitor Dashboard"');
    }
    
    // Push
    console.log('📤 Fazendo push para GitHub...');
    try {
        execSync('git push -u origin master');
        console.log('✅ Código enviado para GitHub!\n');
    } catch (err) {
        console.log('⚠️ Erro no push:', err.message);
        console.log('   Talvez precise fazer force push ou resolver conflitos\n');
        return;
    }
    
    console.log('🌐 PRÓXIMO PASSO - Netlify:');
    console.log('   1. Acesse: https://app.netlify.com/start');
    console.log('   2. "Add new site" → "Import an existing project"');
    console.log('   3. Selecione: ellevenagent/btc-dashboard');
    console.log('   4. Publish directory: public');
    console.log('   5. Deploy!');
    console.log(`\n🌐 URL: https://${REPO_NAME}.netlify.app\n`);
}

deploy().catch(console.error);
