import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } 
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"
import { getAuth, signOut, onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"
import { initializeApp } 
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"
import { query, where } 
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

const firebaseConfig = {
  apiKey: "AIzaSyAMY7ks1IUSolst8eICwm4qDE7bxT4cGCE",
  authDomain: "satayly-e7fe6.firebaseapp.com",
  projectId: "satayly-e7fe6",
  storageBucket: "satayly-e7fe6.firebasestorage.app",
  messagingSenderId: "279822049264",
  appId: "1:279822049264:web:3033519134a5d53074c735",
  measurementId: "G-HSFYXGZNDD"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

let rooms = []
const roomsTable = document.getElementById("roomsTable")
const roomModal = document.getElementById("roomModal")
const roomForm = document.getElementById("roomForm")
const modalTitle = document.getElementById("modalTitle")
const roomId = document.getElementById("roomId")

// Resumo
const occupiedElement = document.getElementById("occupiedRooms")
const reservedElement = document.getElementById("reservedRooms")
const availableElement = document.getElementById("availableRooms")
const totalElement = document.getElementById("totalRooms")

let currentUser = null

// Autenticação
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user
    document.getElementById("userName").textContent = user.displayName || user.email
    loadData()
  } else {
    window.location.href = "../login.html"
  }
})

// Logout
document.getElementById("logoutBtn").addEventListener("click", async (e) => {
  e.preventDefault()
  await signOut(auth)
  window.location.href = "../login.html"
})

// Carregar dados (só do usuário logado)
async function loadData() {
  rooms = []
  if (!currentUser) return

  const q = query(collection(db, "rooms"), where("userId", "==", currentUser.uid))
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((docSnap) => {
    rooms.push({ id: docSnap.id, ...docSnap.data() })
  })
  renderRoomsTable()
  updateSummary()
}

// Renderizar tabela
function renderRoomsTable() {
  const tbody = roomsTable.querySelector("tbody")
  tbody.innerHTML = ""
  rooms.forEach(room => {
    const tr = document.createElement("tr")
    tr.innerHTML = `
      <td>${room.numeroQuarto}</td>
      <td>${room.responsavelNome}</td>
      <td>${room.status}</td>
      <td>${room.quantidadePessoas}</td>
      <td>${formatDate(room.checkIN)}</td>
      <td>${formatDate(room.saidaPrevista)}</td>
      <td>R$${parseFloat(room.valorQuarto).toFixed(2)}</td>
      <td>
        ${room.userId === currentUser.uid ? `
          <button class="btn-action btn-edit" onclick="editRoom('${room.id}')"><i class="fas fa-edit"></i></button>
          <button class="btn-action btn-delete" onclick="deleteRoom('${room.id}')"><i class="fas fa-trash"></i></button>
        ` : '-'}
      </td>
    `
    tbody.appendChild(tr)
  })
}

// Atualizar resumo
function updateSummary() {
  const occupied = rooms.filter(r => r.status === "Ocupado").length
  const reserved = rooms.filter(r => r.status === "Reservado").length
  const available = rooms.filter(r => r.status === "Disponível").length
  const total = rooms.length

  occupiedElement.textContent = occupied
  reservedElement.textContent = reserved
  availableElement.textContent = available
  totalElement.textContent = total
}

// Formatar datas
function formatDate(dateString) {
  if (!dateString) return "-"
  return new Date(dateString).toLocaleDateString("pt-BR")
}

// Abrir modal
function openRoomModal(id = null) {
  if (id) {
    const room = rooms.find(r => r.id === id)
    if (room && room.userId === currentUser.uid) {
      modalTitle.textContent = "Editar Quarto"
      roomId.value = room.id
      Object.keys(room).forEach(key => {
        if (document.getElementById(key)) {
          document.getElementById(key).value = room[key]
        }
      })
    } else {
      alert("Você não pode editar este quarto.")
      return
    }
  } else {
    modalTitle.textContent = "Adicionar Quarto"
    roomForm.reset()
    roomId.value = ""
  }
  roomModal.style.display = "flex"
}
window.openRoomModal = openRoomModal

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none"
}
window.closeModal = closeModal

// Salvar quarto
roomForm.addEventListener("submit", async (e) => {
  e.preventDefault()
  const data = {}
  Array.from(roomForm.elements).forEach(el => {
    if (el.id && el.value) data[el.id] = el.value
  })

  // Salvar UID do usuário
  if (currentUser) {
    data.userId = currentUser.uid
  }

  try {
    if (roomId.value) {
      await updateDoc(doc(db, "rooms", roomId.value), data)
    } else {
      await addDoc(collection(db, "rooms"), data)
    }
    closeModal("roomModal")
    loadData()
  } catch (error) {
    console.error("Erro ao salvar quarto:", error)
    alert("Erro ao salvar quarto.")
  }
})

// Editar quarto
window.editRoom = function(id) {
  openRoomModal(id)
}

// Deletar quarto
window.deleteRoom = async function(id) {
  const room = rooms.find(r => r.id === id)
  if (!room || room.userId !== currentUser.uid) {
    alert("Você não pode deletar este quarto.")
    return
  }

  if (confirm("Deseja deletar este quarto?")) {
    try {
      await deleteDoc(doc(db, "rooms", id))
      loadData()
    } catch (error) {
      console.error("Erro ao deletar quarto:", error)
    }
  }
}

// Inicialização
document.getElementById("addRoomBtn").addEventListener("click", () => openRoomModal())
window.onclick = function(event) {
  if (event.target === roomModal) {
    closeModal("roomModal")
  }
}
