// form-handler.js - Gerencia submissão de formulários

import { UI } from './ui.js';
import { storage } from './storage.js';
import { ConditionalFields } from './conditional-fields.js';

export class FormHandler {
    constructor(formId, options = {}) {
        this.form = document.getElementById(formId);
        this.options = {
            redirectUrl: '/obrigado.html',
            onSuccess: null,
            onError: null,
            ...options
        };
        
        this.conditionalFields = null;
        this.isSubmitting = false;
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        // Inicializar campos condicionais se o select de perfil existir
        if (document.getElementById('perfil')) {
            this.conditionalFields = new ConditionalFields(this.form);
        }
        
        // Adicionar listener de submit
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    async handleSubmit(event) {
        event.preventDefault();
        
        if (this.isSubmitting) return;
        
        // Validação básica
        if (!this.validateForm()) return;
        
        this.isSubmitting = true;
        const submitButton = this.form.querySelector('button[type="submit"]');
        UI.showLoading(submitButton, 'A processar...');
        
        try {
            const formData = this.collectFormData();
            
            // Simular envio (substituir por chamada real à API)
            const result = await this.submitToServer(formData);
            
            // Salvar no localStorage como fallback/desenvolvimento
            storage.saveInscricao(formData);
            
            UI.showToast('Inscrição realizada com sucesso!', 'success');
            
            // Callback de sucesso
            if (this.options.onSuccess) {
                this.options.onSuccess(result);
            } else {
                // Redirecionar após 1.5 segundos
                setTimeout(() => {
                    window.location.href = this.options.redirectUrl;
                }, 1500);
            }
            
        } catch (error) {
            console.error('Erro na submissão:', error);
            UI.showToast(error.message || 'Erro ao processar inscrição. Tente novamente.', 'error');
            
            if (this.options.onError) {
                this.options.onError(error);
            }
        } finally {
            this.isSubmitting = false;
            UI.hideLoading(submitButton);
        }
    }
    
    validateForm() {
        // Validação básica de campos obrigatórios
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;
        
        for (const field of requiredFields) {
            if (!field.value || field.value.trim() === '') {
                field.classList.add('is-invalid');
                isValid = false;
                
                // Mostrar mensagem de erro
                const errorMsg = document.createElement('span');
                errorMsg.className = 'field-error';
                errorMsg.textContent = 'Campo obrigatório';
                
                const existingError = field.parentElement.querySelector('.field-error');
                if (!existingError) {
                    field.parentElement.appendChild(errorMsg);
                }
            } else {
                field.classList.remove('is-invalid');
                const existingError = field.parentElement.querySelector('.field-error');
                if (existingError) existingError.remove();
            }
        }
        
        // Validação específica de email
        const emailField = this.form.querySelector('input[type="email"]');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                emailField.classList.add('is-invalid');
                isValid = false;
            }
        }
        
        // Validação de termos (checkbox obrigatório)
        const termosCheckbox = document.getElementById('termos');
        if (termosCheckbox && !termosCheckbox.checked) {
            isValid = false;
            UI.showToast('Deve aceitar os Termos de Uso e Política de Privacidade', 'warning');
        }
        
        if (!isValid) {
            UI.showToast('Preencha todos os campos obrigatórios corretamente', 'warning');
        }
        
        return isValid;
    }
    
    collectFormData() {
        const formData = new FormData(this.form);
        const data = {
            perfil: formData.get('perfil') || '',
            nome: formData.get('nome') || '',
            email: formData.get('email') || '',
            telefone: formData.get('telefone') || '',
            provincia: formData.get('provincia') || '',
            origem: formData.get('origem') || '',
            newsletter: formData.get('newsletter') === 'on',
            termos: formData.get('termos') === 'on',
            dados_especificos: this.conditionalFields ? this.conditionalFields.getPerfilData() : {},
            created_at: new Date().toISOString()
        };
        
        return data;
    }
    
    async submitToServer(data) {
        // Simulação de envio (substituir por endpoint real)
        return new Promise((resolve) => {
            console.log('Dados enviados (simulação):', data);
            setTimeout(() => resolve({ success: true, id: Date.now() }), 1000);
        });
        
        // Para usar com backend real:
        // const response = await fetch('/api/inscricao', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // });
        // if (!response.ok) throw new Error('Erro no servidor');
        // return response.json();
    }
}