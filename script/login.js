import { initializeApp }
 from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"
import {   getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup }
 from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"

const firebaseConfig = {
  apiKey: "AIzaSyAMY7ks1IUSolst8eICwm4qDE7bxT4cGCE",
  authDomain: "satayly-e7fe6.firebaseapp.com",
  projectId: "satayly-e7fe6",
  storageBucket: "satayly-e7fe6.firebasestorage.app",
  messagingSenderId: "279822049264",
  appId: "1:279822049264:web:3033519134a5d53074c735",
  measurementId: "G-HSFYXGZNDD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

// Login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault()
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  try {
    await signInWithEmailAndPassword(auth, email, password)
    alert("Login realizado com sucesso!")
    window.location.href = "../pages/home.html"
  } catch (error) {
    alert("Falha no login: " + error.message)
  }
})

document.querySelectorAll(".toggle-password").forEach(btn => {
  // definir imagens
  const olhoAberto = "https://img.icons8.com/?size=100&id=59814&format=png&color=E91E63";
  const olhoFechado = "https://img.icons8.com/?size=100&id=60022&format=png&color=E91E63";

  // definir imagem inicial
  btn.innerHTML = `<img src="${olhoFechado}" alt="Mostrar senha" width="20">`;

  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target);
    const img = btn.querySelector("img");

    if (input.type === "password") {
      input.type = "text";
      img.src = olhoAberto;
    } else {
      input.type = "password";
      img.src = olhoFechado;
    }
  });
});