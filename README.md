# GIPHY-like GIF Search SPA

GIF-контент в приложении берётся с сайта [GIPHY](https://giphy.com/) через GIPHY API. Если API-ключ не настроен, приложение использует открытый fallback-источник Wikimedia Commons для базового поиска GIF.

Одностраничное React-приложение для поиска GIF, просмотра трендов и случайных GIF с адаптивной masonry-лентой, модальным просмотром, копированием ссылок и скачиванием файлов.

## Возможности

- Поиск GIF по текстовому запросу.
- Живые подсказки поиска через GIPHY API при наличии ключа.
- Локальные популярные подсказки на основе истории запросов пользователя.
- Страница трендов с фильтрами по дате и точному рейтингу GIF.
- Страница случайной GIF.
- Модальное окно с крупной GIF, тегами и доступной информацией: размеры, размер файла, кадры, рейтинг, автор, дата добавления.
- Копирование ссылки и скачивание GIF.
- Бесконечная догрузка GIF при прокрутке.
- Анимированный фон, градиентный текст и пересобирающийся пиксельный логотип.
- Loading-state через `DANCE_CAT.gif`.

## Стек

- React
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

Установите зависимости:

```bash
npm install
```

Создайте `.env` в корне проекта:

```env
VITE_GIPHY_API_KEY=your_giphy_api_key_here
```

Запустите dev-сервер:

```bash
npm run dev
```

Откройте приложение:

```text
http://127.0.0.1:5173
```

## Скрипты

```bash
npm run dev
```

Запуск локального dev-сервера.

```bash
npm run build
```

Проверка TypeScript и production-сборка.

```bash
npm run preview
```

Предпросмотр production-сборки.

## Где получить GIPHY API key

1. Перейдите на [GIPHY Developers](https://developers.giphy.com/).
2. Авторизуйтесь или создайте аккаунт.
3. Создайте новое приложение.
4. Выберите вариант API.
5. Скопируйте API key в `.env` как `VITE_GIPHY_API_KEY`.

Для этого проекта нужен именно API, потому что интерфейс реализован самостоятельно на React, а данные загружаются через HTTP endpoints.

## Рейтинги GIF

GIPHY использует такие рейтинги контента:

- `G`
- `PG`

## Ограничения API

- GIPHY API может вернуть `API rate limit exceeded`, если превышен лимит запросов, доступно минимально 100 запросов в час.
- Полный официальный список тегов GIF API обычно не отдаёт, поэтому теги в модальном окне собираются из доступных данных GIF.
- Без `VITE_GIPHY_API_KEY` используется fallback через Wikimedia Commons, но данные и качество выдачи отличаются от GIPHY.

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
