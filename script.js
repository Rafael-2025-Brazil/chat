let nomeUsuario = "";
let nomesUsados = [];
let mensagens = [];
let banidos = [];
let suspensos = [];
let admins = ["rafael"]; // Só você é admin por padrão

function fazerLogin() {
  const senha = document.getElementById("senha").value;
  if (senha === "1234") {
    document.getElementById("login-page").style.display = "none";
    document.getElementById("name-page").style.display = "block";
  } else {
    document.getElementById("login-error").textContent = "Senha incorreta!";
  }
}

function confirmName() {
  const nome = document.getElementById("username").value.trim();
  const agora = Date.now();

  const suspensao = suspensos.find(u => u.nome === nome);
  if (suspensao && agora < suspensao.fim) {
    document.getElementById("name-error").textContent = `Usuário suspenso por ${Math.ceil((suspensao.fim - agora) / 60000)} min.`;
    return;
  }

  if (banidos.includes(nome)) {
    document.getElementById("name-error").textContent = "Usuário banido!";
    return;
  }

  if (nome === "") {
    document.getElementById("name-error").textContent = "Digite um nome válido!";
    return;
  }

  let ativos = JSON.parse(localStorage.getItem("usuariosAtivos") || "[]");
  if (ativos.includes(nome)) {
    document.getElementById("name-error").textContent = "Nome já está sendo utilizado!";
    return;
  }

  nomeUsuario = nome;
  nomesUsados.push(nome);
  ativos.push(nome);
  localStorage.setItem("usuariosAtivos", JSON.stringify(ativos));

  document.getElementById("name-page").style.display = "none";
  document.getElementById("chat-page").style.display = "block";
  document.getElementById("user-label").textContent = nomeUsuario;

  if (admins.includes(nomeUsuario)) {
    document.getElementById("admin-panel").style.display = "block";
  }

  atualizarChat();
  setInterval(atualizarChat, 5000);
}

window.addEventListener("beforeunload", () => {
  let ativos = JSON.parse(localStorage.getItem("usuariosAtivos") || "[]");
  ativos = ativos.filter(nome => nome !== nomeUsuario);
  localStorage.setItem("usuariosAtivos", JSON.stringify(ativos));
});

function enviarMensagem() {
  const msg = document.getElementById("mensagem").value.trim();
  if (msg !== "") {
    mensagens.push({ nome: nomeUsuario, texto: msg });
    document.getElementById("mensagem").value = "";
    atualizarChat();
  }
}

function atualizarChat() {
  const box = document.getElementById("chat-box");
  box.innerHTML = mensagens.map(m => `<p><strong>${m.nome}:</strong> ${m.texto}</p>`).join("");
  box.scrollTop = box.scrollHeight;
}

function banir() {
  const nome = document.getElementById("admin-alvo").value.trim();
  if (nome && !banidos.includes(nome)) {
    banidos.push(nome);
    alert(nome + " foi banido!");
  }
}

function suspender() {
  const nome = document.getElementById("admin-alvo").value.trim();
  if (nome) {
    suspensos.push({ nome, fim: Date.now() + 60000 });
    alert(nome + " foi suspenso por 1 minuto!");
  }
}

function adicionarAdmin() {
  const nome = document.getElementById("admin-alvo").value.trim();
  if (nome && !admins.includes(nome)) {
    admins.push(nome);
    alert(nome + " agora é admin!");
  }
}