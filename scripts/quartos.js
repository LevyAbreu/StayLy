// JavaScript para a página de quartos

// Dados dos quartos (simulação)
const roomsData = {
    101: { number: 101, capacity: 2, status: 'livre', floor: 1 },
    102: { number: 102, capacity: 3, status: 'reservado', floor: 1 },
    103: { number: 103, capacity: 2, status: 'livre', floor: 1 },
    104: { number: 104, capacity: 4, status: 'livre', floor: 1 },
    105: { number: 105, capacity: 2, status: 'livre', floor: 1 },
    106: { number: 106, capacity: 3, status: 'livre', floor: 1 },
    107: { number: 107, capacity: 2, status: 'livre', floor: 1 },
    108: { number: 108, capacity: 5, status: 'livre', floor: 1 },
    201: { number: 201, capacity: 4, status: 'ocupado', floor: 2 },
    202: { number: 202, capacity: 3, status: 'livre', floor: 2 },
    203: { number: 203, capacity: 2, status: 'livre', floor: 2 },
    204: { number: 204, capacity: 6, status: 'livre', floor: 2 },
    205: { number: 205, capacity: 2, status: 'livre', floor: 2 },
    206: { number: 206, capacity: 3, status: 'livre', floor: 2 },
    207: { number: 207, capacity: 4, status: 'livre', floor: 2 },
    208: { number: 208, capacity: 2, status: 'livre', floor: 2 },
    209: { number: 209, capacity: 5, status: 'livre', floor: 2 }
};

// Função para filtrar quartos por status
function filterRooms(status) {
    const roomCards = document.querySelectorAll('.room-card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Atualizar botões ativos
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.status === status) {
            btn.classList.add('active');
        }
    });
    
    // Filtrar quartos
    roomCards.forEach(card => {
        const roomStatus = card.dataset.status;
        
        if (status === 'todos' || roomStatus === status) {
            card.classList.remove('hidden');
            card.style.display = 'block';
        } else {
            card.classList.add('hidden');
            card.style.display = 'none';
        }
    });
    
    // Atualizar contadores nos botões
    updateFilterCounters();
}

// Função para atualizar contadores nos botões de filtro
function updateFilterCounters() {
    const allRooms = document.querySelectorAll('.room-card').length;
    const livreRooms = document.querySelectorAll('.room-card[data-status="livre"]').length;
    const reservadoRooms = document.querySelectorAll('.room-card[data-status="reservado"]').length;
    const ocupadoRooms = document.querySelectorAll('.room-card[data-status="ocupado"]').length;
    
    // Atualizar textos dos botões
    document.querySelector('[data-status="todos"]').textContent = `Todos (${allRooms})`;
    document.querySelector('[data-status="livre"]').textContent = `Livres (${livreRooms})`;
    document.querySelector('[data-status="reservado"]').textContent = `Reservados (${reservadoRooms})`;
    document.querySelector('[data-status="ocupado"]').textContent = `Ocupados (${ocupadoRooms})`;
}

// Função para buscar quartos
function searchRooms() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const roomCards = document.querySelectorAll('.room-card');
    
    roomCards.forEach(card => {
        const roomNumber = card.dataset.room;
        const roomCapacity = card.querySelector('.capacity-text').textContent.toLowerCase();
        const roomStatus = card.querySelector('.room-status').textContent.toLowerCase();
        
        const matchesSearch = roomNumber.includes(searchTerm) || 
                            roomCapacity.includes(searchTerm) || 
                            roomStatus.includes(searchTerm);
        
        if (matchesSearch) {
            card.style.display = 'block';
            card.classList.remove('hidden');
        } else {
            card.style.display = 'none';
            card.classList.add('hidden');
        }
    });
}

// Função para abrir detalhes do quarto
function openRoomDetails(roomNumber) {
    const room = roomsData[roomNumber];
    
    if (room) {
        // Por enquanto, apenas mostra um alert com as informações
        // Futuramente será substituído pela navegação para a tela de detalhes
        alert(`Detalhes do Quarto ${roomNumber}:\n\n` +
              `Capacidade: ${room.capacity} pessoas\n` +
              `Status: ${getStatusText(room.status)}\n` +
              `Andar: ${room.floor}º\n\n` +
              `Esta funcionalidade será desenvolvida em breve.`);
        
        // Aqui você pode adicionar a lógica para navegar para a página de detalhes
        // Por exemplo: window.location.href = `detalhes-quarto.html?room=${roomNumber}`;
        
        console.log(`Navegando para detalhes do quarto ${roomNumber}`);
    }
}

// Função auxiliar para obter texto do status
function getStatusText(status) {
    const statusTexts = {
        'livre': 'Livre para reserva',
        'reservado': 'Reservado',
        'ocupado': 'Ocupado'
    };
    return statusTexts[status] || status;
}

// Função para atualizar status de um quarto (para uso futuro)
function updateRoomStatus(roomNumber, newStatus) {
    const roomCard = document.querySelector(`[data-room="${roomNumber}"]`);
    
    if (roomCard && roomsData[roomNumber]) {
        // Remover classes de status antigas
        roomCard.classList.remove('status-livre', 'status-reservado', 'status-ocupado');
        
        // Adicionar nova classe de status
        roomCard.classList.add(`status-${newStatus}`);
        
        // Atualizar dataset
        roomCard.dataset.status = newStatus;
        
        // Atualizar texto do status
        const statusElement = roomCard.querySelector('.room-status');
        statusElement.textContent = getStatusText(newStatus);
        
        // Atualizar dados internos
        roomsData[roomNumber].status = newStatus;
        
        // Atualizar contadores
        updateFilterCounters();
        
        console.log(`Status do quarto ${roomNumber} atualizado para: ${newStatus}`);
    }
}

// Função para obter estatísticas dos quartos
function getRoomStatistics() {
    const stats = {
        total: 0,
        livre: 0,
        reservado: 0,
        ocupado: 0,
        capacidadeTotal: 0
    };
    
    Object.values(roomsData).forEach(room => {
        stats.total++;
        stats[room.status]++;
        stats.capacidadeTotal += room.capacity;
    });
    
    stats.taxaOcupacao = Math.round(((stats.reservado + stats.ocupado) / stats.total) * 100);
    
    return stats;
}

// Função para atualizar estatísticas na interface
function updateStatistics() {
    const stats = getRoomStatistics();
    
    // Atualizar valores nas estatísticas
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length >= 6) {
        statValues[0].textContent = stats.total;
        statValues[1].textContent = stats.livre;
        statValues[2].textContent = stats.reservado;
        statValues[3].textContent = stats.ocupado;
        statValues[4].textContent = `${stats.taxaOcupacao}%`;
        statValues[5].textContent = stats.capacidadeTotal;
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Configurar busca em tempo real
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', searchRooms);
    }
    
    // Atualizar estatísticas iniciais
    updateStatistics();
    updateFilterCounters();
    
    // Adicionar efeitos de hover nos cards
    const roomCards = document.querySelectorAll('.room-card');
    roomCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    console.log('Página de quartos carregada com sucesso!');
    console.log('Dados dos quartos:', roomsData);
});

// Função para simular mudanças de status (para demonstração)
function simulateStatusChanges() {
    // Esta função pode ser usada para testar mudanças de status
    setTimeout(() => {
        updateRoomStatus(103, 'reservado');
    }, 5000);
    
    setTimeout(() => {
        updateRoomStatus(205, 'ocupado');
    }, 10000);
}

// Exportar funções para uso global
window.filterRooms = filterRooms;
window.openRoomDetails = openRoomDetails;
window.updateRoomStatus = updateRoomStatus;

// Para desenvolvimento/teste, descomente a linha abaixo:
// simulateStatusChanges();

