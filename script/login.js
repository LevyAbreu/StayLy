import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAMY7ks1IUSolst8eICwm4qDE7bxT4cGCE",
  authDomain: "satayly-e7fe6.firebaseapp.com",
  projectId: "satayly-e7fe6",
  storageBucket: "satayly-e7fe6.firebasestorage.app",
  messagingSenderId: "279822049264",
  appId: "1:279822049264:web:3033519134a5d53074c735",
  measurementId: "G-HSFYXGZNDD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// MOSTRAR/OCULTAR SENHA
document.querySelectorAll(".toggle-password").forEach(btn => {
  const azul = "3B82F6";
  const olhoAberto  = `https://img.icons8.com/?size=100&id=59814&format=png&color=${azul}`;
  const olhoFechado = `https://img.icons8.com/?size=100&id=60022&format=png&color=${azul}`;

  btn.innerHTML = `<img src="${olhoFechado}" alt="Mostrar senha" width="20">`;

  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target);
    const img = btn.querySelector("img");

    if (!input) return;

    if (input.type === "password") {
      input.type = "text";
      img.src = olhoAberto;
      img.alt = "Ocultar senha";
    } else {
      input.type = "password";
      img.src = olhoFechado;
      img.alt = "Mostrar senha";
    }
  });
});

// LOGIN
const form = document.getElementById("loginForm");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const remember = document.getElementById("rememberMe").checked;

    try {
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);

      window.location.href = "pages/home.html";
    } catch (error) {
      const map = {
        "auth/invalid-email": "E-mail inválido.",
        "auth/user-disabled": "Usuário desabilitado.",
        "auth/user-not-found": "Usuário não encontrado.",
        "auth/wrong-password": "Senha incorreta.",
        "auth/too-many-requests": "Muitas tentativas. Tente novamente em instantes."
      };
      alert(map[error.code] || `Falha no login: ${error.message}`);
    }
  });
}

// AUTOLOGIN
onAuthStateChanged(auth, (user) => {
  if (user) {
    if (window.location.pathname.endsWith("login.html")) {
      window.location.href = "pages/home.html";
    }
  }
});
