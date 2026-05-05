// inscricao.js - Lógica específica da página de inscrição

import { FormHandler } from '../modules/form-handler.js';
import { UI } from '../modules/ui.js';
import { storage } from '../modules/storage.js';

class InscricaoPage {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('Página de inscrição inicializada');
        
        // Inicializar handler do formulário
        this.formHandler = new FormHandler('inscricaoForm', {
            redirectUrl: '/obrigado.html',
            onSuccess: (data) => {
                console.log('Inscrição concluída:', data);
                // Evento de conversão para analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'inscricao', {
                        'event_category': 'conversao',
                        'event_label': data.perfil
                    });
                }
            },
            onError: (error) => {
                console.error('Erro na inscrição:', error);
            }
        });
        
        this.setupTelefoneMask();
        this.setupAbrirContaLink();
    }
    
    setupTelefoneMask() {
        const telefoneInput = document.getElementById('telefone');
        if (telefoneInput) {
            telefoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 9) value = value.slice(0, 9);
                e.target.value = value;
            });
        }
    }
    
    setupAbrirContaLink() {
        // Para quem já tem conta
        const loginLink = document.querySelector('.login-link');
        if (loginLink) {
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                UI.showToast('Funcionalidade disponível em breve', 'info');
            });
        }
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new InscricaoPage();
});