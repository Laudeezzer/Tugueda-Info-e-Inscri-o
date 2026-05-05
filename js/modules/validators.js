// validators.js - Módulo de validações

export const Validators = {
    /**
     * Valida email
     * @param {string} email 
     * @returns {Object} { isValid, message }
     */
    email: (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isValid = regex.test(email);
        return {
            isValid,
            message: isValid ? '' : 'Insira um email válido (ex: nome@dominio.com)'
        };
    },
    
    /**
     * Valida telefone moçambicano
     * @param {string} telefone 
     * @returns {Object}
     */
    telefone: (telefone) => {
        if (!telefone || telefone.trim() === '') {
            return { isValid: true, message: '' }; // Opcional
        }
        const digits = telefone.replace(/\D/g, '');
        const isValid = digits.length >= 8 && digits.length <= 9;
        return {
            isValid,
            message: isValid ? '' : 'Telefone deve ter 8 ou 9 dígitos'
        };
    },
    
    /**
     * Valida nome (mínimo 3 caracteres)
     * @param {string} nome 
     * @returns {Object}
     */
    nome: (nome) => {
        const trimmed = nome?.trim() || '';
        const isValid = trimmed.length >= 3;
        return {
            isValid,
            message: isValid ? '' : 'Nome deve ter pelo menos 3 caracteres'
        };
    },
    
    /**
     * Valida que campo não está vazio
     * @param {string} value 
     * @param {string} fieldName 
     * @returns {Object}
     */
    required: (value, fieldName = 'Campo') => {
        const isValid = value !== undefined && value !== null && value.toString().trim() !== '';
        return {
            isValid,
            message: isValid ? '' : `${fieldName} é obrigatório`
        };
    },
    
    /**
     * Valida seleção de select
     * @param {string} value 
     * @returns {Object}
     */
    select: (value) => {
        const isValid = value !== undefined && value !== null && value !== '';
        return {
            isValid,
            message: isValid ? '' : 'Selecione uma opção'
        };
    }
};

/**
 * Classe para validação de formulários
 */
export class FormValidator {
    constructor(formElement, rules = {}) {
        this.form = formElement;
        this.rules = rules;
        this.errors = new Map();
        this.fieldElements = new Map();
        
        this.init();
    }
    
    init() {
        // Guardar referências dos campos
        for (const [fieldName, rule] of Object.entries(this.rules)) {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                this.fieldElements.set(fieldName, field);
                
                // Adicionar eventos de validação em tempo real
                field.addEventListener('input', () => this.validateField(fieldName));
                field.addEventListener('blur', () => this.validateField(fieldName));
            }
        }
    }
    
    /**
     * Valida um campo específico
     */
    validateField(fieldName) {
        const field = this.fieldElements.get(fieldName);
        const rule = this.rules[fieldName];
        
        if (!field || !rule) return true;
        
        let isValid = true;
        let errorMessage = '';
        
        if (typeof rule === 'function') {
            const result = rule(field.value);
            isValid = result.isValid;
            errorMessage = result.message;
        } else if (Array.isArray(rule)) {
            for (const validator of rule) {
                const result = validator(field.value);
                if (!result.isValid) {
                    isValid = false;
                    errorMessage = result.message;
                    break;
                }
            }
        }
        
        if (!isValid) {
            this.errors.set(fieldName, errorMessage);
            this.showError(field, errorMessage);
        } else {
            this.errors.delete(fieldName);
            this.hideError(field);
        }
        
        return isValid;
    }
    
    /**
     * Valida todos os campos do formulário
     */
    validateAll() {
        let allValid = true;
        
        for (const fieldName of Object.keys(this.rules)) {
            const isValid = this.validateField(fieldName);
            if (!isValid) allValid = false;
        }
        
        return allValid;
    }
    
    /**
     * Mostra mensagem de erro
     */
    showError(field, message) {
        const existingError = field.parentElement.querySelector('.field-error');
        if (existingError) existingError.remove();
        
        field.classList.add('is-invalid');
        
        const errorEl = document.createElement('span');
        errorEl.className = 'field-error';
        errorEl.textContent = message;
        field.parentElement.appendChild(errorEl);
    }
    
    /**
     * Esconde mensagem de erro
     */
    hideError(field) {
        field.classList.remove('is-invalid');
        const error = field.parentElement.querySelector('.field-error');
        if (error) error.remove();
    }
    
    /**
     * Retorna todos os dados do formulário validados
     */
    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        return data;
    }
}