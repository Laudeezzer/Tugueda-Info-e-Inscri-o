// main.js - Ponto de entrada principal

import { CONFIG } from './config.js';
import { storage } from './modules/storage.js';
import { UI } from './modules/ui.js';

class TuguedaApp {
    constructor() {
        this.init();
    }
    
    init() {
        console.log(`${CONFIG.APP_NAME} v${CONFIG.APP_VERSION} inicializado`);
        this.setupMobileMenu();
        this.setupHeaderScroll();
        this.loadComponents();
    }
    
    setupMobileMenu() {
        const menuButton = document.querySelector('.header-menu-button');
        const nav = document.querySelector('.header-nav');
        
        if (menuButton && nav) {
            menuButton.addEventListener('click', () => {
                const expanded = menuButton.getAttribute('aria-expanded') === 'true';
                menuButton.setAttribute('aria-expanded', !expanded);
                nav.classList.toggle('is-open');
            });
        }
    }
    
    
    setupHeaderScroll() {
        const header = document.querySelector('.header');
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > lastScroll && currentScroll > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });
    }
    
    async loadComponents() {
        // Carregar header e footer se existirem placeholders
        const headerPlaceholder = document.getElementById('header-placeholder');
        const footerPlaceholder = document.getElementById('footer-placeholder');
        
        if (headerPlaceholder) {
            await this.loadComponent('/components/header.html', headerPlaceholder);
        }
        
        if (footerPlaceholder) {
            await this.loadComponent('/components/footer.html', footerPlaceholder);
        }
    }
    
    async loadComponent(url, target) {
        try {
            const response = await fetch(url);
            const html = await response.text();
            target.innerHTML = html;
        } catch (error) {
            console.error(`Erro ao carregar componente ${url}:`, error);
        }
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.Tugueda = new TuguedaApp();
});

// Exportar para uso em outros módulos
export default TuguedaApp;