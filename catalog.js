// Конфигурация Google Sheets
const SPREADSHEET_ID = '1wUYcwESk90A8HcYUuQgoCkWhD4UJZqaz30m5IuT9s2Q';
const API_KEY = 'AIzaSyBVFva3YsJb2Q5rVK8nQ-vub1pscVW7bDA';
const SHEET_NAME = 'catalog';

// Глобальные переменные
let allProducts = [];
let filteredProducts = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentPage = 1;
const productsPerPage = 12;
let currentView = 'grid';

// DOM элементы
const productsContainer = document.getElementById('products-container');
const paginationContainer = document.getElementById('pagination');
const cartItemCount = document.getElementById('cart-item-count');

// Инициализация каталога
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadProductsFromGoogleSheets();
    initFilters();
    applyFilters();
    updateCartCount();
    
    // Обработчики событий
    document.getElementById('in-stock').addEventListener('change', applyFilters);
    document.getElementById('min-price').addEventListener('change', applyFilters);
    document.getElementById('max-price').addEventListener('change', applyFilters);
    
  } catch (error) {
    console.error('Ошибка инициализации:', error);
    showError('Не удалось загрузить товары. Пожалуйста, попробуйте позже.');
  }
});

// Загрузка данных из Google Sheets
async function loadProductsFromGoogleSheets() {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
    console.log('Запрос к API:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Данные получены:', data);
    
    if (!data.values || data.values.length < 2) {
      throw new Error('Таблица пуста или содержит только заголовки');
    }
    
    // Преобразование данных из таблицы в массив объектов
    const headers = data.values[0].map(h => h.toLowerCase());
    allProducts = data.values.slice(1).map((row, index) => {
      const product = {};
      headers.forEach((header, i) => {
        product[header] = row[i];
      });
      
      // Преобразование типов данных
      product.price = parseFloat(product.price) || 0;
      product.rating = parseFloat(product.rating) || 0;
      product.reviews = parseInt(product.reviews) || 0;
      product.instock = product.instock === 'true' || product.instock === '1';
      
      // Добавляем id, если его нет
      product.id = product.id || `prod_${index}`;
      
      // Обработка изображений (если URL начинается с "images/", добавляем базовый URL)
      if (product.image && product.image.startsWith('images/')) {
        product.image = `https://yourdomain.com/${product.image}`;
      }
      
      return product;
    });
    
    console.log('Обработанные товары:', allProducts);
    
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    throw error;
  }
}

// Альтернативный вариант с использованием Google Apps Script (если CORS блокирует прямой доступ)

/*
1. Создайте скрипт в Google Sheets: Расширения -> Apps Script
2. Вставьте следующий код:

function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('catalog');
  const data = sheet.getDataRange().getValues();
  
  const headers = data[0];
  const products = data.slice(1).map((row, index) => {
    const product = {};
    headers.forEach((header, i) => {
      product[header] = row[i];
    });
    product.id = product.id || `prod_${index}`;
    return product;
  });
  
  return ContentService.createTextOutput(JSON.stringify(products))
    .setMimeType(ContentService.MimeType.JSON);
}

3. Опубликуйте как веб-приложение (разрешения: "выполнять от имени меня", доступ: "всем")
4. Используйте URL веб-приложения в коде ниже:
*/

async function loadProductsFromGoogleAppsScript() {
  try {
    const WEB_APP_URL = 'ВАШ_URL_ВЕБ_ПРИЛОЖЕНИЯ';
    const response = await fetch(WEB_APP_URL);
    
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    
    allProducts = await response.json();
    console.log('Товары загружены:', allProducts);
    
  } catch (error) {
    console.error('Ошибка загрузки:', error);
    throw error;
  }
}

// Показать ошибку
function showError(message) {
  productsContainer.innerHTML = `
    <div class="error">
      <p>${message}</p>
    </div>
  `;
}

// Инициализация фильтров
function initFilters() {
  // Категории
  const categories = [...new Set(allProducts.map(p => p.category))];
  const categoryFilters = document.getElementById('category-filters');
  categoryFilters.innerHTML = '';
  
  categories.forEach(category => {
    if (!category) return;
    
    const label = document.createElement('label');
    label.innerHTML = `
      <input type="checkbox" name="category" value="${category}" checked>
      ${category}
    `;
    categoryFilters.appendChild(label);
  });
  
  // Бренды
  const brands = [...new Set(allProducts.map(p => p.brand))];
  const brandFilters = document.getElementById('brand-filters');
  brandFilters.innerHTML = '';
  
  brands.forEach(brand => {
    if (!brand) return;
    
    const label = document.createElement('label');
    label.innerHTML = `
      <input type="checkbox" name="brand" value="${brand}" checked>
      ${brand}
    `;
    brandFilters.appendChild(label);
  });
  
  updateRatingCounts();
}

// Обновление счетчиков рейтинга
function updateRatingCounts() {
    const rating5Count = allProducts.filter(p => p.rating >= 4.75).length;
    const rating4Count = allProducts.filter(p => p.rating >= 3.75).length;
    const rating3Count = allProducts.filter(p => p.rating >= 2.75).length;
    
    document.getElementById('rating-5-count').textContent = `(${rating5Count})`;
    document.getElementById('rating-4-count').textContent = `(${rating4Count})`;
    document.getElementById('rating-3-count').textContent = `(${rating3Count})`;
}

// Применение фильтров
function applyFilters() {
    // Получаем выбранные категории
    const selectedCategories = Array.from(document.querySelectorAll('#category-filters input:checked')).map(el => el.value);
    
    // Получаем выбранные бренды
    const selectedBrands = Array.from(document.querySelectorAll('#brand-filters input:checked')).map(el => el.value);
    
    // Получаем диапазон цен
    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;
    
    // Фильтр по наличию
    const inStockOnly = document.getElementById('in-stock').checked;
    
    // Фильтрация товаров
    filteredProducts = allProducts.filter(product => {
        // Фильтр по категории
        if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
            return false;
        }
        
        // Фильтр по бренду
        if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
            return false;
        }
        
        // Фильтр по цене
        if (product.price < minPrice || product.price > maxPrice) {
            return false;
        }
        
        // Фильтр по наличию
        if (inStockOnly && !product.instock) {
            return false;
        }
        
        return true;
    });
    
    // Сброс пагинации
    currentPage = 1;
    
    // Сортировка и отображение товаров
    sortProducts();
}

// Фильтрация по рейтингу
function filterByRating(minRating) {
    filteredProducts = allProducts.filter(product => product.rating >= minRating);
    currentPage = 1;
    renderProducts();
    renderPagination();
}

// Сброс всех фильтров
function resetFilters() {
    // Сброс чекбоксов
    document.querySelectorAll('#category-filters input, #brand-filters input').forEach(checkbox => {
        checkbox.checked = true;
    });
    
    // Сброс цен
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';
    
    // Сброс наличия
    document.getElementById('in-stock').checked = true;
    
    // Сброс сортировки
    document.getElementById('sort-by').value = 'default';
    
    // Применение фильтров
    applyFilters();
}

// Сортировка товаров
function sortProducts() {
    const sortBy = document.getElementById('sort-by').value;
    
    switch (sortBy) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'popular':
            filteredProducts.sort((a, b) => b.reviews - a.reviews);
            break;
        default:
            // Сортировка по умолчанию (как в таблице)
            break;
    }
    
    renderProducts();
    renderPagination();
}

// Отображение товаров
function renderProducts() {
    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = '<p class="no-results">Товары не найдены. Попробуйте изменить параметры фильтрации.</p>';
        paginationContainer.innerHTML = '';
        return;
    }
    
    // Определяем товары для текущей страницы
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    // Очищаем контейнер
    productsContainer.innerHTML = '';
    
    // Добавляем класс для вида отображения
    productsContainer.classList.remove('grid-view', 'list-view');
    productsContainer.classList.add(`${currentView}-view`);
    
    // Создаем карточки товаров
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = `product-card ${currentView}-view`;
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image || 'images/no-image.jpg'}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-brand">${product.brand}</p>
                <div class="product-rating">
                    <div class="stars">${getStarRating(product.rating)}</div>
                    <span class="count">(${product.reviews})</span>
                </div>
                <p class="product-price">${formatPrice(product.price)} ₽</p>
                <p class="product-availability ${product.instock ? 'in-stock' : 'out-of-stock'}">
                    ${product.instock ? 'В наличии' : 'Нет в наличии'}
                </p>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="addToCart(${product.id})" ${!product.instock ? 'disabled' : ''}>
                        ${!product.instock ? 'Нет в наличии' : 'В корзину'}
                    </button>
                    <button class="wishlist-btn" onclick="addToWishlist(${product.id})">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
        productsContainer.appendChild(productCard);
    });
}

// Получение звездного рейтинга
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
}

// Форматирование цены
function formatPrice(price) {
    return price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ');
}

// Отображение пагинации
function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Кнопка "Назад"
    if (currentPage > 1) {
        paginationHTML += `<button onclick="goToPage(${currentPage - 1})">&laquo; Назад</button>`;
    }
    
    // Страницы
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<button class="active">${i}</button>`;
        } else {
            paginationHTML += `<button onclick="goToPage(${i})">${i}</button>`;
        }
    }
    
    // Кнопка "Вперед"
    if (currentPage < totalPages) {
        paginationHTML += `<button onclick="goToPage(${currentPage + 1})">Вперед &raquo;</button>`;
    }
    
    paginationContainer.innerHTML = paginationHTML;
}

// Переход на страницу
function goToPage(page) {
    currentPage = page;
    renderProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Изменение вида отображения
function changeView(view) {
    currentView = view;
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.includes(view === 'grid' ? '☰' : '≡'));
    });
    renderProducts();
}

// Добавление в корзину
function addToCart(productId) {
    const product = allProducts.find(p => p.id == productId);
    
    if (!product) return;
    
    const existingItem = cart.find(item => item.id == productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // Сохраняем корзину в localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Обновляем счетчик корзины
    updateCartCount();
    
    // Показываем уведомление
    showNotification(`Товар "${product.name}" добавлен в корзину`);
}

// Обновление счетчика корзины
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartItemCount.textContent = totalItems;
}

// Показ уведомления
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Добавление в избранное
function addToWishlist(productId) {
    // Реализация добавления в избранное
    showNotification('Товар добавлен в избранное');
}
const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./skyhouse-462716-d55dd6fc3401.json'); // Ваш JSON-ключ

async function getSheetData() {
  const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  return rows;
}
async function loadProductsFromAPI() {
  try {
    const response = await fetch('http://localhost:3001/api/products');
    if (!response.ok) throw new Error('Network response was not ok');
    
    allProducts = await response.json();
    console.log('Products loaded:', allProducts);
  } catch (error) {
    console.error('Error loading products:', error);
    throw error;
  }
}