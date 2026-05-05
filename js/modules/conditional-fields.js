// conditional-fields.js - Gerencia campos condicionais por perfil

import { CONFIG } from '../config.js';

export class ConditionalFields {
    constructor(formElement, perfilSelectId = 'perfil') {
        this.form = formElement;
        this.perfilSelect = document.getElementById(perfilSelectId);
        this.sections = new Map();
        
        // Mapeamento de perfis para IDs das seções
        this.perfilSections = {
            [CONFIG.PERFIS.ARTISTA_SOLO]: 'artista_solo_fields',
            [CONFIG.PERFIS.BANDA_GRUPO]: 'banda_grupo_fields',
            [CONFIG.PERFIS.SELO_GRAVADORA]: 'selo_gravadora_fields',
            [CONFIG.PERFIS.MANAGER_AGENTE]: 'manager_agente_fields',
            [CONFIG.PERFIS.PROMOTOR_EVENTOS]: 'promotor_eventos_fields',
            [CONFIG.PERFIS.PRODUTOR]: 'produtor_fields',
            [CONFIG.PERFIS.RADIO_TV]: 'radio_tv_fields',
            [CONFIG.PERFIS.JORNALISTA_CRITICO]: 'jornalista_fields',
            [CONFIG.PERFIS.ESTUDANTE]: 'estudante_fields',
            [CONFIG.PERFIS.OUVINTE_FA]: 'ouvinte_fields',
            [CONFIG.PERFIS.LOJA_INSTRUMENTOS]: 'loja_fields',
            [CONFIG.PERFIS.OUTRO]: 'outro_fields'
        };
        
        this.init();
    }
    
    init() {
        if (!this.perfilSelect) return;
        
        // Registrar todas as seções condicionais
        for (const [perfil, sectionId] of Object.entries(this.perfilSections)) {
            const section = document.getElementById(sectionId);
            if (section) {
                this.sections.set(perfil, section);
            }
        }
        
        // Esconder todas inicialmente
        this.hideAllSections();
        
        // Adicionar evento de mudança
        this.perfilSelect.addEventListener('change', () => {
            this.handlePerfilChange();
        });
        
        // Disparar uma vez para estado inicial
        this.handlePerfilChange();
    }
    
    hideAllSections() {
        this.sections.forEach(section => {
            section.classList.add('hidden');
        });
    }
    
    showSection(perfil) {
        const section = this.sections.get(perfil);
        if (section) {
            section.classList.remove('hidden');
        }
    }
    
    handlePerfilChange() {
        const selectedPerfil = this.perfilSelect.value;
        
        this.hideAllSections();
        
        if (selectedPerfil && this.perfilSections[selectedPerfil]) {
            this.showSection(selectedPerfil);
        }
        
        // Atualizar label do campo nome baseado no perfil
        this.updateNomeLabel(selectedPerfil);
    }
    
    updateNomeLabel(perfil) {
        const labelNome = document.querySelector('label[for="nome"]');
        if (!labelNome) return;
        
        let labelText = 'Nome completo';
        
        switch(perfil) {
            case CONFIG.PERFIS.ARTISTA_SOLO:
            case CONFIG.PERFIS.BANDA_GRUPO:
                labelText = 'Nome / Nome Artístico';
                break;
            case CONFIG.PERFIS.SELO_GRAVADORA:
                labelText = 'Nome do Selo / Gravadora';
                break;
            case CONFIG.PERFIS.MANAGER_AGENTE:
            case CONFIG.PERFIS.PROMOTOR_EVENTOS:
                labelText = 'Nome completo / Razão Social';
                break;
            default:
                labelText = 'Nome completo';
        }
        
        const requiredSpan = labelNome.querySelector('.required');
        labelNome.innerHTML = `${labelText} ${requiredSpan ? '<span class="required">*</span>' : ''}`;
    }
    
    /**
     * Coleta os dados específicos do perfil selecionado
     */
    getPerfilData() {
        const perfil = this.perfilSelect.value;
        const data = {};
        
        switch(perfil) {
            case CONFIG.PERFIS.ARTISTA_SOLO:
                data.nome_artistico = document.getElementById('nome_artistico')?.value || '';
                data.ano_carreira = document.getElementById('ano_carreira')?.value || '';
                data.generos = this.getSelectedValues('generos_artista');
                data.links = document.getElementById('links_musica')?.value || '';
                break;
                
            case CONFIG.PERFIS.BANDA_GRUPO:
                data.nome_banda = document.getElementById('nome_banda')?.value || '';
                data.num_membros = document.getElementById('num_membros')?.value || '';
                data.ano_formacao = document.getElementById('ano_formacao')?.value || '';
                data.generos = this.getSelectedValues('generos_banda');
                break;
                
            case CONFIG.PERFIS.SELO_GRAVADORA:
                data.nome_selo = document.getElementById('nome_selo')?.value || '';
                data.ano_selo = document.getElementById('ano_selo')?.value || '';
                data.num_artistas = document.getElementById('num_artistas_selo')?.value || '';
                data.site = document.getElementById('site_selo')?.value || '';
                break;
                
            case CONFIG.PERFIS.MANAGER_AGENTE:
                data.empresa = document.getElementById('empresa_manager')?.value || '';
                data.num_artistas = document.getElementById('num_artistas_manager')?.value || '';
                data.areas = this.getSelectedValues('areas_manager');
                break;
                
            case CONFIG.PERFIS.PROMOTOR_EVENTOS:
                data.empresa = document.getElementById('empresa_promotor')?.value || '';
                data.eventos = document.getElementById('eventos_realizados')?.value || '';
                data.capacidade = document.getElementById('capacidade_eventos')?.value || '';
                break;
                
            case CONFIG.PERFIS.PRODUTOR:
                data.estudio = document.getElementById('estudio_produtor')?.value || '';
                data.anos = document.getElementById('anos_produtor')?.value || '';
                data.daws = document.getElementById('daws')?.value || '';
                data.portfolio = document.getElementById('portfolio_produtor')?.value || '';
                break;
                
            case CONFIG.PERFIS.RADIO_TV:
                data.veiculo = document.getElementById('nome_veiculo')?.value || '';
                data.tipo = document.getElementById('tipo_veiculo')?.value || '';
                data.audiencia = document.getElementById('audiencia')?.value || '';
                break;
                
            case CONFIG.PERFIS.JORNALISTA_CRITICO:
                data.veiculo = document.getElementById('veiculo_jornalista')?.value || '';
                data.especialidade = document.getElementById('especialidade_jornalista')?.value || '';
                data.portfolio = document.getElementById('portfolio_jornalista')?.value || '';
                break;
                
            case CONFIG.PERFIS.ESTUDANTE:
                data.curso = document.getElementById('curso_estudante')?.value || '';
                data.instituicao = document.getElementById('instituicao')?.value || '';
                data.ano = document.getElementById('ano_estudante')?.value || '';
                break;
                
            case CONFIG.PERFIS.OUVINTE_FA:
                data.generos = this.getSelectedValues('generos_ouvinte');
                data.artistas_fav = document.getElementById('artistas_favoritos')?.value || '';
                data.plataforma = document.getElementById('plataforma_ouvinte')?.value || '';
                break;
                
            case CONFIG.PERFIS.LOJA_INSTRUMENTOS:
                data.nome_loja = document.getElementById('nome_loja')?.value || '';
                data.produtos = document.getElementById('tipo_produtos')?.value || '';
                data.localizacao = document.getElementById('localizacao_loja')?.value || '';
                break;
                
            case CONFIG.PERFIS.OUTRO:
                data.descricao = document.getElementById('descricao_outro')?.value || '';
                break;
        }
        
        return data;
    }
    
    getSelectedValues(selectId) {
        const select = document.getElementById(selectId);
        if (!select) return [];
        
        return Array.from(select.selectedOptions).map(opt => opt.value);
    }
    
    /**
     * Reseta/limpa os campos condicionais
     */
    resetPerfilFields() {
        const fields = document.querySelectorAll('.conditional-section input, .conditional-section select, .conditional-section textarea');
        fields.forEach(field => {
            if (field.type === 'checkbox' || field.type === 'radio') {
                field.checked = false;
            } else if (field.tagName === 'SELECT' && field.multiple) {
                Array.from(field.options).forEach(opt => opt.selected = false);
            } else {
                field.value = '';
            }
        });
    }
}