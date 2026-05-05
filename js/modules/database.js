// database.js - Gerenciamento de banco de dados IndexedDB

export class TuguedaDB {
    constructor() {
        this.dbName = 'TuguedaDB';
        this.dbVersion = 1;
        this.db = null;
        this.init();
    }
    
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            request.onerror = (event) => {
                console.error('Erro ao abrir database:', event.target.error);
                reject(event.target.error);
            };
            
            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('Database TuguedaDB inicializado com sucesso');
                resolve(this.db);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Criar store de inscrições
                if (!db.objectStoreNames.contains('inscricoes')) {
                    const store = db.createObjectStore('inscricoes', { 
                        keyPath: 'id',
                        autoIncrement: false 
                    });
                    
                    // Criar índices para buscas
                    store.createIndex('email', 'email', { unique: false });
                    store.createIndex('perfil', 'perfil', { unique: false });
                    store.createIndex('status', 'status', { unique: false });
                    store.createIndex('created_at', 'created_at', { unique: false });
                    store.createIndex('provincia', 'provincia', { unique: false });
                    
                    console.log('Store "inscricoes" criada com sucesso');
                }
                
                // Criar store de usuários (para futuro login)
                if (!db.objectStoreNames.contains('usuarios')) {
                    const userStore = db.createObjectStore('usuarios', { 
                        keyPath: 'id',
                        autoIncrement: true 
                    });
                    userStore.createIndex('email', 'email', { unique: true });
                    userStore.createIndex('perfil', 'perfil', { unique: false });
                }
                
                // Criar store de logs (rastreamento)
                if (!db.objectStoreNames.contains('logs')) {
                    const logStore = db.createObjectStore('logs', { 
                        keyPath: 'id',
                        autoIncrement: true 
                    });
                    logStore.createIndex('timestamp', 'timestamp', { unique: false });
                    logStore.createIndex('tipo', 'tipo', { unique: false });
                }
            };
        });
    }
    
    // SALVAR INSCRIÇÃO
    async saveInscricao(inscricao) {
        await this.ensureDB();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['inscricoes'], 'readwrite');
            const store = transaction.objectStore('inscricoes');
            const request = store.put(inscricao);
            
            request.onsuccess = () => {
                this.addLog('inscricao_criada', `Inscrição criada: ${inscricao.id}`);
                resolve(inscricao);
            };
            
            request.onerror = (event) => {
                console.error('Erro ao salvar inscrição:', event.target.error);
                reject(event.target.error);
            };
        });
    }
    
    // BUSCAR INSCRIÇÃO POR ID
    async getInscricao(id) {
        await this.ensureDB();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['inscricoes'], 'readonly');
            const store = transaction.objectStore('inscricoes');
            const request = store.get(id);
            
            request.onsuccess = () => {
                resolve(request.result || null);
            };
            
            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }
    
    // BUSCAR INSCRIÇÕES POR EMAIL
    async getInscricaoByEmail(email) {
        await this.ensureDB();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['inscricoes'], 'readonly');
            const store = transaction.objectStore('inscricoes');
            const index = store.index('email');
            const request = index.getAll(email);
            
            request.onsuccess = () => {
                resolve(request.result || []);
            };
            
            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }
    
    // LISTAR TODAS INSCRIÇÕES
    async getAllInscricoes(limit = 100) {
        await this.ensureDB();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['inscricoes'], 'readonly');
            const store = transaction.objectStore('inscricoes');
            const index = store.index('created_at');
            const request = index.openCursor(null, 'prev');
            
            const results = [];
            let count = 0;
            
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor && count < limit) {
                    results.push(cursor.value);
                    count++;
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            
            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }
    
    // ATUALIZAR STATUS DA INSCRIÇÃO
    async updateInscricaoStatus(id, status) {
        await this.ensureDB();
        
        const inscricao = await this.getInscricao(id);
        if (!inscricao) {
            throw new Error('Inscrição não encontrada');
        }
        
        inscricao.status = status;
        inscricao.updated_at = new Date().toISOString();
        
        return this.saveInscricao(inscricao);
    }
    
    // DELETAR INSCRIÇÃO
    async deleteInscricao(id) {
        await this.ensureDB();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['inscricoes'], 'readwrite');
            const store = transaction.objectStore('inscricoes');
            const request = store.delete(id);
            
            request.onsuccess = () => {
                this.addLog('inscricao_deletada', `Inscrição deletada: ${id}`);
                resolve();
            };
            
            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }
    
    // ESTATÍSTICAS
    async getStats() {
        await this.ensureDB();
        
        const inscricoes = await this.getAllInscricoes(10000);
        
        const stats = {
            total: inscricoes.length,
            por_perfil: {},
            por_provincia: {},
            por_origem: {},
            ultimos_30_dias: 0,
            newsletter_optin: 0
        };
        
        const trintaDiasAtras = new Date();
        trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);
        
        inscricoes.forEach(insc => {
            // Por perfil
            stats.por_perfil[insc.perfil] = (stats.por_perfil[insc.perfil] || 0) + 1;
            
            // Por província
            if (insc.provincia) {
                stats.por_provincia[insc.provincia] = (stats.por_provincia[insc.provincia] || 0) + 1;
            }
            
            // Por origem
            if (insc.origem) {
                stats.por_origem[insc.origem] = (stats.por_origem[insc.origem] || 0) + 1;
            }
            
            // Últimos 30 dias
            if (new Date(insc.created_at) > trintaDiasAtras) {
                stats.ultimos_30_dias++;
            }
            
            // Newsletter
            if (insc.newsletter) {
                stats.newsletter_optin++;
            }
        });
        
        return stats;
    }
    
    // ADICIONAR LOG
    async addLog(tipo, mensagem) {
        await this.ensureDB();
        
        const log = {
            id: Date.now(),
            tipo: tipo,
            mensagem: mensagem,
            timestamp: new Date().toISOString()
        };
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['logs'], 'readwrite');
            const store = transaction.objectStore('logs');
            const request = store.add(log);
            
            request.onsuccess = () => resolve(log);
            request.onerror = (event) => reject(event.target.error);
        });
    }
    
    // EXPORTAR DADOS (backup)
    async exportData() {
        const inscricoes = await this.getAllInscricoes(10000);
        const logs = await this.getLogs(1000);
        
        const exportData = {
            versao: '1.0',
            data_exportacao: new Date().toISOString(),
            inscricoes: inscricoes,
            logs: logs,
            estatisticas: await this.getStats()
        };
        
        return exportData;
    }
    
    // LIMPAR TODOS OS DADOS
    async clearAll() {
        await this.ensureDB();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['inscricoes', 'logs', 'usuarios'], 'readwrite');
            
            const inscricoesStore = transaction.objectStore('inscricoes');
            const logsStore = transaction.objectStore('logs');
            const usuariosStore = transaction.objectStore('usuarios');
            
            inscricoesStore.clear();
            logsStore.clear();
            usuariosStore.clear();
            
            transaction.oncomplete = () => {
                this.addLog('limpeza_total', 'Todos os dados foram limpos');
                resolve();
            };
            
            transaction.onerror = (event) => reject(event.target.error);
        });
    }
    
    // VERIFICAR SE DB ESTÁ INICIALIZADO
    async ensureDB() {
        if (!this.db) {
            await this.init();
        }
        return this.db;
    }
}

// Exportar instância única (Singleton)
export const db = new TuguedaDB();