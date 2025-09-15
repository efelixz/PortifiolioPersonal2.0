#!/usr/bin/env node

/**
 * Pre-deploy verification script
 * Checks if all requirements are met before deploying to GitHub Pages
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verificando configuração para deploy...\n');

const checks = [
  {
    name: 'Vite config com base path',
    check: () => {
      const configPath = path.join(__dirname, '../vite.config.ts');
      const content = fs.readFileSync(configPath, 'utf8');
      return content.includes('/portfolio-jefferson/');
    },
    fix: 'Adicione base: "/portfolio-jefferson/" no vite.config.ts'
  },
  {
    name: 'Arquivo .nojekyll existe',
    check: () => fs.existsSync(path.join(__dirname, '../public/.nojekyll')),
    fix: 'Crie o arquivo public/.nojekyll'
  },
  {
    name: 'Arquivo 404.html existe',
    check: () => fs.existsSync(path.join(__dirname, '../public/404.html')),
    fix: 'Crie o arquivo public/404.html para SPA routing'
  },
  {
    name: 'Script SPA no index.html',
    check: () => {
      const indexPath = path.join(__dirname, '../index.html');
      const content = fs.readFileSync(indexPath, 'utf8');
      return content.includes('Single Page Apps for GitHub Pages');
    },
    fix: 'Adicione o script SPA no index.html'
  },
  {
    name: 'GitHub Actions workflow',
    check: () => fs.existsSync(path.join(__dirname, '../.github/workflows/deploy.yml')),
    fix: 'Crie o arquivo .github/workflows/deploy.yml'
  },
  {
    name: 'gh-pages dependency',
    check: () => {
      const packagePath = path.join(__dirname, '../package.json');
      const content = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      return content.devDependencies && content.devDependencies['gh-pages'];
    },
    fix: 'Execute: npm install --save-dev gh-pages'
  },
  {
    name: 'Deploy script no package.json',
    check: () => {
      const packagePath = path.join(__dirname, '../package.json');
      const content = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      return content.scripts && content.scripts.deploy;
    },
    fix: 'Adicione "deploy": "gh-pages -d dist" nos scripts'
  },
  {
    name: 'TypeScript paths atualizados',
    check: () => {
      const tsconfigPath = path.join(__dirname, '../tsconfig.json');
      const content = fs.readFileSync(tsconfigPath, 'utf8');
      return content.includes('"@/*": ["./src/*"]');
    },
    fix: 'Atualize os paths no tsconfig.json para ./src/*'
  }
];

let allPassed = true;

checks.forEach((check, index) => {
  const passed = check.check();
  const status = passed ? '✅' : '❌';
  const number = (index + 1).toString().padStart(2, '0');
  
  console.log(`${status} ${number}. ${check.name}`);
  
  if (!passed) {
    console.log(`   💡 ${check.fix}\n`);
    allPassed = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('🎉 Todas as verificações passaram!');
  console.log('✅ Projeto pronto para deploy no GitHub Pages');
  console.log('\n📋 Próximos passos:');
  console.log('1. git add .');
  console.log('2. git commit -m "feat: configuração para GitHub Pages"');
  console.log('3. git push origin main');
  console.log('4. npm run deploy (ou aguardar GitHub Actions)');
  process.exit(0);
} else {
  console.log('❌ Algumas verificações falharam');
  console.log('🔧 Corrija os problemas acima antes do deploy');
  process.exit(1);
}