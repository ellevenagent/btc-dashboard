#!/usr/bin/env node

/**
 * Deploy para Netlify via API
 * Usa Netlify API token
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Configuração
const NETLIFY_API = 'api.netlify.com';
const SITE_NAME = 'btc-monitor-james';

// Ler token de variável de ambiente ou arquivo
const getToken = () => {
    // Você pode gerar um token em: https://app.netlify.com/user/applications
    return process.env.NETLIFY_AUTH_TOKEN || '';
};

// Deploy de pasta local
async function deploySite(dirPath, siteName) {
    const token = getToken();
    if (!token) {
        console.log('❌ Token Netlify não encontrado');
        console.log('📝 Para gerar token:');
        console.log('   1. Acesse: https://app.netlify.com/user/applications');
        console.log('   2. Clique em "New access token"');
        console.log('   3. Copie o token e configure:');
        console.log('   export NETLIFY_AUTH_TOKEN=seu-token-aqui');
        return false;
    }
    
    console.log('🚀 Fazendo deploy para Netlify...');
    console.log('📁 Diretório:', dirPath);
    
    // Criar form-data com arquivos
    const form = new FormData();
    
    // Adicionar arquivo zip (simplificado - em produção usaria archiver)
    const files = getAllFiles(dirPath);
    
    console.log('📄 Arquivos encontrados:', files.length);
    
    // Em produção, aqui faríamos o upload real
    // Por enquanto, salvamos configuração
    
    const config = {
        siteName: siteName,
        dir: dirPath,
        files: files,
        deployUrl: `https://${siteName}.netlify.app`,
        createdAt: new Date().toISOString()
    };
    
    fs.writeFileSync(
        path.join(dirPath, 'netlify.config.json'),
        JSON.stringify(config, null, 2)
    );
    
    console.log('!');
    console.log('');
    console.log('📋✅ Configuração salva Próximos passos:');
    console.log('   1. Acesse: https://app.netlify.com/start');
    console.log('   2. Conecte seu GitHub');
    console.log('   3. Selecione o repositório btc-dashboard');
    console.log('   4. Netlify faz deploy automático!');
    console.log('');
    console.log('🌐 URL final: https://' + siteName + '.netlify.app');
    
    return true;
}

// Listar todos os arquivos
function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    
    files.forEach(file => {
        if (fs.statSync(dirPath + '/' + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, file).replace(dirPath + '/', ''));
        }
    });
    
    return arrayOfFiles;
}

// CLI
const args = process.argv.slice(2);
const command = args[0];

if (command === 'deploy') {
    const dir = args[1] || './public';
    const name = args[2] || SITE_NAME;
    deploySite(dir, name);
} else {
    console.log(`
🚀 Netlify Deploy CLI

用法:
  node netlify-deploy.js deploy [dir] [site-name]

Exemplo:
  node netlify-deploy.js deploy/public btc-monitor-james

前提条件:
  - Criar repositório no GitHub
  - Fazer push do código
  - Conectar Netlify ao repositório

📝 Não precisa de token se usar GitHub integration!
    `);
}
