/**
 * DevUtils v2.1 - Core Logic
 * SPA Controller, SEO Management & Utility Functions
 */

// --- CONFIGURAÇÃO DE SEO ---
const SEO_CONFIG = {
    'gerador-senha': {
        title: 'Gerador de Senhas Seguras | DevUtils',
        description: 'Crie senhas fortes e aleatórias instantaneamente. Proteção criptográfica local para sua segurança digital.'
    },
    'gerador-whats': {
        title: 'Gerador de Link WhatsApp (wa.me) | DevUtils',
        description: 'Converta seu número em um link direto de WhatsApp. Ideal para Bio do Instagram e atendimento ao cliente.'
    },
    'contador-texto': {
        title: 'Contador de Caracteres e Palavras | DevUtils',
        description: 'Analise seu texto em tempo real. Métricas de SEO, tempo de leitura e densidade de palavras.'
    },
    'formatador-json': {
        title: 'Formatador de JSON Online | DevUtils',
        description: 'Embeleze, valide e formate códigos JSON de forma rápida e segura.'
    },
    'removedor-duplicadas': {
        title: 'Removedor de Linhas Duplicadas | DevUtils',
        description: 'Limpe suas listas removendo itens repetidos instantaneamente de forma simples.'
    }
};

// --- CONTROLE DE INTERFACE (SPA) ---
function alternarFerramenta(id) {
    const ferramentas = Object.keys(SEO_CONFIG);
    
    ferramentas.forEach(f => {
        const area = document.getElementById(`area-${f}`);
        const btn = document.getElementById(`btn-${f}`);
        
        if (f === id) {
            area.classList.remove('hidden');
            btn.classList.add('btn-nav-active');
            btn.classList.remove('btn-nav-inactive');
            
            // Atualização de SEO
            document.title = SEO_CONFIG[f].title;
            const meta = document.getElementById('meta-description');
            if(meta) meta.setAttribute('content', SEO_CONFIG[f].description);
        } else {
            area.classList.add('hidden');
            btn.classList.remove('btn-nav-active');
            btn.classList.add('btn-nav-inactive');
        }
    });

    // Scroll para o topo suave
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- MODO ESCURO (DARK MODE) ---
function updateDarkUI(isDark) {
    const html = document.documentElement;
    const iconDesktop = document.getElementById('dark-icon-desktop');
    const iconMobile = document.getElementById('dark-icon-mobile');
    const toggleDot = document.getElementById('dark-toggle-dot');

    if (isDark) {
        html.classList.add('dark');
        if(iconDesktop) iconDesktop.innerText = '☀️';
        if(iconMobile) iconMobile.innerText = '☀️';
        if(toggleDot) toggleDot.style.left = '24px';
    } else {
        html.classList.remove('dark');
        if(iconDesktop) iconDesktop.innerText = '🌙';
        if(iconMobile) iconMobile.innerText = '🌙';
        if(toggleDot) toggleDot.style.left = '4px';
    }
}

function toggleDarkMode() {
    const isDark = !document.documentElement.classList.contains('dark');
    localStorage.setItem('darkMode', isDark);
    updateDarkUI(isDark);
}

// Inicialização da UI do Dark Mode
document.addEventListener('DOMContentLoaded', () => {
    const stored = localStorage.getItem('darkMode') === 'true' || 
                (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    updateDarkUI(stored);
    
    // Inicia com a primeira ferramenta ativa visualmente
    alternarFerramenta('gerador-senha');
});

// --- MÁSCARA WHATSAPP (XX) XXXXX-XXXX ---
const inputWhats = document.getElementById('whats-numero');
if (inputWhats) {
    inputWhats.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 11) v = v.slice(0, 11);
        
        if (v.length > 7) {
            v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
        } else if (v.length > 2) {
            v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
        } else if (v.length > 0) {
            v = `(${v}`;
        }
        e.target.value = v;
    });
}

// --- UTILITÁRIO: COPIAR TEXTO (UX FEEDBACK) ---
function copiarTexto(idInput, btn) {
    const input = document.getElementById(idInput);
    if (!input || !input.value) return;

    const originalText = btn.innerText;
    
    navigator.clipboard.writeText(input.value).then(() => {
        btn.innerText = 'Copiado!';
        btn.classList.add('bg-indigo-500');

        setTimeout(() => {
            btn.innerText = originalText;
            btn.classList.remove('bg-indigo-500');
        }, 2000);
    }).catch(() => {
        alert('Erro ao copiar. Selecione manualmente.');
    });
}

// --- LÓGICA: GERADOR DE SENHAS ---
function gerarSenha() {
    const len = parseInt(document.getElementById('comprimento-senha').value);
    const sets = {
        u: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        l: 'abcdefghijklmnopqrstuvwxyz',
        n: '0123456789',
        s: '!@#$%^&*()_+~`|}{[]:;?><,./-'
    };

    let pool = '';
    if (document.getElementById('chk-maiusculas').checked) pool += sets.u;
    if (document.getElementById('chk-minusculas').checked) pool += sets.l;
    if (document.getElementById('chk-numeros').checked) pool += sets.n;
    if (document.getElementById('chk-simbolos').checked) pool += sets.s;

    if (!pool) {
        alert('Selecione ao menos um tipo de caractere!');
        return;
    }

    let password = '';
    const array = new Uint32Array(len);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < len; i++) {
        password += pool[array[i] % pool.length];
    }
    
    document.getElementById('senha-resultado').value = password;
}

// --- LÓGICA: GERADOR WHATSAPP ---
function gerarLinkWhats() {
    const num = document.getElementById('whats-numero').value.replace(/\D/g, '');
    const msgCurta = document.getElementById('whats-mensagem-curta').value;
    const msgLonga = document.getElementById('whats-mensagem').value;
    
    if (num.length < 10) {
        alert('Por favor, insira o número completo com DDD.');
        return;
    }

    const mensagemFinal = msgLonga || msgCurta;
    const encodedMsg = encodeURIComponent(mensagemFinal);
    const prefixo = num.length <= 11 ? '55' : '';
    const url = `https://wa.me/${prefixo}${num}${mensagemFinal ? '?text=' + encodedMsg : ''}`;

    const resInput = document.getElementById('whats-resultado');
    resInput.value = url;
    document.getElementById('resultado-whats-container').classList.remove('hidden');
}

// --- LÓGICA: ANALISADOR DE TEXTO ---
function contarTexto() {
    const text = document.getElementById('txt-contador').value;
    
    // Caracteres
    document.getElementById('cont-caracteres').innerText = text.length;
    
    // Palavras
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    document.getElementById('cont-palavras').innerText = words;
    
    // Linhas
    const lines = text ? text.split('\n').filter(l => l.trim()).length : 0;
    document.getElementById('cont-linhas').innerText = lines;

    // Tempo de Leitura
    const seconds = Math.ceil(words / 3);
    document.getElementById('cont-tempo-leitura').innerText = seconds;
}

// --- LÓGICA: FORMATADOR JSON ---
function formatarJSON() {
    const input = document.getElementById('json-input').value;
    const errorDiv = document.getElementById('json-error');
    const container = document.getElementById('json-result-container');
    const output = document.getElementById('json-output');

    try {
        const parsed = JSON.parse(input);
        output.value = JSON.stringify(parsed, null, 4);
        errorDiv.classList.add('hidden');
        container.classList.remove('hidden');
    } catch (e) {
        errorDiv.innerText = "JSON Inválido: " + e.message;
        errorDiv.classList.remove('hidden');
        container.classList.add('hidden');
    }
}

function limparJSON() {
    document.getElementById('json-input').value = "";
    document.getElementById('json-result-container').classList.add('hidden');
    document.getElementById('json-error').classList.add('hidden');
}

// --- LÓGICA: REMOVEDOR DE DUPLICADAS ---
function removerDuplicadas() {
    const input = document.getElementById('duplicadas-input').value;
    const stats = document.getElementById('duplicadas-stats');
    const container = document.getElementById('duplicadas-result-container');
    const output = document.getElementById('duplicadas-output');

    if (!input.trim()) return;

    const linhas = input.split('\n').map(l => l.trim()).filter(l => l !== "");
    const totalOriginal = linhas.length;
    
    const unicas = [...new Set(linhas)];
    const removidas = totalOriginal - unicas.length;

    output.value = unicas.join('\n');
    stats.innerText = `${totalOriginal} processadas | ${removidas} removidas`;
    container.classList.remove('hidden');
}