// Este script garante que o roteamento funcione corretamente no GitHub Pages
(function() {
  const singlePageApp = {
    init() {
      // Verifica se está em produção
      if (window.location.hostname === 'efelixz.me') {
        this.setupSPARouting();
      }
    },

    setupSPARouting() {
      // Intercepta navegação por links
      document.addEventListener('click', (event) => {
        const link = event.target.closest('a');
        if (link && link.href.startsWith(window.location.origin)) {
          event.preventDefault();
          const path = link.href.replace(window.location.origin, '');
          window.history.pushState({}, '', path);
          // Dispara evento para atualizar a rota
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
      });

      // Lida com navegação pelo histórico
      window.addEventListener('popstate', () => {
        const path = window.location.pathname;
        if (path !== '/' && !document.querySelector('main')) {
          window.location.reload();
        }
      });
    }
  };

  // Inicializa quando o DOM estiver pronto
  document.addEventListener('DOMContentLoaded', () => singlePageApp.init());
})();