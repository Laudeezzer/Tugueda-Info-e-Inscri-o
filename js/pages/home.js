// home.js - Lógica específica da página inicial

import { UI } from '../modules/ui.js';

class HomePage {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('Página inicial inicializada');
        this.setupCtaButton();
        this.setupAnimations();
    }
    
    setupCtaButton() {
        const ctaButton = document.querySelector('.cta .btn-primary');
        if (ctaButton) {
            ctaButton.addEventListener('click', (e) => {
                // Pequena animação/tracking
                console.log('Clique no CTA da home');
                
                // Se quiser adicionar tracking
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'click_cta', {
                        'event_category': 'engajamento',
                        'event_label': 'home_inscricao'
                    });
                }
            });
        }
    }
    
    setupAnimations() {
        // Adicionar animação suave aos cards ao entrar na viewport
        const cards = document.querySelectorAll('.card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.5s ease';
            observer.observe(card);
        });
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new HomePage();
});