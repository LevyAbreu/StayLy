// Função para abrir o modal de nova reserva
function openNewReservationModal() {
    document.getElementById('newReservationModal').style.display = 'block';
    // Definir data mínima como hoje
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkinDate').min = today;
    document.getElementById('checkoutDate').min = today;
}

// Função para fechar o modal
function closeModal() {
    document.getElementById('newReservationModal').style.display = 'none';
    document.getElementById('newReservationForm').reset();
}

// Fechar modal ao clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById('newReservationModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Função para salvar nova reserva
function saveReservation() {
    const form = document.getElementById('newReservationForm');
    const formData = new FormData(form);
    
    // Validação básica
    const guestName = document.getElementById('guestName').value;
    const guestEmail = document.getElementById('guestEmail').value;
    const roomNumber = document.getElementById('roomNumber').value;
    const checkinDate = document.getElementById('checkinDate').value;
    const checkoutDate = document.getElementById('checkoutDate').value;
    const totalValue = document.getElementById('totalValue').value;
    
    if (!guestName || !guestEmail || !roomNumber || !checkinDate || !checkoutDate || !totalValue) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Validar se check-out é posterior ao check-in
    if (new Date(checkoutDate) <= new Date(checkinDate)) {
        alert('A data de check-out deve ser posterior à data de check-in.');
        return;
    }
    
    // Simular salvamento
    alert('Reserva criada com sucesso!');
    closeModal();
    
    // Aqui você adicionaria a lógica para enviar os dados para o servidor
    console.log('Dados da reserva:', {
        guestName,
        guestEmail,
        roomNumber,
        checkinDate,
        checkoutDate,
        totalValue
    });
}

// Função para filtrar reservas
function filterReservations() {
    const statusFilter = document.getElementById('statusFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    const roomFilter = document.getElementById('roomFilter').value;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    
    const rows = document.querySelectorAll('.reservation-row');
    
    rows.forEach(row => {
        let showRow = true;
        
        // Filtro por status
        if (statusFilter && row.dataset.status !== statusFilter) {
            showRow = false;
        }
        
        // Filtro por quarto
        if (roomFilter) {
            const roomCell = row.querySelector('.col-room').textContent;
            if (roomCell !== roomFilter) {
                showRow = false;
            }
        }
        
        // Filtro por busca de texto
        if (searchInput) {
            const guestName = row.querySelector('.guest-info strong').textContent.toLowerCase();
            const guestEmail = row.querySelector('.guest-info span').textContent.toLowerCase();
            const roomNumber = row.querySelector('.col-room').textContent.toLowerCase();
            
            if (!guestName.includes(searchInput) && 
                !guestEmail.includes(searchInput) && 
                !roomNumber.includes(searchInput)) {
                showRow = false;
            }
        }
        
        row.style.display = showRow ? 'grid' : 'none';
    });
}

// Adicionar event listener para busca em tempo real
document.getElementById('searchInput').addEventListener('input', filterReservations);

// Função para ver detalhes da reserva
function viewReservation(id) {
    alert(`Visualizando detalhes da reserva #${id.toString().padStart(3, '0')}`);
    // Aqui você implementaria a lógica para mostrar os detalhes completos
}

// Função para editar reserva
function editReservation(id) {
    alert(`Editando reserva #${id.toString().padStart(3, '0')}`);
    // Aqui você implementaria a lógica para editar a reserva
}

// Função para cancelar reserva
function cancelReservation(id) {
    if (confirm(`Tem certeza que deseja cancelar a reserva #${id.toString().padStart(3, '0')}?`)) {
        alert('Reserva cancelada com sucesso!');
        // Aqui você implementaria a lógica para cancelar a reserva
    }
}

// Função para confirmar reserva
function confirmReservation(id) {
    if (confirm(`Confirmar a reserva #${id.toString().padStart(3, '0')}?`)) {
        alert('Reserva confirmada com sucesso!');
        // Aqui você implementaria a lógica para confirmar a reserva
        // Atualizar o status na interface
        const row = document.querySelector(`[data-status="pendente"]`);
        if (row) {
            row.dataset.status = 'confirmada';
            const statusBadge = row.querySelector('.status-badge');
            statusBadge.textContent = 'Confirmada';
            statusBadge.className = 'status-badge status-confirmada';
        }
    }
}

// Função para fazer check-out
function checkoutReservation(id) {
    if (confirm(`Fazer check-out da reserva #${id.toString().padStart(3, '0')}?`)) {
        alert('Check-out realizado com sucesso!');
        // Aqui você implementaria a lógica para fazer o check-out
    }
}

// Função para exportar reservas
function exportReservations() {
    alert('Exportando relatório de reservas...');
    // Aqui você implementaria a lógica para exportar os dados
}

// Atualizar data mínima do check-out quando check-in for alterado
document.getElementById('checkinDate').addEventListener('change', function() {
    const checkinDate = this.value;
    const checkoutInput = document.getElementById('checkoutDate');
    
    if (checkinDate) {
        // Definir data mínima do check-out como um dia após o check-in
        const minCheckout = new Date(checkinDate);
        minCheckout.setDate(minCheckout.getDate() + 1);
        checkoutInput.min = minCheckout.toISOString().split('T')[0];
        
        // Se a data de check-out atual for anterior à nova data mínima, limpar
        if (checkoutInput.value && new Date(checkoutInput.value) <= new Date(checkinDate)) {
            checkoutInput.value = '';
        }
    }
});

// Calcular valor total baseado nas datas (exemplo simples)
function calculateTotal() {
    const checkinDate = document.getElementById('checkinDate').value;
    const checkoutDate = document.getElementById('checkoutDate').value;
    const roomNumber = document.getElementById('roomNumber').value;
    
    if (checkinDate && checkoutDate && roomNumber) {
        const checkin = new Date(checkinDate);
        const checkout = new Date(checkoutDate);
        const nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
        
        // Preços por quarto (exemplo)
        const roomPrices = {
            '101': 150,
            '102': 150,
            '103': 150,
            '201': 200,
            '202': 200
        };
        
        const pricePerNight = roomPrices[roomNumber] || 150;
        const total = nights * pricePerNight;
        
        document.getElementById('totalValue').value = total.toFixed(2);
    }
}

// Adicionar event listeners para cálculo automático
document.getElementById('checkinDate').addEventListener('change', calculateTotal);
document.getElementById('checkoutDate').addEventListener('change', calculateTotal);
document.getElementById('roomNumber').addEventListener('change', calculateTotal);

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Configurar data mínima para hoje
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dateFilter').value = today;
    
    console.log('Página de reservas carregada com sucesso!');
});

