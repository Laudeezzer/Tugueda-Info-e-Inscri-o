// config.js - Configurações globais

export const CONFIG = {
    APP_NAME: 'Tugueda',
    APP_VERSION: '1.0.0',
    API_URL: '/api', // Para quando houver backend
    
    // Perfis disponíveis
    PERFIS: {
        ARTISTA_SOLO: 'artista_solo',
        BANDA_GRUPO: 'banda_grupo',
        SELO_GRAVADORA: 'selo_gravadora',
        MANAGER_AGENTE: 'manager_agente',
        PROMOTOR_EVENTOS: 'promotor_eventos',
        PRODUTOR: 'produtor',
        RADIO_TV: 'radio_tv',
        JORNALISTA_CRITICO: 'jornalista_critico',
        ESTUDANTE: 'estudante',
        OUVINTE_FA: 'ouvinte_fa',
        LOJA_INSTRUMENTOS: 'loja_instrumentos',
        OUTRO: 'outro'
    },
    
    // Mapeamento de perfis para redirecionamento
    PERFIL_REDIRECT: {
        artista_solo: '/dashboard/artista.html',
        banda_grupo: '/dashboard/banda.html',
        selo_gravadora: '/dashboard/selo.html',
        manager_agente: '/dashboard/manager.html',
        promotor_eventos: '/dashboard/promotor.html',
        produtor: '/dashboard/produtor.html',
        radio_tv: '/dashboard/radio.html',
        jornalista_critico: '/dashboard/jornalista.html',
        estudante: '/dashboard/estudante.html',
        ouvinte_fa: '/dashboard/ouvinte.html',
        loja_instrumentos: '/dashboard/loja.html',
        outro: '/dashboard/outro.html'
    }
};