const screens = [...document.querySelectorAll('.screen')];
const navItems = [...document.querySelectorAll('.nav-item')];
const destinationInput = document.querySelector('#destination-input');
const modalBackdrop = document.querySelector('#modal-backdrop');
const modalContent = document.querySelector('#modal-content');
const toast = document.querySelector('#toast');

let currentDestination = 'Ikeja City Mall';
let currentAddress = 'Obafemi Awolowo Way, Alausa, Ikeja';
let selectedRide = 'UberX';
let selectedPrice = 'NGN 9.100,00';
let toastTimer;

function showScreen(id) {
  screens.forEach((screen) => screen.classList.toggle('active', screen.id === `${id}-screen`));
  navItems.forEach((item) => item.classList.toggle('active', item.dataset.nav.toLowerCase() === id));
  if (id === 'home') navItems.forEach((item) => item.classList.toggle('active', item.dataset.nav === 'Home'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

function openModal(content) {
  modalContent.innerHTML = content;
  modalBackdrop.classList.add('open');
  modalBackdrop.setAttribute('aria-hidden', 'false');
  document.querySelector('#modal-close').focus();
}

function closeModal() {
  modalBackdrop.classList.remove('open');
  modalBackdrop.setAttribute('aria-hidden', 'true');
}

function setDestination(name, address = '') {
  currentDestination = name;
  currentAddress = address || (name === 'Ikeja City Mall' ? 'Obafemi Awolowo Way, Alausa, Ikeja' : 'Lagos, Nigeria');
  document.querySelector('#ride-destination').textContent = currentDestination;
  document.querySelector('#route-end').textContent = currentDestination;
  document.querySelector('#destination-input').value = currentDestination;
  document.querySelector('#confirm-ride').textContent = `Confirmar ${selectedRide}`;
  showScreen('rides');
}

document.querySelector('#open-search').addEventListener('click', (event) => {
  if (event.target.closest('#time-button')) return;
  showScreen('search');
  setTimeout(() => destinationInput.focus(), 80);
});
document.querySelector('#open-search').addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    showScreen('search');
    setTimeout(() => destinationInput.focus(), 80);
  }
});

document.querySelectorAll('[data-back]').forEach((button) => button.addEventListener('click', () => showScreen('home')));
document.querySelectorAll('.place-row, .destination-row').forEach((button) => {
  button.addEventListener('click', () => setDestination(button.dataset.destination, button.dataset.address));
});
document.querySelectorAll('.suggestion-card').forEach((button) => {
  button.addEventListener('click', () => setDestination(button.dataset.destination));
});
document.querySelector('#search-continue').addEventListener('click', () => {
  const typed = destinationInput.value.trim();
  if (!typed) {
    destinationInput.focus();
    showToast('Digite um destino para continuar');
    return;
  }
  setDestination(typed);
});
document.querySelector('#clear-destination').addEventListener('click', () => {
  destinationInput.value = '';
  destinationInput.focus();
});
document.querySelector('#edit-trip').addEventListener('click', () => showScreen('search'));
document.querySelector('#edit-pickup').addEventListener('click', () => {
  openModal(`<h2>Escolha o local de embarque</h2><p>Defina o ponto exato para buscar você.</p><label class="destination-field"><span class="field-dot"></span><input id="pickup-input" value="No 36 Balarabe Musa Cres" /></label><button class="primary-button" id="save-pickup">Confirmar embarque</button>`);
  document.querySelector('#save-pickup').addEventListener('click', () => {
    closeModal();
    showToast('Local de embarque atualizado');
  });
});

document.querySelectorAll('.ride-option').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.ride-option').forEach((option) => option.classList.remove('selected'));
    button.classList.add('selected');
    selectedRide = button.dataset.ride;
    selectedPrice = button.dataset.price;
    document.querySelector('#confirm-ride').textContent = `Confirmar ${selectedRide}`;
  });
});

document.querySelector('#time-button').addEventListener('click', (event) => {
  event.stopPropagation();
  openModal(`<h2>Agende uma corrida</h2><p>Escolha quando você quer sair.</p><button class="modal-choice" data-time="Agora"><span>Agora</span><span>O mais rápido possível</span></button><button class="modal-choice" data-time="Hoje · 10:00"><span>Hoje · 10:00</span><span>Definir horário de embarque</span></button><button class="modal-choice" data-time="Amanhã · 9:00"><span>Amanhã · 9:00</span><span>Planejar com antecedência</span></button>`);
  document.querySelectorAll('[data-time]').forEach((choice) => choice.addEventListener('click', () => {
    document.querySelector('#time-label').textContent = choice.dataset.time === 'Agora' ? 'Agora' : choice.dataset.time.split(' · ')[0];
    closeModal();
    showToast(choice.dataset.time === 'Agora' ? 'Corrida solicitada para agora' : `Embarque: ${choice.dataset.time}`);
  }));
});

document.querySelector('#payment-button').addEventListener('click', () => {
  openModal(`<h2>Forma de pagamento</h2><button class="modal-choice" data-payment="Dinheiro"><span>▣　Dinheiro</span><span>✓</span></button><button class="modal-choice" data-payment="Cartão"><span>▰　Adicionar forma de pagamento</span><span>›</span></button>`);
  document.querySelectorAll('[data-payment]').forEach((choice) => choice.addEventListener('click', () => {
    document.querySelector('#payment-button span:nth-child(2)').textContent = choice.dataset.payment;
    closeModal();
    showToast(`${choice.dataset.payment} selecionado`);
  }));
});

document.querySelector('#confirm-ride').addEventListener('click', () => {
  openModal(`<img class="confirmation-art" src="assets/car-clock.png" alt="Carro a caminho" /><h2 id="modal-title">Sua corrida está confirmada</h2><p>Seu ${selectedRide} está a caminho. Encontre o motorista no local de embarque.</p><div class="confirmation-meta"><span>${currentDestination}</span><strong>${selectedPrice}</strong></div><button class="primary-button" id="view-trips">Ver viagens</button>`);
  document.querySelector('#view-trips').addEventListener('click', () => {
    closeModal();
    showScreen('activity');
    showToast('Corrida adicionada ao seu histórico');
  });
});

document.querySelectorAll('[data-nav]').forEach((button) => {
  button.addEventListener('click', () => {
    const route = button.dataset.nav;
    if (route === 'Services') {
      showScreen('home');
      showToast('Escolha um serviço para começar');
    } else showScreen(route.toLowerCase());
  });
});
document.querySelector('#see-services').addEventListener('click', () => showToast('Escolha Corrida, Entrega ou Por hora'));
document.querySelector('#switch-rider').addEventListener('click', () => showToast('Você está solicitando para si'));
document.querySelector('#add-place').addEventListener('click', () => showToast('Adicione um local salvo pela sua conta'));
document.querySelector('#menu-button').addEventListener('click', () => {
  openModal(`<h2>Menu</h2><button class="modal-choice" data-menu="Activity"><span>Minhas viagens</span><span>›</span></button><button class="modal-choice" data-menu="Account"><span>Conta</span><span>›</span></button><button class="modal-choice" data-menu="Services"><span>Serviços</span><span>›</span></button>`);
  document.querySelectorAll('[data-menu]').forEach((item) => item.addEventListener('click', () => {
    const page = item.dataset.menu;
    closeModal();
    if (page === 'Services') showScreen('home'); else showScreen(page.toLowerCase());
  }));
});
document.querySelector('#modal-close').addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', (event) => {
  if (event.target === modalBackdrop) closeModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});
