let nomeUsuario = "";
let mensagens = [];
let nomesUsados = [];
let admins = ["Rafael"]; // você é admin por padrão
let banidos = [];
let suspensoes = {};

function carregarPerfil() {
  const perfil = JSON.parse(localStorage.getItem("perfilUsuario"));
  if (perfil && !banidos.includes(perfil.nome)) {
    if (suspensoes[perfil.nome] && Date.now() < suspensoes[perfil.nome]) {
      alert("Você está suspenso temporariamente.");
      return;
    }

    nomeUsuario = perfil.nome;
    if (!nomesUsados.includes(nomeUsuario)) {
      nomesUsados.push(nomeUsuario);
    }

    mostrarChat();
  } else {
    document.getElementById("name-page").style.display = "block";
  }
}

function confirmarNome() {
  const nome = document.getElementById("username").value.trim();

  if (!nome) {
    document.getElementById("name-error").innerText = "Digite um nome.";
    return;
  }

  if (nomesUsados.includes(nome) || banidos.includes(nome)) {
    document.getElementById("name-error").innerText = "Nome já usado ou banido.";
    return;
  }

  nomeUsuario = nome;
  nomesUsados.push(nome);
  salvarPerfil(nome);
  mostrarChat();
}

function mostrarChat() {
  document.getElementById("name-page").style.display = "none";
  document.getElementById("chat-page").style.display = "block";
  document.getElementById("user-label").innerText = nomeUsuario;

  if (admins.includes(nomeUsuario)) {
    document.getElementById("admin-panel").style.display = "block";
  }

  atualizarChat();
  setInterval(atualizarChat, 3000);
}

function salvarPerfil(nome) {
  const perfil = { nome: nome };
  localStorage.setItem("perfilUsuario", JSON.stringify(perfil));
}

function enviarMensagem() {
  const msg = document.getElementById("mensagem").value.trim();
  if (!msg) return;

  mensagens.push({ nome: nomeUsuario, texto: msg });
  document.getElementById("mensagem").value = "";
  atualizarChat();
}

function atualizarChat() {
  const caixa = document.getElementById("chat-box");
  caixa.innerHTML = "";
  mensagens.forEach(m => {
    const p = document.createElement("p");
    p.innerHTML = `<strong>${m.nome}:</strong> ${m.texto}`;
    caixa.appendChild(p);
  });
  caixa.scrollTop = caixa.scrollHeight;
}

// ADMIN: Banir
function banirNome() {
  const alvo = document.getElementById("alvo").value.trim();
  if (alvo && !banidos.includes(alvo)) {
    banidos.push(alvo);
    alert(`${alvo} foi banido.`);
  }
}

// ADMIN: Suspender por 1 minuto
function suspenderNome() {
  const alvo = document.getElementById("alvo").value.trim();
  if (alvo) {
    suspensoes[alvo] = Date.now() + 60000;
    alert(`${alvo} está suspenso por 1 minuto.`);
  }
}

// ADMIN: Adicionar novo admin
function adicionarAdmin() {
  const alvo = document.getElementById("alvo").value.trim();
  if (alvo && !admins.includes(alvo)) {
    admins.push(alvo);
    alert(`${alvo} agora é admin.`);
  }
}
