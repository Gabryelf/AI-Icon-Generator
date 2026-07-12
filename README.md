
<div align="center">
  <img src="https://img.shields.io/badge/version-3.0.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/status-active-brightgreen.svg" alt="Status">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome">
</div>

<br>

<div align="center">
  <h1>Neural Icon Forge</h1>
  <h3>Генератор иконок нового поколения</h3>
  <p><i>Создавайте уникальные иконки для любых целей — от игр до презентаций</i></p>
  
  <br>
  
  <img src="https://github.com/Gabryelf/AI-Icon-Generator/blob/main/docs/screens/2026-07-13_00-07-06.png" alt="Preview" width="800">
</div>

---

## ✨ Особенности

### 🎯 5 доменов применения
- **Игры** — Игровые иконки, кнопки, аватары, эмблемы
- **Брендинг** — Логотипы, эмблемы, фирменные знаки
- **Веб & UI** — Иконки интерфейса, кнопки, элементы
- **Соцсети** — Аватары, обложки, стикеры
- **Презентации** — Инфографика, диаграммы, наборы иконок

### 🎨 18+ стилей
`Минимализм` • `Яркий` • `Неон` • `Винтаж` • `Геометрический` • `Органический` • `Пиксельный` • `Фэнтези` • `Люкс` • `Flat` • `Градиент` • `Material` • `Пастель` • `Мультяшный` • `Киберпанк` • `Стимпанк` • `Акварель` • `Low Poly`

### 🛠 Расширенные настройки
- 📐 **Форма** — Круг, квадрат, шестиугольник, щит, ромб
- 🎨 **Цвет** — Полный контроль над палитрой
- 📏 **Размер** — От 16 до 200 пикселей
- 🌟 **Свечение** — Эффект неона
- 📊 **Детализация** — От 1 до 10 уровней
- 🖼 **Фон** — Прозрачный, цветной, градиент

### 💾 Экспорт
- 🖼 **PNG** — Высокое качество (512x512)
- 📐 **SVG** — Векторный формат
- 📋 **Копирование** — SVG код в буфер обмена

---

## 📸 Скриншоты

<details>
<summary>🖥 Интерфейс</summary>
<br>

**Дашборд**
![Dashboard](https://github.com/Gabryelf/AI-Icon-Generator/blob/main/docs/screens/2026-07-13_00-10-48.png)

**Генератор**
![Generator](https://github.com/Gabryelf/AI-Icon-Generator/blob/main/docs/screens/2026-07-13_00-09-24.png)

**История**
![Dashboard](https://github.com/Gabryelf/AI-Icon-Generator/blob/main/docs/screens/2026-07-13_00-09-55.png)


**Настройки**
![Settings](https://github.com/Gabryelf/AI-Icon-Generator/blob/main/docs/screens/2026-07-13_00-10-23.png)
</details>

<details>
<summary>🎨 Примеры иконок</summary>
<br>

**Игровые иконки**
![Game Icons](https://github.com/Gabryelf/AI-Icon-Generator/blob/main/docs/screens/2026-07-13_00-07-06.png)

**UI элементы**
![UI Elements](https://github.com/Gabryelf/AI-Icon-Generator/blob/main/docs/screens/2026-07-13_00-12-35.png)
</details>

---

## 🧩 Архитектура

```
┌─────────────────────────────────────────────────────┐
│                    app.js                           │
│              (Роутер + Инициализация)               │
└─────────────────────┬───────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
┌───────────┐ ┌───────────┐ ┌─────────────┐
│UIManager  │ │Generator  │ │ Storage     │
│ Рендеринг │ │ Генерация │ │ Хранение    │
│ DOM       │ │ Отрисовка │ │ LocalStorage│
└───────────┘ └─────┬─────┘ └─────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
┌─────────────┐ ┌──────────────┐ ┌─────────────┐
│ShapeLibrary │ │  ColorPalette│ │ TextureGen. │
│ Фигуры      │ │   Палитры    │ │  Текстуры   │
└─────────────┘ └──────────────┘ └─────────────┘
```

---

## 📦 Установка

### Требования
- Современный браузер (Chrome 90+, Firefox 88+, Safari 14+)
- Поддержка ES Modules
- Включенный JavaScript

### Файлы
```
neural-icon-forge/
├── index.html          # Главная страница
├── style.css           # Стили
├── app.js              # Главный скрипт
├── modules/            # Модули
│   ├── UIManager.js
│   ├── Generator.js
│   ├── Storage.js
│   ├── presets.js
│   ├── ShapeLibrary.js
│   ├── ColorPalette.js
│   ├── TextureGenerator.js
│   └── IconComposer.js
├── assets/             # Ресурсы (CSV)
│   ├── shapes/
│   ├── textures/
│   └── masks/
└── docs/               # Документация
    ├── PROJECT_SPEC.md
    └── README.md
```

---

## 🛠 Разработка

### Добавление новых фигур
1. Отредактируйте CSV файлы в `assets/shapes/`
2. Используйте формат:
```csv
name,type,path,defaultColor,tags
my_shape,basic,"M0,-1 L1,0 L0,1 L-1,0 Z",#ff0000,custom,game
```

### Добавление нового стиля
1. Добавьте стиль в `presets.js` в объект `STYLES`
2. Определите цветовую палитру в `ColorPalette.js`
3. Добавьте иконку стиля в Font Awesome

### Добавление новой категории
1. Добавьте категорию в `presets.js` в объект `CATEGORIES`
2. Определите конфигурацию параметров
3. Добавьте логику генерации в `IconComposer.js`

---

## 🤝 Вклад в проект

### Как помочь
1. 🐛 **Сообщить об ошибке** — Создайте Issue
2. 💡 **Предложить идею** — Создайте Issue с тегом `enhancement`
3. 🔧 **Исправить ошибку** — Создайте Pull Request
4. 📚 **Улучшить документацию** — PR с изменениями в docs/

### Контрибьюторы
<table>
  <tr>
    <td align="center">
      <a href="#">
        <img src="https://avatars.githubusercontent.com/u/145398532?s=400&u=90b090f37bf67b725f0dbddf1381b92062b17e6c&v=4" width="100px;" alt=""/>
        <br />
        <sub><b>Valeev Serj - @Gabryelf</b></sub>
      </a>
    </td>
  </tr>
</table>

---

## 🌟 Поддержка

Если проект вам полезен:
- ⭐ Поставьте звезду на GitHub
- 🐦 Расскажите о проекте в соцсетях
- 💬 Поделитесь своим опытом использования

---

<div align="center">
  <br>
  <p>Делаем генерацию расширяемой и удобной</p>
  <p>
    <a href="https://github.com/Gabryelf/AI-Icon-Generator/issues">Сообщить об ошибке</a> •
    <a href="https://github.com/Gabryelf/AI-Icon-Generator/discussions">Обсуждение</a> •
    <a href="PROJECT_SPEC.md">Документация</a>
  </p>
  <br>
</div>
