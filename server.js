require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Настройка подключения к PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'skyhouse_store',
    password: process.env.DB_PASSWORD || 'yourpassword',
    port: process.env.DB_PORT || 5432,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Проверка соединения с базой данных
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Connected to PostgreSQL database');
    release();
});

// Регистрация пользователя
app.post('/api/register', async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    
    try {
        // Проверяем, существует ли пользователь с таким email
        const userExists = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
        }
        
        // Хешируем пароль
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        
        // Создаем нового пользователя
        const newUser = await pool.query(
            'INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *',
            [first_name, last_name, email, passwordHash]
        );
        
        res.status(201).json({
            message: 'Пользователь успешно зарегистрирован',
            user: {
                id: newUser.rows[0].id,
                first_name: newUser.rows[0].first_name,
                last_name: newUser.rows[0].last_name,
                email: newUser.rows[0].email
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Авторизация пользователя
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Ищем пользователя по email
        const user = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        
        if (user.rows.length === 0) {
            return res.status(400).json({ error: 'Неверный email или пароль' });
        }
        
        // Проверяем пароль
        const isMatch = await bcrypt.compare(password, user.rows[0].password_hash);
        
        if (!isMatch) {
            return res.status(400).json({ error: 'Неверный email или пароль' });
        }
        
        res.json({
            message: 'Авторизация успешна',
            user: {
                id: user.rows[0].id,
                first_name: user.rows[0].first_name,
                last_name: user.rows[0].last_name,
                email: user.rows[0].email
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
// Проверка подключения к базе данных
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Успешное подключение к PostgreSQL');
    
    // Проверим версию PostgreSQL
    const res = await client.query('SELECT version()');
    console.log('Версия PostgreSQL:', res.rows[0].version);
    
    // Проверим список таблиц
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Таблицы в базе:', tables.rows.map(row => row.table_name));
    
    client.release();
  } catch (err) {
    console.error('Ошибка подключения к PostgreSQL:', err);
  }
}

// Вызываем функцию проверки при старте сервера
testConnection();
// Маршрут для проверки подключения к БД
app.get('/api/check-db', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT 1+1 AS result');
    client.release();
    
    res.json({
      status: 'success',
      message: 'Подключение к PostgreSQL работает',
      testResult: result.rows[0].result
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Ошибка подключения к PostgreSQL',
      error: err.message
    });
  }
});
pool.on('connect', () => {
  console.log('Новое подключение к БД установлено');
});

pool.on('error', (err) => {
  console.error('Ошибка в пуле подключений:', err);
});
app.get('/api/test-users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users LIMIT 5');
    res.json({
      status: 'success',
      count: result.rowCount,
      users: result.rows
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});