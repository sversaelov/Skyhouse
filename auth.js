// Конфигурация Google Sheets для пользователей
const USERS_SPREADSHEET_ID = '1wUYcwESk90A8HcYUuQgoCkWhD4UJZqaz30m5IuT9s2Q'; 
const USERS_SHEET_NAME = 'users';
const USERS_API_KEY = 'AIzaSyBVFva3YsJb2Q5rVK8nQ-vub1pscVW7bDA'; 

// Текущий пользователь
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    updateAuthUI();
});

// Обновление интерфейса в зависимости от статуса авторизации
function updateAuthUI() {
    const authContainer = document.querySelector('.auth');
    
    if (currentUser) {
        authContainer.innerHTML = `
            <span class="user-greeting">Привет, ${currentUser.firstName}!</span>
            <a href="#" onclick="logout()">Выйти</a>
        `;
    } else {
        authContainer.innerHTML = `
            <a href="#" onclick="openLoginModal()">Вход</a>
            <a href="#" onclick="openRegisterModal()">Регистрация</a>
        `;
    }
}

// Функция для хэширования пароля (упрощенная версия)
function hashPassword(password) {
    return btoa(encodeURIComponent(password)); 
}

// Регистрация нового пользователя
async function registerUser(email, password, firstName, lastName) {
    try {
        // Проверяем, существует ли уже пользователь с таким email
        const users = await getUsers();
        const userExists = users.some(user => user.email === email);
        
        if (userExists) {
            throw new Error('Пользователь с таким email уже существует');
        }
        
        // Хэшируем пароль
        const hashedPassword = hashPassword(password);
        
        // Добавляем нового пользователя в таблицу
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${USERS_SPREADSHEET_ID}/values/${USERS_SHEET_NAME}!A:E:append?valueInputOption=RAW`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${USERS_API_KEY}`
            },
            body: JSON.stringify({
                values: [[email, hashedPassword, firstName, lastName, new Date().toISOString()]]
            })
        });
        
        if (!response.ok) {
            throw new Error('Ошибка при регистрации');
        }
        
        // Авторизуем пользователя после успешной регистрации
        currentUser = { email, firstName, lastName };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateAuthUI();
        closeRegisterModal();
        showToast('Регистрация прошла успешно!');
        
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        showToast(error.message || 'Ошибка при регистрации');
    }
}

// Авторизация пользователя
async function loginUser(email, password) {
    try {
        const users = await getUsers();
        const hashedPassword = hashPassword(password);
        
        const user = users.find(u => u.email === email && u.password === hashedPassword);
        
        if (user) {
            currentUser = {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateAuthUI();
            closeLoginModal();
            showToast('Вход выполнен успешно!');
        } else {
            throw new Error('Неверный email или пароль');
        }
    } catch (error) {
        console.error('Ошибка входа:', error);
        showToast(error.message || 'Ошибка при входе');
    }
}

// Выход пользователя
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    showToast('Вы успешно вышли');
}

// Получение списка пользователей из Google Sheets
async function getUsers() {
    try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${USERS_SPREADSHEET_ID}/values/${USERS_SHEET_NAME}?key=${USERS_API_KEY}`);
        
        if (!response.ok) {
            throw new Error('Ошибка загрузки пользователей');
        }
        
        const data = await response.json();
        
        if (!data.values || data.values.length < 2) {
            return [];
        }
        
        const headers = data.values[0];
        return data.values.slice(1).map(row => {
            const user = {};
            headers.forEach((header, i) => {
                user[header.toLowerCase()] = row[i];
            });
            return user;
        });
        
    } catch (error) {
        console.error('Ошибка получения пользователей:', error);
        return [];
    }
}

// Модальное окно входа
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

// Модальное окно регистрации
function openRegisterModal() {
    document.getElementById('registerModal').style.display = 'block';
}

function closeRegisterModal() {
    document.getElementById('registerModal').style.display = 'none';
}

// Обработка формы входа
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    loginUser(email, password);
});

// Обработка формы регистрации
document.getElementById('registerForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const passwordConfirm = document.getElementById('reg-password-confirm').value;
    const firstName = document.getElementById('reg-firstName').value;
    const lastName = document.getElementById('reg-lastName').value;
    
    if (password !== passwordConfirm) {
        showToast('Пароли не совпадают');
        return;
    }
    
    registerUser(email, password, firstName, lastName);
});

// Вспомогательная функция для показа уведомлений
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