// storage.js - Gerenciamento de dados locais

const STORAGE_KEYS = {
    INSCRICOES: 'tugueda_inscricoes',
    USER: 'tugueda_user',
    SETTINGS: 'tugueda_settings'
};

export class StorageManager {
    constructor() {
        this.isAvailable = this.checkAvailability();
    }
    
    /**
     * Verifica se localStorage está disponível
     */
    checkAvailability() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('localStorage não disponível:', e);
            return false;
        }
    }
    
    /**
     * Salva dados
     */
    set(key, data) {
        if (!this.isAvailable) return false;
        
        try {
            const serialized = JSON.stringify(data);
            localStorage.setItem(key, serialized);
            return true;
        } catch (e) {
            console.error('Erro ao salvar no localStorage:', e);
            return false;
        }
    }
    
    /**
     * Recupera dados
     */
    get(key, defaultValue = null) {
        if (!this.isAvailable) return defaultValue;
        
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error('Erro ao ler do localStorage:', e);
            return defaultValue;
        }
    }
    
    /**
     * Remove dados
     */
    remove(key) {
        if (!this.isAvailable) return false;
        
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Erro ao remover do localStorage:', e);
            return false;
        }
    }
    
    /**
     * Limpa todos os dados
     */
    clear() {
        if (!this.isAvailable) return false;
        
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Erro ao limpar localStorage:', e);
            return false;
        }
    }
    
    /**
     * Salva uma inscrição
     */
    saveInscricao(inscricao) {
        const inscricoes = this.get(STORAGE_KEYS.INSCRICOES, []);
        inscricao.id = this.generateId();
        inscricao.createdAt = new Date().toISOString();
        inscricoes.push(inscricao);
        return this.set(STORAGE_KEYS.INSCRICOES, inscricoes);
    }
    
    /**
     * Recupera todas as inscrições
     */
    getInscricoes() {
        return this.get(STORAGE_KEYS.INSCRICOES, []);
    }
    
    /**
     * Gera ID único
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }
}

// Exportar instância única (Singleton)
export const storage = new StorageManager();