import { initializeApp }
 from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"
import { getAuth, createUserWithEmailAndPassword, updateProfile }
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

document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault()
  const name = document.getElementById("name").value
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(userCredential.user, { displayName: name })

    alert("Conta criada com sucesso!")
    window.location.href = "../pages/home.html"
  } catch (error) {
    alert("Erro no cadastro: " + error.message)
  }
})
