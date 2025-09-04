import {getFirestore, collection, getDocs, addDoc, updateDoc, doc, query, where} 
    from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {getAuth, signOut, onAuthStateChanged}
    from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {initializeApp } 
    from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyAMY7ks1IUSolst8eICwm4qDE7bxT4cGCE",
    authDomain: "satayly-e7fe6.firebaseapp.com",
    projectId: "satayly-e7fe6",
    storageBucket: "satayly-e7fe6.appspot.com",
    messagingSenderId: "279822049264",
    appId: "1:279822049264:web:3033519134a5d53074c735",
    measurementId: "G-HSFYXGZNDD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let quartos = [];
let currentUser = null;
let filtroAtivo = "Todos";

const grid = document.getElementById("quartosGrid");
const roomModal = document.getElementById("roomModal");
const roomForm = document.getElementById("roomForm");
const modalTitle = document.getElementById("modalTitle");
const roomId = document.getElementById("roomId");

const livresEl = document.getElementById("quartosLivres");
const reservadosEl = document.getElementById("quartosReservados");
const ocupadosEl = document.getElementById("quartosOcupados");
const indisponiveisEl = document.getElementById("quartosIndisponiveis");
const totaisEl = document.getElementById("quartosTotais");

onAuthStateChanged(auth, (user) => {
    if (user) {
    currentUser = user;
    document.getElementById("userName").textContent =
        user.displayName && user.displayName.trim() !== "" ? user.displayName : user.email;
    loadQuartos();
    } else {
    window.location.href = "../login.html";
    }
});

// LOGOUT
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
        await signOut(auth);
        window.location.href = "../login.html";
        } catch (err) {
        console.error("Erro ao sair:", err);
        alert("Erro ao sair. Tente novamente.");
        }
    });
    }
});

// CARREGAR QUARTOS
async function loadQuartos() {
    quartos = [];
    if (!currentUser) return;

    const q = query(collection(db, "rooms"), where("userId", "==", currentUser.uid));
    const snapshot = await getDocs(q);
    snapshot.forEach(docSnap => {
    quartos.push({ id: docSnap.id, ...docSnap.data() });
    });
    renderGrid();
    updateFiltros();
}

// RENDERIZAR GRID
function renderGrid() {
    grid.innerHTML = "";
    let lista = [...quartos];

    if (filtroAtivo !== "Todos") {
    lista = lista.filter(q => q.status === filtroAtivo);
    }

    if (lista.length === 0) {
    grid.innerHTML = `<p class="empty">Nenhum quarto encontrado.</p>`;
    return;
    }

    lista.sort((a, b) => Number(a.numeroQuarto) - Number(b.numeroQuarto));

    lista.forEach(quarto => {
    const card = document.createElement("article");
    card.classList.add("card");

    const cardHeader = `
        <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">
            <h2>Quarto ${quarto.numeroQuarto}</h2>
            <div class="edit-icon" onclick="editQuarto('${quarto.id}')" title="Editar Quarto">✏️</div>
        </div>
    `;

    let clienteInfo = "";
    let botoes = "";

    if (quarto.status === "Reservado" || quarto.status === "Ocupado") {
        clienteInfo = getQuartoCliente(quarto);
    }

    if (quarto.status === "Disponível") {
        botoes = `
        <button class="btn-primary" onclick="openActionModal('reservar','${quarto.id}')">Reservar</button>
        <button class="btn-success" onclick="openActionModal('checkin','${quarto.id}')">Check-in</button>
        `;
    } else if (quarto.status === "Reservado") {
        botoes = `<button class="btn-success" onclick="confirmCheckin('${quarto.id}')">Check-in</button>`;
    } else if (quarto.status === "Ocupado") {
        botoes = `<button class="btn-warning" onclick="checkOut('${quarto.id}')">Check-out</button>`;
    } else if (quarto.status === "Indisponível") {
        card.classList.add("indisponivel");
    }

    card.innerHTML = `
        ${cardHeader}
        <p><strong>Status:</strong> ${quarto.status}</p>
        <p><strong>Capacidade:</strong> ${quarto.quantidadePessoas} pessoas</p>
        <p><strong>Diária:</strong> R$ ${parseFloat(quarto.valorQuarto).toFixed(2)}</p>
        ${clienteInfo}
        <div class="actions">${botoes}</div>
    `;

    grid.appendChild(card);
    });
}

// EDITAR QUARTO
window.editQuarto = (id) => {
    const quarto = quartos.find(q => q.id === id);
    if (quarto) openModal(true, quarto);
};

// DADOS DO CLIENTE
function getQuartoCliente(quarto) {
    if (!quarto.ultimaReserva) return "";
    const r = quarto.ultimaReserva;
    return `
    <div class="cliente-info">
        <p><strong>Cliente:</strong> ${r.nomeCliente}</p>
        <div class="cliente-info-detalhes">
        <p><strong>Telefone 1:</strong> ${r.telefone1}</p>
        ${r.telefone2 ? `<p><strong>Telefone 2:</strong> ${r.telefone2}</p>` : ""}
        ${r.email ? `<p><strong>Email:</strong> ${r.email}</p>` : ""}
        ${r.cpf ? `<p><strong>CPF:</strong> ${r.cpf}</p>` : ""}
        ${r.dataEntrada ? `<p><strong>Entrada:</strong> ${r.dataEntrada}</p>` : ""}
        ${r.dataSaida ? `<p><strong>Saída:</strong> ${r.dataSaida}</p>` : ""}
        ${r.tipoVeiculo ? `<p><strong>Veículo:</strong> ${r.tipoVeiculo} ${r.marca || ""} ${r.modelo || ""} ${r.placa || ""}</p>` : ""}
        </div>
    </div>
    `;
}

// FILTROS
function updateFiltros() {
    const livres = quartos.filter(q => q.status === "Disponível").length;
    const reservados = quartos.filter(q => q.status === "Reservado").length;
    const ocupados = quartos.filter(q => q.status === "Ocupado").length;
    const indisponiveis = quartos.filter(q => q.status === "Indisponível").length;
    const total = quartos.length;

    livresEl.textContent = livres;
    reservadosEl.textContent = reservados;
    ocupadosEl.textContent = ocupados;
    indisponiveisEl.textContent = indisponiveis;
    totaisEl.textContent = total;
}

// eventos de filtro
livresEl.parentElement.addEventListener("click", () => { filtroAtivo = "Disponível"; renderGrid(); });
reservadosEl.parentElement.addEventListener("click", () => { filtroAtivo = "Reservado"; renderGrid(); });
ocupadosEl.parentElement.addEventListener("click", () => { filtroAtivo = "Ocupado"; renderGrid(); });
indisponiveisEl.parentElement.addEventListener("click", () => { filtroAtivo = "Indisponível"; renderGrid(); });
totaisEl.parentElement.addEventListener("click", () => { filtroAtivo = "Todos"; renderGrid(); });

// MODAL DE QUARTO
function openModal(edit = false, data = null) {
    roomModal.style.display = "flex";
    modalTitle.textContent = edit ? "Editar Quarto" : "Adicionar Quarto";
    roomForm.reset();
    roomId.value = "";

    if (edit && data) {
    roomId.value = data.id;
    Object.keys(data).forEach(key => {
        if (document.getElementById(key)) {
        document.getElementById(key).value = data[key];
        }
    });
    }
}
window.openModal = openModal;

function closeModal(id) {
    document.getElementById(id).style.display = "none";
    if (id === "roomModal") roomForm.reset();
    if (id === "actionModal") document.getElementById("actionForm").reset();
}
window.closeModal = closeModal;

// SALVAR / EDITAR QUARTO
roomForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {};
    Array.from(roomForm.elements).forEach(el => {
    if (el.id && el.value) data[el.id] = el.value;
    });
    data.userId = currentUser.uid;

    if (roomId.value) {
    await updateDoc(doc(db, "rooms", roomId.value), data);
    } else {
    await addDoc(collection(db, "rooms"), data);
    }

    closeModal("roomModal");
    loadQuartos();
});

// RESERVA / CHECK-IN
window.openActionModal = (tipo, id) => {
    const form = document.getElementById("actionForm");
    form.reset();
    form.dataset.tipo = tipo;

    document.getElementById("actionModal").style.display = "flex";
    document.getElementById("actionModalTitle").textContent =
    tipo === "reservar" ? "Reservar Quarto" : "Check-in";
    document.getElementById("actionRoomId").value = id;
};
document.getElementById("actionForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const tipo = e.target.dataset.tipo;
    const id = document.getElementById("actionRoomId").value;
    const roomRef = doc(db, "rooms", id);

    const data = {};
    ["nomeCliente","cpf","telefone1","telefone2","email","qtdPessoas","dataEntrada","dataSaida","tipoVeiculo","marca","modelo","placa"].forEach(field => {
    data[field] = document.getElementById(field).value;
    });

    await addDoc(collection(db, "rooms", id, "reservas"), {
    ...data,
    tipo,
    createdAt: new Date()
    });

    const status = tipo === "reservar" ? "Reservado" : "Ocupado";

    await updateDoc(roomRef, {
    status,
    ultimaReserva: data
    });

    closeModal("actionModal");
    loadQuartos();
});

// CONFIRMAR CHECK-IN
window.confirmCheckin = (id) => {
    if (confirm("Confirmar check-in?")) {
    updateDoc(doc(db, "rooms", id), { status: "Ocupado" }).then(() => loadQuartos());
    }
};

// CHECK-OUT
window.checkOut = async (id) => {
    await updateDoc(doc(db, "rooms", id), {
    status: "Disponível",
    ultimaReserva: null
    });
    loadQuartos();
};

// "Adicionar Quarto"
document.getElementById("btnAddQuarto").addEventListener("click", () => openModal(false));
