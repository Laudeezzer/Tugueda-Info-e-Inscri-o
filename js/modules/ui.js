// ui.js - Helpers de interface

export class UI {
    /**
     * Mostra toast notification
     */
    static showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        const styles = {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '12px 24px',
            borderRadius: '8px',
            color: '#fff',
            zIndex: '9999',
            animation: 'slideIn 0.3s ease',
            maxWidth: '300px'
        };
        
        const colors = {
            success: '#059669',
            error: '#DC2626',
            warning: '#D97706',
            info: '#0284C7'
        };
        
        Object.assign(toast.style, styles);
        toast.style.backgroundColor = colors[type] || colors.success;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    /**
     * Mostra loading em um elemento
     */
    static showLoading(element, text = 'A processar...') {
        if (!element) return;
        
        const originalText = element.textContent;
        element.setAttribute('data-original-text', originalText);
        element.classList.add('loading');
        element.textContent = text;
        element.disabled = true;
    }
    
    /**
     * Esconde loading
     */
    static hideLoading(element) {
        if (!element) return;
        
        const originalText = element.getAttribute('data-original-text');
        element.classList.remove('loading');
        if (originalText) element.textContent = originalText;
        element.disabled = false;
    }
    
    /**
     * Mostra modal de confirmação
     */
    static confirm(title, message, onConfirm) {
        // Implementação simples de modal
        const confirmDialog = confirm(`${title}\n\n${message}`);
        if (confirmDialog && onConfirm) {
            onConfirm();
        }
    }
}

// Adicionar animações via CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);