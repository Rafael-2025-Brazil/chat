let nomeUsuario = "";
let mensagens = [];

function confirmName() {
  const nome = document.getElementById("username").value.trim();
  if (!nome) {
    document.getElementById("name-error").textContent = "Digite um nome.";
    return;
  }

  let ativos = JSON.parse(localStorage.getItem("usuariosAtivos") || "[]");

  if (ativos.includes(nome)) {
    document.getElementById("name-error").textContent = "Nome já está em uso!";
    return;
  }

  nomeUsuario = nome;
  ativos.push(nome);
  localStorage.setItem("usuariosAtivos", JSON.stringify(ativos));

  document.getElementById("name-page").style.display = "none";
  document.getElementById("chat-page").style.display = "block";
  document.getElementById("user-label").textContent = nomeUsuario;

  atualizarChat();
  setInterval(atualizarChat, 5000);
}

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

window.addEventListener("load", () => {
  document.getElementById("name-page").style.display = "block";
});

window.addEventListener("beforeunload", () => {
  let ativos = JSON.parse(localStorage.getItem("usuariosAtivos") || "[]");
  ativos = ativos.filter(n => n !== nomeUsuario);
  localStorage.setItem("usuariosAtivos", JSON.stringify(ativos));
});
