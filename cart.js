let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
 
    document.addEventListener('DOMContentLoaded', function() {
        updateCartCount();
    });
    
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartItemCount = document.getElementById('cart-item-count');
        if (cartItemCount) {
            cartItemCount.textContent = totalItems;
        }
    }
    
  // Функция обработки оплаты
function processPayment() {
    // Скрываем формы оплаты и показываем сообщение об успехе
    document.getElementById('payment-methods').style.display = 'none';
    document.getElementById('payment-success').style.display = 'block';
    
    // Генерация случайного номера заказа
    document.getElementById('order-number').textContent = Math.floor(10000 + Math.random() * 90000);
    
    // Очищаем корзину после оплаты
    cart = [];
    updateCart();
}
    function renderCartItems() {
        const cartContainer = document.getElementById('cart-items-container');
        const checkoutBtn = document.getElementById('checkout-btn');
        const paymentMethods = document.getElementById('payment-methods');
        const cartTotal = document.getElementById('cart-total-price');
        
        if (cart.length === 0) {
            cartContainer.innerHTML = '<p>Ваша корзина пуста.</p>';
            checkoutBtn.style.display = 'none';
            paymentMethods.style.display = 'none';
            cartTotal.textContent = '0';
            return;
        }
        
        let cartHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            total += item.price * item.quantity;
            
            cartHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='images/no-image.jpg'">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">${item.price.toLocaleString()} ₽ × ${item.quantity}</div>
                    </div>
                    <div class="cart-item-actions">
                        <button onclick="changeCartItemQuantity('${item.id}', -1)">−</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeCartItemQuantity('${item.id}', 1)">+</button>
                        <button class="remove-btn" onclick="removeFromCart('${item.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        cartContainer.innerHTML = cartHTML;
        cartTotal.textContent = total.toLocaleString();
        checkoutBtn.style.display = 'block';
        paymentMethods.style.display = 'none';
    }
    

    function changeCartItemQuantity(productId, change) {
        const item = cart.find(item => item.id === productId);
        if (!item) return;
        
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
    
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
        showToast('Товар удален из корзины');
    }
    
    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
    }
    
   
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
   // Функция для обновления корзины
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Если корзина открыта - обновляем ее содержимое
    if (document.getElementById('cartModal') && document.getElementById('cartModal').style.display === 'block') {
        renderCartItems();
    }
}

// Функция для обновления счетчика товаров в корзине
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartItemCount = document.getElementById('cart-item-count');
    if (cartItemCount) {
        cartItemCount.textContent = totalItems;
    }
}

// При загрузке страницы инициализируем корзину
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем корзину из localStorage
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();
    
    // Остальной код инициализации...
}); 

