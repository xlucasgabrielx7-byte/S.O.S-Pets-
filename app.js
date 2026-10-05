const animaisAdote = [
    {
        id: 'mel', nome: 'Mel', tipo: 'cachorro', idade: 'adulto', idadeTexto: '2 anos', porte: 'medio', sexo: 'Fêmea', castrado: 'Sim',
        descricao: 'Mel é uma cadela dócil que está procurando uma família responsável.',
        imagem: 'https://www.aspan-rn.org/wp-content/uploads/2026/03/cadela-Mel-a.jpg',
        fonte: 'ASPAN — Natal e Parnamirim/RN'
    },
    {
        id: 'xuxa', nome: 'Xuxa', tipo: 'cachorro', idade: 'adulto', idadeTexto: 'aprox. 4 anos', porte: 'medio', sexo: 'Fêmea', castrado: 'Sim',
        descricao: 'Xuxa é uma cadela amorosa e está disponível para adoção responsável.',
        imagem: 'https://www.aspan-rn.org/wp-content/uploads/2025/07/cadela-XUXA1.jpg',
        fonte: 'ASPAN — Natal e Parnamirim/RN'
    },
    {
        id: 'henrique', nome: 'Henrique', tipo: 'cachorro', idade: 'filhote', idadeTexto: 'aprox. 8 meses', porte: 'medio', sexo: 'Macho', castrado: 'Garantido',
        descricao: 'Henrique é descrito pela ASPAN como amoroso, vacinado e de porte médio.',
        imagem: 'https://www.aspan-rn.org/wp-content/uploads/2025/03/cachorro-HENRIQUE.jpg',
        fonte: 'ASPAN — Natal e Parnamirim/RN'
    },
    {
        id: 'sandy', nome: 'Sandy', tipo: 'cachorro', idade: 'idoso', idadeTexto: '9 anos', porte: 'medio', sexo: 'Fêmea', castrado: 'Sim',
        descricao: 'Sandy é uma cadela que procura um lar tranquilo e responsável.',
        imagem: 'https://www.aspan-rn.org/wp-content/uploads/2024/11/CADELA-SANDY.jpg',
        fonte: 'ASPAN — Natal e Parnamirim/RN'
    },
    {
        id: 'tommy', nome: 'Tommy', tipo: 'cachorro', idade: 'adulto', idadeTexto: 'aprox. 4 anos', porte: 'medio', sexo: 'Macho', castrado: 'Sim',
        descricao: 'Tommy é descrito como calmo, vacinado e de porte médio.',
        imagem: 'https://www.aspan-rn.org/wp-content/uploads/2025/07/cachorro-TOMMY.jpg',
        fonte: 'ASPAN — Natal e Parnamirim/RN'
    },
    {
        id: 'billy', nome: 'Billy', tipo: 'cachorro', idade: 'adulto', idadeTexto: 'aprox. 3 anos', porte: 'medio', sexo: 'Macho', castrado: 'Sim',
        descricao: 'Billy é descrito pela ASPAN como amoroso, castrado e vacinado.',
        imagem: 'https://www.aspan-rn.org/wp-content/uploads/2025/03/cachorro-BILLY-a.jpg',
        fonte: 'ASPAN — Natal e Parnamirim/RN'
    }
];

const chaveAnimais = 'adote_animais_cadastrados';
const chaveFavoritos = 'adote_favoritos';
const chaveSolicitacoes = 'adote_solicitacoes';

function lerStorage(chave, padrao = []) {
    try {
        return JSON.parse(localStorage.getItem(chave)) || padrao;
    } catch {
        return padrao;
    }
}

function salvarStorage(chave, valor) {
    localStorage.setItem(chave, JSON.stringify(valor));
}

function todosOsAnimais() {
    return [...animaisAdote, ...lerStorage(chaveAnimais)];
}

function mostrarAviso(mensagem) {
    let aviso = document.querySelector('.aviso-site');
    if (!aviso) {
        aviso = document.createElement('div');
        aviso.className = 'aviso-site';
        document.body.appendChild(aviso);
    }
    aviso.textContent = mensagem;
    aviso.classList.add('visivel');
    clearTimeout(window.avisoTimer);
    window.avisoTimer = setTimeout(() => aviso.classList.remove('visivel'), 2800);
}

function prepararNavegacao() {
    document.querySelectorAll('a[href="contato.html"]').forEach(link => {
        link.href = 'contato.html';
    });
}

function iniciarAnimais() {
    const lista = document.querySelector('#lista-animais');
    if (!lista) return;

    const pesquisa = document.querySelector('#pesquisa');
    const tipo = document.querySelector('#tipo');
    const idade = document.querySelector('#idade');
    const porte = document.querySelector('#porte');
    const formulario = document.querySelector('#filtros form');

    function renderizar() {
        const termo = (pesquisa?.value || '').trim().toLowerCase();
        const filtrados = todosOsAnimais().filter(animal => {
            const combinaTexto = !termo || `${animal.nome} ${animal.descricao}`.toLowerCase().includes(termo);
            const combinaTipo = !tipo?.value || animal.tipo === tipo.value;
            const combinaIdade = !idade?.value || animal.idade === idade.value;
            const combinaPorte = !porte?.value || animal.porte === porte.value;
            return combinaTexto && combinaTipo && combinaIdade && combinaPorte;
        });

        lista.innerHTML = '';
        if (!filtrados.length) {
            lista.innerHTML = '<p class="nenhum-resultado">Nenhum animal encontrado com esses filtros.</p>';
            return;
        }

        const favoritos = lerStorage(chaveFavoritos);
        filtrados.forEach(animal => {
            const card = document.createElement('article');
            const favorito = favoritos.includes(animal.id);
            card.dataset.animalId = animal.id;
            card.innerHTML = `
                <figure>
                    <img src="${animal.imagem}" alt="${animal.nome}, animal disponível para adoção" loading="lazy">
                </figure>
                <div>
                    <h2>${animal.nome}</h2>
                    <p>${animal.descricao}</p>
                    <span>${animal.idadeTexto} • Porte ${animal.porte}</span>
                    <div class="acoes-animal">
                        <a href="animal.html?id=${encodeURIComponent(animal.id)}">Ver Detalhes</a>
                        <button type="button" class="favoritar" data-favorito="${animal.id}" aria-label="Favoritar ${animal.nome}">${favorito ? '♥' : '♡'}</button>
                    </div>
                </div>`;
            lista.appendChild(card);
        });

        lista.querySelectorAll('[data-favorito]').forEach(botao => {
            botao.addEventListener('click', () => alternarFavorito(botao.dataset.favorito));
        });
    }

    formulario?.addEventListener('submit', e => {
        e.preventDefault();
        renderizar();
    });
    [pesquisa, tipo, idade, porte].forEach(campo => campo?.addEventListener('input', renderizar));
    renderizar();
}

function alternarFavorito(id) {
    const favoritos = lerStorage(chaveFavoritos);
    const posicao = favoritos.indexOf(id);
    if (posicao >= 0) {
        favoritos.splice(posicao, 1);
        mostrarAviso('Animal retirado dos favoritos.');
    } else {
        favoritos.push(id);
        mostrarAviso('Animal salvo nos favoritos.');
    }
    salvarStorage(chaveFavoritos, favoritos);
    iniciarAnimais();
    atualizarPerfil();
}

function iniciarAnimal() {
    const perfil = document.querySelector('#perfil-animal');
    if (!perfil) return;
    const id = new URLSearchParams(location.search).get('id') || 'mel';
    const animal = todosOsAnimais().find(item => item.id === id) || animaisAdote[0];

    const fotoPrincipal = document.querySelector('#galeria > figure img');
    if (fotoPrincipal) {
        fotoPrincipal.src = animal.imagem;
        fotoPrincipal.alt = animal.nome;
    }
    document.querySelector('#informacoes h1')?.replaceChildren(document.createTextNode(animal.nome));
    const descricao = document.querySelector('#informacoes > p');
    if (descricao) descricao.textContent = animal.descricao;

    const blocos = document.querySelectorAll('#informacoes > div > article');
    const valores = [animal.idadeTexto, animal.porte, animal.sexo, animal.castrado];
    blocos.forEach((bloco, i) => {
        const strong = bloco.querySelector('strong');
        if (strong) strong.textContent = `${['Idade', 'Porte', 'Sexo', 'Castrado'][i]}: ${valores[i]}`;
    });

    const secaoDescricao = document.querySelector('#informacoes > section');
    if (secaoDescricao) {
        secaoDescricao.querySelector('h2').textContent = 'Sobre ' + animal.nome;
        secaoDescricao.querySelector('p').textContent = `${animal.descricao} Fonte do cadastro: ${animal.fonte}.`;
    }

    const botaoAdotar = document.querySelector('#informacoes > a');
    if (botaoAdotar) {
        botaoAdotar.textContent = 'Quero demonstrar interesse';
        botaoAdotar.href = `contato.html?animal=${encodeURIComponent(animal.nome)}`;
    }

    const semelhantes = document.querySelectorAll('#semelhantes article');
    todosOsAnimais().filter(item => item.id !== animal.id).slice(0, 3).forEach((item, i) => {
        const card = semelhantes[i];
        if (!card) return;
        card.querySelector('img').src = item.imagem;
        card.querySelector('img').alt = item.nome;
        card.querySelector('h3').textContent = item.nome;
        card.querySelector('a').href = `animal.html?id=${encodeURIComponent(item.id)}`;
    });
}

function iniciarCadastro() {
    const formulario = document.querySelector('#form-cadastro-animal');
    if (!formulario) return;
    formulario.addEventListener('submit', e => {
        e.preventDefault();
        const dados = Object.fromEntries(new FormData(formulario).entries());
        dados.id = 'cad-' + Date.now();
        dados.descricao = dados.descricao || 'Animal cadastrado pela equipe do S.O.S pets.';
        dados.fonte = 'Cadastro S.O.S pets';
        const cadastrados = lerStorage(chaveAnimais);
        cadastrados.push(dados);
        salvarStorage(chaveAnimais, cadastrados);
        formulario.reset();
        mostrarAviso('Animal cadastrado com sucesso!');
    });
}

function iniciarInteresseAdocao() {
    const formulario = document.querySelector('#formulario form');
    if (!formulario) return;
    const params = new URLSearchParams(location.search);
    const animal = params.get('animal');
    if (animal && formulario.querySelector('#mensagem')) {
        formulario.querySelector('#mensagem').value = `Tenho interesse em adotar o animal ${animal}.`;
    }
    formulario.addEventListener('submit', e => {
        e.preventDefault();
        const dados = Object.fromEntries(new FormData(formulario).entries());
        const lista = lerStorage(chaveSolicitacoes);
        lista.push({ ...dados, data: new Date().toLocaleString('pt-BR') });
        salvarStorage(chaveSolicitacoes, lista);
        formulario.reset();
        mostrarAviso('Mensagem enviada. Em um site real, ela seria encaminhada para a equipe.');
    });
}

function iniciarChat() {
    if (document.querySelector('.chat-adote')) return;
    const botao = document.createElement('button');
    botao.className = 'chat-botao';
    botao.type = 'button';
    botao.textContent = '💬';
    botao.title = 'Ajuda do S.O.S pets';

    const janela = document.createElement('div');
    janela.className = 'chat-adote';
    janela.innerHTML = `
        <strong>Ajuda rápida</strong>
        <p>Oi! Posso te mostrar caminhos dentro do site.</p>
        <button data-chat="animais">Ver animais</button>
        <button data-chat="como">Como adotar?</button>
        <button data-chat="favoritos">Meus favoritos</button>`;
    document.body.append(botao, janela);
    botao.addEventListener('click', () => janela.classList.toggle('aberto'));
    janela.querySelectorAll('[data-chat]').forEach(item => item.addEventListener('click', () => {
        const acao = item.dataset.chat;
        if (acao === 'animais') location.href = 'animais.html';
        if (acao === 'como') location.href = 'como-adotar.html';
        if (acao === 'favoritos') {
            const total = lerStorage(chaveFavoritos).length;
            mostrarAviso(total ? `Você tem ${total} favorito(s).` : 'Você ainda não tem favoritos.');
        }
    }));
}

function iniciarNotificacoes() {
    const favoritos = lerStorage(chaveFavoritos).length;
    const link = document.querySelector('a[href="perfil.html"]');
    if (link && favoritos) link.textContent = `Perfil (${favoritos})`;
}

async function gerarSenha(senha) {
    // A senha não fica salva em texto puro no navegador.
    const dados = new TextEncoder().encode(senha);
    const hash = await crypto.subtle.digest('SHA-256', dados);
    return Array.from(new Uint8Array(hash))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}

function lerContas() {
    return lerStorage('adote_contas', []);
}

function salvarContas(contas) {
    salvarStorage('adote_contas', contas);
}

async function iniciarLogin() {
    const loginForm = document.querySelector('#login-form');
    const cadastroForm = document.querySelector('#cadastro-form');
    const entrar = document.querySelector('#form-entrar');
    const cadastro = document.querySelector('#form-cadastro');

    if (!loginForm && !cadastroForm) return;

    document.querySelector('#mostrar-cadastro')?.addEventListener('click', () => {
        entrar.hidden = true;
        cadastro.hidden = false;
    });

    document.querySelector('#mostrar-login')?.addEventListener('click', () => {
        cadastro.hidden = true;
        entrar.hidden = false;
    });

    loginForm?.addEventListener('submit', async e => {
        e.preventDefault();

        const dados = Object.fromEntries(new FormData(loginForm).entries());
        const email = dados.email.trim().toLowerCase();
        const senha = await gerarSenha(dados.senha);
        const conta = lerContas().find(item => item.email === email && item.senha === senha);

        if (!conta) {
            mostrarAviso('E-mail ou senha incorretos.');
            return;
        }

        localStorage.setItem('usuarioNome', conta.nome);
        localStorage.setItem('usuarioEmail', conta.email);
        localStorage.setItem('usuarioFoto', '');
        localStorage.setItem('usuarioLogado', 'true');

        mostrarAviso('Login realizado!');
        setTimeout(() => location.href = 'perfil.html', 500);
    });

    cadastroForm?.addEventListener('submit', async e => {
        e.preventDefault();

        const dados = Object.fromEntries(new FormData(cadastroForm).entries());
        const nome = dados.nome.trim();
        const email = dados.email.trim().toLowerCase();

        if (dados.senha !== dados.confirmacao) {
            mostrarAviso('As senhas não são iguais.');
            return;
        }

        if (dados.senha.length < 6) {
            mostrarAviso('A senha precisa ter pelo menos 6 caracteres.');
            return;
        }

        const contas = lerContas();

        if (contas.some(conta => conta.email === email)) {
            mostrarAviso('Esse e-mail já está cadastrado.');
            return;
        }

        const senha = await gerarSenha(dados.senha);
        contas.push({ nome, email, senha });
        salvarContas(contas);

        localStorage.setItem('usuarioNome', nome);
        localStorage.setItem('usuarioEmail', email);
        localStorage.setItem('usuarioFoto', '');
        localStorage.setItem('usuarioLogado', 'true');

        mostrarAviso('Conta criada com sucesso!');
        setTimeout(() => location.href = 'perfil.html', 600);
    });
}

function atualizarPerfil() {
    const nome = localStorage.getItem('usuarioNome');
    const email = localStorage.getItem('usuarioEmail');
    const foto = localStorage.getItem('usuarioFoto');
    document.querySelector('#nomeUsuario')?.replaceChildren(document.createTextNode(nome || 'Visitante'));
    document.querySelector('#emailUsuario')?.replaceChildren(document.createTextNode(email || 'Entre para acessar seu perfil.'));
    const imagem = document.querySelector('#fotoUsuario');
    if (imagem && foto) imagem.src = foto;
    const favoritos = lerStorage(chaveFavoritos);
    const lista = document.querySelector('#lista-favoritos');
    if (lista) {
        lista.innerHTML = '';
        todosOsAnimais().filter(animal => favoritos.includes(animal.id)).forEach(animal => {
            const item = document.createElement('li');
            item.innerHTML = `<a href="animal.html?id=${encodeURIComponent(animal.id)}">${animal.nome}</a>`;
            lista.appendChild(item);
        });
        if (!lista.children.length) lista.innerHTML = '<li>Nenhum favorito ainda.</li>';
    }
}

function iniciarPerfil() {
    if (!document.querySelector('#nomeUsuario')) return;

    if (localStorage.getItem('usuarioLogado') !== 'true') {
        location.href = 'login.html';
        return;
    }

    atualizarPerfil();
    document.querySelector('#sair')?.addEventListener('click', () => {
        localStorage.removeItem('usuarioNome');
        localStorage.removeItem('usuarioEmail');
        localStorage.removeItem('usuarioFoto');
        localStorage.removeItem('usuarioLogado');
        location.href = 'login.html';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    prepararNavegacao();
    iniciarAnimais();
    iniciarAnimal();
    iniciarCadastro();
    iniciarInteresseAdocao();
    iniciarChat();
    iniciarNotificacoes();
    iniciarLogin();
    iniciarPerfil();
});


/* =========================================================
   MENU MOBILE — navegação responsiva
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.menu-mobile').forEach(botao => {
        const nav = botao.parentElement.querySelector('nav');
        if (!nav) return;
        botao.addEventListener('click', () => {
            const aberto = nav.classList.toggle('menu-aberto');
            botao.setAttribute('aria-expanded', String(aberto));
            botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
            botao.textContent = aberto ? '×' : '☰';
        });
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('menu-aberto');
                botao.setAttribute('aria-expanded', 'false');
                botao.setAttribute('aria-label', 'Abrir menu');
                botao.textContent = '☰';
            });
        });
    });
});
