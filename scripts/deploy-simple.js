#!/usr/bin/env node

/**
 * Script simplificado para fazer deploy manual do site no GitHub Pages
 * usando a sintaxe de módulos ES
 */

import { execSync } from 'child_process';

// Cores para terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

console.log(`${colors.blue}=== Iniciando deploy simplificado para GitHub Pages ===${colors.reset}`);

try {
  // Executar build
  console.log(`${colors.blue}Executando build...${colors.reset}`);
  execSync('npm run build', { stdio: 'inherit' });
  
  // Deploy com gh-pages
  console.log(`${colors.blue}Fazendo deploy para GitHub Pages...${colors.reset}`);
  execSync('npx gh-pages -d dist', { stdio: 'inherit' });
  
  console.log(`${colors.green}Deploy concluído com sucesso!${colors.reset}`);
  console.log(`${colors.green}Seu site estará disponível em: https://efelixz.github.io/PortifiolioPersonal2.0/${colors.reset}`);
  
} catch (error) {
  console.error(`${colors.red}Erro no deploy:${colors.reset}`, error);
  process.exit(1);
}