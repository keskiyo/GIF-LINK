# GIPHY-like GIF Search SPA

Одностраничное React-приложение для поиска GIF, просмотра трендов и случайных GIF. Данные загружаются через GIPHY API, а при отсутствии API-ключа приложение использует fallback-источник Wikimedia Commons для базового поиска.

## Возможности

- Поиск GIF по текстовому запросу.
- Живые поисковые подсказки при наличии GIPHY API key.
- Локальные популярные подсказки на основе истории запросов.
- Страница трендов с фильтром по рейтингу.
- Страница случайной GIF.
- Адаптивная masonry-лента.
- Модальное окно с крупным просмотром GIF и метаданными.
- Копирование ссылки на GIF.
- Скачивание GIF-файлов.
- Бесконечная догрузка при прокрутке.
- Анимированный интерфейс с кастомным loading-state.

## Технологии

- React 18
- TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- Zustand
- Lucide React
- GIPHY API

## Требования

- Node.js 18+
- npm
- GIPHY API key для полноценной работы с GIPHY

## Быстрый старт

Склонируйте репозиторий и установите зависимости:

```bash
git clone <repository-url>
cd GIF_LINK
npm install
```

Создайте файл `.env` в корне проекта:

```env
VITE_GIPHY_API_KEY=your_giphy_api_key_here
```

Запустите локальный dev-сервер:

```bash
npm run dev
```

По умолчанию Vite откроет приложение по адресу:

```text
http://127.0.0.1:5173
```

## Скрипты

```bash
npm run dev
```

Запускает приложение в режиме разработки.

```bash
npm run build
```

Проверяет TypeScript и собирает production-версию в папку `dist`.

```bash
npm run preview
```

Запускает локальный предпросмотр production-сборки.

## Переменные окружения

| Переменная           | Описание                          |
| -------------------- | --------------------------------- |
| `VITE_GIPHY_API_KEY` | API key для запросов к GIPHY API. |

## Где получить GIPHY API key

1. Перейдите на [GIPHY Developers](https://developers.giphy.com/).
2. Авторизуйтесь или создайте аккаунт.
3. Создайте новое приложение.
4. Выберите вариант API.
5. Скопируйте API key в `.env` как `VITE_GIPHY_API_KEY`.

## API и fallback

Основной источник данных — GIPHY API. Если `VITE_GIPHY_API_KEY` не задан, приложение продолжит работать через Wikimedia Commons, но качество и состав выдачи будут отличаться от GIPHY.

GIPHY API может ограничивать количество запросов. При превышении лимитов приложение покажет ошибку загрузки.

## Структура проекта

```text
src/
  api/
    gifApi.ts
  components/
    GifCard.tsx
    GifGrid.tsx
    GifModal.tsx
    Header.tsx
    RandomGifPanel.tsx
    SearchBar.tsx
    Suggestions.tsx
    Toast.tsx
    TrendFilters.tsx
  store/
    useGifStore.ts
  types/
    gif.ts
  utils/
    download.ts
    suggestions.ts
  App.tsx
  index.css
  main.tsx
```
