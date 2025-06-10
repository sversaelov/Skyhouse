 document.getElementById('feedbackForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Здесь можно добавить код для отправки данных на сервер
            // Например, с помощью fetch или XMLHttpRequest
            
            // Показываем сообщение об успешной отправке
            document.getElementById('successMessage').style.display = 'block';
            
            // Очищаем форму
            this.reset();
            
            // Скрываем сообщение через 5 секунд
            setTimeout(function() {
                document.getElementById('successMessage').style.display = 'none';
            }, 5000);
        });
        // JavaScript для работы с корзиной
        let cart = [];
        let selectedPaymentMethod = null;
        
        // Функция для обновления количества товаров в корзине
        function updateCartCount() {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            document.getElementById('cart-item-count').textContent = totalItems;
        }
        
        // Функция для обновления содержимого корзины в модальном окне
        function updateCartModal() {
            const container = document.getElementById('cart-items-container');
            const checkoutBtn = document.getElementById('checkout-btn');
            
            if (cart.length === 0) {
                container.innerHTML = '<p>Ваша корзина пуста.</p>';
                document.getElementById('cart-total-price').textContent = '0';
                checkoutBtn.style.display = 'none';
                document.getElementById('payment-methods').style.display = 'none';
                return;
            }
            
            let html = '';
            let totalPrice = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                totalPrice += itemTotal;
                
                html += `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-info">
                            <div class="cart-item-title">${item.name}</div>
                            <div>${item.quantity} × ${item.price} ₽</div>
                        </div>
                        <div class="cart-item-price">${itemTotal} ₽</div>
                        <div class="cart-item-remove" onclick="removeFromCart(${item.id})">&times;</div>
                    </div>
                `;
            });
            
            container.innerHTML = html;
            document.getElementById('cart-total-price').textContent = totalPrice;
            checkoutBtn.style.display = 'block';
            document.getElementById('payment-methods').style.display = 'none';
        }
        
        // Функция для добавления товара в корзину (для демонстрации)
        function addToCart(product) {
            const existingItem = cart.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    ...product,
                    quantity: 1
                });
            }
            
            updateCartCount();
            updateCartModal();
        }
        
        // Функция для удаления товара из корзины
        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            updateCartCount();
            updateCartModal();
        }
        
        // Функция показа методов оплаты
        function showPaymentMethods() {
            document.getElementById('payment-methods').style.display = 'block';
            document.getElementById('checkout-btn').style.display = 'none';
        }
        
        // Функция выбора метода оплаты
        function selectPaymentMethod(method) {
            selectedPaymentMethod = method;
            
            // Убираем выделение со всех методов
            document.querySelectorAll('.payment-option').forEach(option => {
                option.classList.remove('selected');
            });
            
            // Добавляем выделение выбранному методу
            document.querySelector(`.payment-option[data-method="${method}"]`).classList.add('selected');
            
            // Показываем соответствующую форму оплаты
            document.querySelectorAll('.payment-form').forEach(form => {
                form.classList.remove('active');
            });
            
            if (method === 'sbp') {
                document.getElementById('sbp-payment-form').classList.add('active');
            } else {
                document.getElementById('card-payment-form').classList.add('active');
            }
        }
        
        // Функция обработки платежа
        function processPayment() {
            // Валидация формы
            const cardNumber = document.getElementById('card-number').value;
            const cardName = document.getElementById('card-name').value;
            const cardExpiry = document.getElementById('card-expiry').value;
            const cardCvv = document.getElementById('card-cvv').value;
            
            if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
                alert('Пожалуйста, заполните все поля!');
                return;
            }
            
            // Имитация обработки платежа
            setTimeout(() => {
                showPaymentSuccess();
            }, 1500);
        }
        
        // Функция обработки платежа через СБП
        function processSBPPayment() {
            // Имитация обработки платежа
            setTimeout(() => {
                showPaymentSuccess();
            }, 1500);
        }
        
        // Функция показа сообщения об успешной оплате
        function showPaymentSuccess() {
            // Генерируем случайный номер заказа
            const orderNumber = Math.floor(10000 + Math.random() * 90000);
            document.getElementById('order-number').textContent = orderNumber;
            
            // Скрываем формы оплаты и показываем сообщение об успехе
            document.querySelectorAll('.payment-form').forEach(form => {
                form.classList.remove('active');
            });
            document.getElementById('payment-success').style.display = 'block';
            
            // Очищаем корзину
            cart = [];
            updateCartCount();
        }
         // Функция для обработки формы обратной связи
         function submitFeedbackForm(event) {
            event.preventDefault();
            
            // Получаем данные из формы
            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Здесь можно добавить код для отправки данных на сервер
            // Для демонстрации просто покажем сообщение об успехе
            
            // Показываем сообщение об успешной отправке
            document.getElementById('feedback-form').style.display = 'none';
            document.getElementById('form-success').style.display = 'block';
            
            // Прокручиваем страницу к сообщению об успехе
            document.getElementById('form-success').scrollIntoView({ behavior: 'smooth' });
        }
        
        // Функция для сброса формы обратной связи
        function resetFeedbackForm() {
            // Сбрасываем форму
            document.getElementById('feedback-form').reset();
            
            // Показываем форму и скрываем сообщение об успехе
            document.getElementById('feedback-form').style.display = 'block';
            document.getElementById('form-success').style.display = 'none';
            
            // Прокручиваем страницу к форме
            document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' });
        }
        
        // Для демонстрации - добавляем несколько товаров
        const demoProducts = [
            { id: 1, name: 'Холодильник BOSCH', price: 45990, image: 'images/bosh.jpg' },
            { id: 2, name: 'Стиральная машина LG', price: 32990, image: 'images/category_washing_machines.jpg' },
            { id: 3, name: 'Телевизор Samsung', price: 59990, image: 'images/category_televisions.jpg' }
        ];
        
        // Добавляем обработчик для демонстрации добавления товаров
        document.addEventListener('DOMContentLoaded', () => {
            // Можно добавить обработчики на кнопки "В корзину" в каталоге
            // Для демонстрации добавим 1 товар
            addToCart(demoProducts[0]);
        });

        // JavaScript для открытия и закрытия модальных окон
        var loginModal = document.getElementById("loginModal");
        var registerModal = document.getElementById("registerModal");
        var cartModal = document.getElementById("cartModal");

        function openLoginModal() {
            loginModal.style.display = "block";
        }

        function closeLoginModal() {
            loginModal.style.display = "none";
        }

        function openRegisterModal() {
            registerModal.style.display = "block";
        }

        function closeRegisterModal() {
            registerModal.style.display = "none";
        }

        function openCartModal() {
            cartModal.style.display = "block";
            updateCartModal();
        }

        function closeCartModal() {
            cartModal.style.display = "none";
            // Сбрасываем состояние оплаты при закрытии корзины
            document.getElementById('payment-success').style.display = 'none';
            document.querySelectorAll('.payment-option').forEach(option => {
                option.classList.remove('selected');
            });
            document.querySelectorAll('.payment-form').forEach(form => {
                form.classList.remove('active');
            });
            document.getElementById('payment-methods').style.display = 'none';
            document.getElementById('checkout-btn').style.display = 'block';
        }

        // Закрытие модального окна при клике вне его области
        window.onclick = function(event) {
            if (event.target == loginModal) {
                closeLoginModal();
            }
            if (event.target == registerModal) {
                closeRegisterModal();
            }
            if (event.target == cartModal) {
                closeCartModal();
            }
        }
        
        // Форматирование номера карты
        document.getElementById('card-number').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s+/g, '');
            if (value.length > 0) {
                value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
            }
            e.target.value = value;
        });
        
        // Форматирование срока действия карты
        document.getElementById('card-expiry').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
        // Получаем элементы модального окна
    const modal = document.getElementById("privacyModal");
    const btn = document.getElementById("privacyBtn");
    const span = document.getElementsByClassName("close")[0];
    
    // Открываем модальное окно при клике на кнопку
    btn.onclick = function() {
        modal.style.display = "block";
    }
    
    // Закрываем модальное окно при клике на крестик
    span.onclick = function() {
        modal.style.display = "none";
    }
    
    // Закрываем модальное окно при клике вне его области
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    
    // Закрываем модальное окно при нажатии Esc
    document.onkeydown = function(event) {
        if (event.key === "Escape") {
            modal.style.display = "none";
        }
    };
      // Элементы интерфейса
        const chatToggle = document.getElementById('chatToggle');
        const chatForm = document.getElementById('chatForm');
        const closeChat = document.getElementById('closeChat');
        const chatBody = document.getElementById('chatBody');
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        const fileBtn = document.getElementById('fileBtn');
        const fileInput = document.getElementById('fileInput');
        const typingIndicator = document.getElementById('typingIndicator');
        
        // Переменные состояния
        let isChatOpen = false;
        
        // Открытие/закрытие чата
        chatToggle.addEventListener('click', toggleChat);
        closeChat.addEventListener('click', toggleChat);
        
        function toggleChat() {
            isChatOpen = !isChatOpen;
            
            if (isChatOpen) {
                chatForm.classList.add('active');
                messageInput.focus();
            } else {
                chatForm.classList.remove('active');
            }
        }
        
        // Отправка сообщения при нажатии Enter
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        // Отправка сообщения при клике на кнопку
        sendBtn.addEventListener('click', sendMessage);
        
        // Открытие выбора файла
        fileBtn.addEventListener('click', () => {
            fileInput.click();
        });
        
        // Обработка выбора файла
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                sendImage(e.target.files[0]);
                e.target.value = '';
            }
        });
        
        // Функция отправки сообщения
        function sendMessage() {
            const messageText = messageInput.value.trim();
            if (messageText !== '') {
                addMessage(messageText, 'user');
                messageInput.value = '';
                
                // Имитация ответа оператора
                simulateOperatorResponse();
            }
        }
        
        // Функция отправки изображения
        function sendImage(file) {
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const messageDiv = document.createElement('div');
                    messageDiv.classList.add('message', 'user-message');
                    
                    const imgElement = document.createElement('img');
                    imgElement.src = e.target.result;
                    imgElement.classList.add('preview-image');
                    
                    const timeDiv = document.createElement('div');
                    timeDiv.classList.add('message-time');
                    timeDiv.textContent = getCurrentTime();
                    
                    messageDiv.appendChild(imgElement);
                    messageDiv.appendChild(timeDiv);
                    chatBody.appendChild(messageDiv);
                    
                    scrollToBottom();
                    
                    // Имитация ответа оператора
                    simulateOperatorResponse(true);
                };
                reader.readAsDataURL(file);
            }
        }
        
        // Имитация ответа оператора
        function simulateOperatorResponse(isImage = false) {
            setTimeout(() => {
                typingIndicator.style.display = 'block';
                scrollToBottom();
                
                setTimeout(() => {
                    typingIndicator.style.display = 'none';
                    
                    const responses = isImage ? [
                        "Спасибо за фото, я его рассмотрю.",
                        "Я получил ваше изображение, спасибо!",
                        "Благодарю за предоставленное фото."
                    ] : [
                        "Конечно, я вам помогу!",
                        "Пожалуйста, уточните ваш вопрос.",
                        "Сейчас посмотрю информацию по вашему заказу."
                    ];
                    
                    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                    addMessage(randomResponse, 'operator');
                }, 2000);
            }, 1000);
        }
        
        // Функция добавления сообщения
        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', sender + '-message');
            
            const messageText = document.createElement('div');
            messageText.textContent = text;
            
            const timeDiv = document.createElement('div');
            timeDiv.classList.add('message-time');
            timeDiv.textContent = getCurrentTime();
            
            messageDiv.appendChild(messageText);
            messageDiv.appendChild(timeDiv);
            chatBody.appendChild(messageDiv);
            
            scrollToBottom();
        }
        
        // Функция прокрутки вниз
        function scrollToBottom() {
            chatBody.scrollTop = chatBody.scrollHeight;
        }
        
        // Функция получения текущего времени
        function getCurrentTime() {
            const now = new Date();
            return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        }
        
        // Автоматическое открытие через 30 секунд
        setTimeout(() => {
            if (!isChatOpen) {
                toggleChat();
                addMessage("Здравствуйте! Нужна помощь с выбором товара?", 'operator');
            }
        }, 30000);
        // Кнопка "Наверх"
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    // Показываем/скрываем кнопку при прокрутке
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'flex';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
        
        // Если чат открыт, скрываем кнопку
        if (chatForm.classList.contains('active')) {
            scrollToTopBtn.style.display = 'none';
        }
    });

    // Функция прокрутки вверх
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Скрываем кнопку при открытии чата
    chatForm.addEventListener('click', function() {
        if (chatForm.classList.contains('active')) {
            scrollToTopBtn.style.display = 'none';
        } else if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'flex';
        }
    });
     // Исправленные функции для закрытия модальных окон
    function closeLoginModal() {
        document.getElementById("loginModal").style.display = "none";
    }

    function closeRegisterModal() {
        document.getElementById("registerModal").style.display = "none";
    }

    function closeCartModal() {
        document.getElementById("cartModal").style.display = "none";
        // Сбрасываем состояние оплаты при закрытии корзины
        document.getElementById('payment-success').style.display = 'none';
        document.querySelectorAll('.payment-option').forEach(option => {
            option.classList.remove('selected');
        });
        document.querySelectorAll('.payment-form').forEach(form => {
            form.classList.remove('active');
        });
        document.getElementById('payment-methods').style.display = 'none';
        document.getElementById('checkout-btn').style.display = 'block';
    }

    function closePrivacyModal() {
        document.getElementById("privacyModal").style.display = "none";
    }

    // Закрытие модального окна при клике вне его области
    window.onclick = function(event) {
        if (event.target == document.getElementById("loginModal")) {
            closeLoginModal();
        }
        if (event.target == document.getElementById("registerModal")) {
            closeRegisterModal();
        }
        if (event.target == document.getElementById("cartModal")) {
            closeCartModal();
        }
        if (event.target == document.getElementById("privacyModal")) {
            closePrivacyModal();
        }
    }
    
    // Закрытие модального окна при нажатии Esc
    document.onkeydown = function(event) {
        if (event.key === "Escape") {
            closeLoginModal();
            closeRegisterModal();
            closeCartModal();
            closePrivacyModal();
        }
    };
    // Функция для регистрации пользователя
async function registerUser(firstName, lastName, email, password) {
    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password
            }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Ошибка регистрации');
        }
        
        return data;
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        throw error;
    }
}

// Функция для авторизации пользователя
async function loginUser(email, password) {
    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Ошибка авторизации');
        }
        
        return data;
    } catch (error) {
        console.error('Ошибка авторизации:', error);
        throw error;
    }
}

// Обновление обработчиков модальных окон
document.getElementById('registerModal').querySelector('form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('name').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('password_confirm').value;
    
    if (password !== confirmPassword) {
        alert('Пароли не совпадают');
        return;
    }
    
    try {
        const result = await registerUser(firstName, lastName, email, password);
        alert('Регистрация прошла успешно!');
        closeRegisterModal();
        // Можно автоматически авторизовать пользователя
    } catch (error) {
        alert(error.message);
    }
});

document.getElementById('loginModal').querySelector('form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const result = await loginUser(email, password);
        alert('Авторизация прошла успешно!');
        closeLoginModal();
        // Обновляем интерфейс для авторизованного пользователя
        updateAuthUI(result.user);
    } catch (error) {
        alert(error.message);
    }
});

// Функция для обновления интерфейса после авторизации
function updateAuthUI(user) {
    const authSection = document.querySelector('.auth');
    authSection.innerHTML = `
        <span>Добро пожаловать, ${user.first_name}!</span>
        <a href="#" onclick="logout()">Выйти</a>
    `;
}

// Функция для выхода
function logout() {
    // Здесь можно добавить запрос на сервер для выхода
    const authSection = document.querySelector('.auth');
    authSection.innerHTML = `
        <a href="#" onclick="openLoginModal()">Вход</a>
        <a href="#" onclick="openRegisterModal()">Регистрация</a>
    `;
}

    // Функции для работы с модальным окном условий использования
    function openTermsModal() {
        document.getElementById("termsModal").style.display = "block";
    }
    
    function closeTermsModal() {
        document.getElementById("termsModal").style.display = "none";
    }
    
    // Обновляем обработчик ссылки в подвале
    document.querySelector('a[href="terms.html"]').onclick = function(e) {
        e.preventDefault();
        openTermsModal();
    };
    
    // Закрытие при клике вне окна
    window.onclick = function(event) {
        if (event.target == document.getElementById("termsModal")) {
            closeTermsModal();
        }
    };
// Обработчик для ссылки "Условия использования"
document.querySelector('a[href="terms.html"]').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('termsModal').style.display = 'block';
});

// Закрытие модального окна условий использования
document.querySelector('#termsModal .close').addEventListener('click', function() {
    document.getElementById('termsModal').style.display = 'none';
});
// Функция для выполнения поиска
function performSearch() {
    const searchInput = document.querySelector('.search input');
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm.length === 0) {
        alert('Пожалуйста, введите поисковый запрос');
        return;
    }
    
    // Здесь должен быть запрос к вашему API или фильтрация по существующим товарам
    // Для примера сделаем простую фильтрацию по категориям
    
    const categories = [
        { name: 'Холодильники', keywords: ['холодильник', 'рефрижератор', 'морозильник'] },
        { name: 'Стиральные машины', keywords: ['стиральная', 'машина', 'стирка'] },
        { name: 'Телевизоры', keywords: ['телевизор', 'тв', 'экран', 'smart tv'] },
        { name: 'Ноутбуки', keywords: ['ноутбук', 'лэптоп', 'компьютер'] }
    ];
    
 const results = categories
    .filter(category => {
        return (
            category.name.toLowerCase().includes(searchTerm) || 
            category.keywords.some(keyword => keyword.includes(searchTerm))
        );
    })
    .map(category => category.name);
    
    if (results.length > 0) {
        // Перенаправляем на страницу каталога с параметром поиска
        window.location.href = `catalog.html?search=${encodeURIComponent(searchTerm)}`;
    } else {
        alert('По вашему запросу ничего не найдено. Попробуйте изменить формулировку.');
    }
}

// Назначение обработчиков событий
document.addEventListener('DOMContentLoaded', function() {
    // Обработчик клика на кнопку поиска
    document.querySelector('.search button').addEventListener('click', performSearch);
    
    // Обработчик нажатия Enter в поле поиска
    document.querySelector('.search input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Обработчик для поиска на странице каталога
    if (window.location.pathname.includes('catalog.html')) {
        processSearchOnCatalog();
    }
});

// Функция для обработки поиска на странице каталога
function processSearchOnCatalog() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search');
    
    if (searchTerm) {
        // Здесь должна быть логика фильтрации товаров в каталоге
        console.log(`Выполняется поиск по запросу: ${searchTerm}`);
        
        // В реальном проекте здесь будет запрос к API или фильтрация товаров
        // Для примера просто выделим поисковый запрос
        document.querySelector('.search input').value = searchTerm;
        
        // Можно добавить отображение результатов поиска
        const searchResultsTitle = document.createElement('h2');
        searchResultsTitle.textContent = `Результаты поиска: "${searchTerm}"`;
        document.querySelector('main').prepend(searchResultsTitle);
    }
}
// Добавляем в script.js

// Данные для подсказок (можно получать с сервера)
const searchSuggestions = {
  groups: [
    { name: "Холодильники", url: "catalog.html?category=refrigerators" },
    { name: "Стиральные машины", url: "catalog.html?category=washing_machines" },
    { name: "Телевизоры", url: "catalog.html?category=televisions" },
    { name: "Ноутбуки", url: "catalog.html?category=laptops" }
  ],
  popular: [
    { name: "Холодильник Samsung", url: "product.html?id=123" },
    { name: "Стиральная машина LG", url: "product.html?id=456" }
  ]
};

// Создаем элемент для подсказок
const suggestionsDropdown = document.createElement('div');
suggestionsDropdown.className = 'search-suggestions';
document.querySelector('.search').appendChild(suggestionsDropdown);

// Функция показа подсказок
function showSearchSuggestions() {
  suggestionsDropdown.innerHTML = '';
  
  // Секция групп товаров
  const groupsSection = document.createElement('div');
  groupsSection.className = 'suggestions-section';
  groupsSection.innerHTML = '<h4>Группы товаров</h4>';
  
  searchSuggestions.groups.forEach(group => {
    const item = document.createElement('a');
    item.href = group.url;
    item.textContent = group.name;
    groupsSection.appendChild(item);
  });
  
  suggestionsDropdown.appendChild(groupsSection);
  
  // Секция популярных товаров
  const popularSection = document.createElement('div');
  popularSection.className = 'suggestions-section';
  popularSection.innerHTML = '<h4>Популярные товары</h4>';
  
  searchSuggestions.popular.forEach(product => {
    const item = document.createElement('a');
    item.href = product.url;
    item.textContent = product.name;
    popularSection.appendChild(item);
  });
  
  suggestionsDropdown.appendChild(popularSection);
  suggestionsDropdown.style.display = 'block';
}

// Обработчики событий
document.querySelector('.search input').addEventListener('mouseenter', showSearchSuggestions);
document.querySelector('.search').addEventListener('mouseleave', () => {
  suggestionsDropdown.style.display = 'none';
});

// Закрываем подсказки при клике вне области поиска
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search')) {
    suggestionsDropdown.style.display = 'none';
  }
});
// Функции для закрытия модальных окон
function closeLoginModal() {
    document.getElementById("loginModal").style.display = "none";
}

function closeRegisterModal() {
    document.getElementById("registerModal").style.display = "none";
}

function closeCartModal() {
    document.getElementById("cartModal").style.display = "none";
    // Сбрасываем состояние оплаты
    document.getElementById('payment-success').style.display = 'none';
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelectorAll('.payment-form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById('payment-methods').style.display = 'none';
    document.getElementById('checkout-btn').style.display = 'block';
}

function closePrivacyModal() {
    document.getElementById("privacyModal").style.display = "none";
}

function closeTermsModal() {
    document.getElementById("termsModal").style.display = "none";
}

// Назначаем обработчики клика на крестики
document.addEventListener('DOMContentLoaded', function() {
    // Логин
    document.querySelector('#loginModal .close').addEventListener('click', closeLoginModal);
    
    // Регистрация
    document.querySelector('#registerModal .close').addEventListener('click', closeRegisterModal);
    
    // Корзина
    document.querySelector('#cartModal .close').addEventListener('click', closeCartModal);
    
    // Политика конфиденциальности
    document.querySelector('#privacyModal .close').addEventListener('click', closePrivacyModal);
    
    // Условия использования
    document.querySelector('#termsModal .close').addEventListener('click', closeTermsModal);
});

// Закрытие при клике вне окна (оставляем по желанию)
window.onclick = function(event) {
    if (event.target == document.getElementById("loginModal")) {
        closeLoginModal();
    }
    if (event.target == document.getElementById("registerModal")) {
        closeRegisterModal();
    }
    if (event.target == document.getElementById("cartModal")) {
        closeCartModal();
    }
    if (event.target == document.getElementById("privacyModal")) {
        closePrivacyModal();
    }
    if (event.target == document.getElementById("termsModal")) {
        closeTermsModal();
    }
};