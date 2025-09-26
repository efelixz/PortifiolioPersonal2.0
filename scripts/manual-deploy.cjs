#!/usr/bin/env node

/**
 * Script para fazer deploy manual do site no GitHub Pages
 * Executa o build e faz o deploy usando gh-pages
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Cores para terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

console.log(`${colors.blue}=== Iniciando deploy manual para GitHub Pages ===${colors.reset}`);

try {
  // Verificar se está no branch main
  const currentBranch = execSync('git branch --show-current').toString().trim();
  
  if (currentBranch !== 'main') {
    console.log(`${colors.yellow}AVISO: Você não está no branch main (branch atual: ${currentBranch})${colors.reset}`);
    const proceed = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    proceed.question(`${colors.yellow}Deseja continuar mesmo assim? (s/n)${colors.reset} `, (answer) => {
      if (answer.toLowerCase() !== 's') {
        console.log(`${colors.blue}Deploy cancelado.${colors.reset}`);
        process.exit(0);
      }
      continueWithDeploy();
      proceed.close();
    });
  } else {
    continueWithDeploy();
  }
  
} catch (error) {
  console.error(`${colors.red}Erro no deploy:${colors.reset}`, error);
  process.exit(1);
}

function continueWithDeploy() {
  try {
    // Executar build
    console.log(`${colors.blue}Executando build...${colors.reset}`);
    execSync('npm run build', { stdio: 'inherit' });
    
    // Criar arquivo CNAME se não existir
    const cnamePath = path.join(process.cwd(), 'dist', 'CNAME');
    if (!fs.existsSync(cnamePath)) {
      console.log(`${colors.yellow}CNAME não encontrado, usando configuração padrão do GitHub Pages${colors.reset}`);
    }
    
    // Deploy com gh-pages
    console.log(`${colors.blue}Fazendo deploy para GitHub Pages...${colors.reset}`);
    execSync('npx gh-pages -d dist', { stdio: 'inherit' });
    
    console.log(`${colors.green}Deploy concluído com sucesso!${colors.reset}`);
    console.log(`${colors.green}Seu site estará disponível em: https://efelixz.github.io/PortifiolioPersonal2.0/${colors.reset}`);
    
  } catch (error) {
    console.error(`${colors.red}Erro no deploy:${colors.reset}`, error);
    process.exit(1);
  }
}