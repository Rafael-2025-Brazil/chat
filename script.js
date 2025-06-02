let nomeUsuario = "";
let mensagens = JSON.parse(localStorage.getItem("chatMensagens") || "[]");

function confirmName() {
  const nome = document.getElementById("username").value.trim();
  const erro = document.getElementById("name-error");

  if (!nome) {
    erro.textContent = "Digite um nome.";
    return;
  }

  let nomesAtivos = JSON.parse(localStorage.getItem("nomesAtivos") || "[]");

  if (nomesAtivos.includes(nome)) {
    erro.textContent = "Este nome já está em uso!";
    return;
  }

  nomeUsuario = nome;
  nomesAtivos.push(nome);
  localStorage.setItem("nomesAtivos", JSON.stringify(nomesAtivos));

  document.getElementById("name-page").style.display = "none";
  document.getElementById("chat-page").style.display = "block";
  document.getElementById("user-label").textContent = nomeUsuario;

  atualizarChat();
  setInterval(atualizarChat, 3000);
}

function enviarMensagem() {
  const texto = document.getElementById("mensagem").value.trim();
  if (texto === "") return;

  mensagens.push({ nome: nomeUsuario, texto });
  localStorage.setItem("chatMensagens", JSON.stringify(mensagens));
  document.getElementById("mensagem").value = "";
  atualizarChat();
}

function atualizarChat() {
  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML = mensagens.map(m =>
    `<p><strong>${m.nome}:</strong> ${m.texto}</p>`
  ).join("");
  chatBox.scrollTop = chatBox.scrollHeight;
}

window.addEventListener("beforeunload", () => {
  let nomesAtivos = JSON.parse(localStorage.getItem("nomesAtivos") || "[]");
  nomesAtivos = nomesAtivos.filter(n => n !== nomeUsuario);
  localStorage.setItem("nomesAtivos", JSON.stringify(nomesAtivos));
});
