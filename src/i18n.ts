export type LanguageCode = 'ru' | 'eu'

export const LANGUAGE_STORAGE_KEY = 'gif-link-language'

export const languageOptions: Array<{
	value: LanguageCode
	label: string
	short: string
}> = [
	{ value: 'ru', label: 'Русский (RU)', short: 'RU' },
	{ value: 'eu', label: 'English (EU)', short: 'EU' },
]

export const getStoredLanguage = (): LanguageCode => {
	if (typeof window === 'undefined') {
		return 'ru'
	}

	const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
	return storedLanguage === 'eu' ? 'eu' : 'ru'
}

export const messages = {
	ru: {
		nav: {
			search: 'ПОИСК',
			trending: 'ТРЕНДЫ',
			random: 'РАНДОМ',
			chooseLanguage: 'Выбрать язык',
		},
		search: {
			label: 'Поиск GIF',
			placeholder: 'Найти GIF...',
			clear: 'Очистить',
			submit: 'Искать',
		},
		actions: {
			copyLink: 'Копировать ссылку',
			downloadGif: 'Скачать GIF',
			retry: 'Повторить',
		},
		trends: {
			rating: 'Рейтинг',
			all: 'Все',
		},
		states: {
			loadingGif: 'Загрузка GIF',
			loadError: 'Ошибка загрузки',
			enterQuery: 'Введите запрос',
			enterQueryHint: 'Начните набирать текст в поле для поиска.',
			notFound: 'Ничего не найдено',
			tryAnotherQuery: 'Попробуйте другой запрос.',
			gifNotFound: 'GIF не найдена',
		},
		random: {
			more: 'Еще',
			next: 'Следующая',
			link: 'Ссылка',
			download: 'Скачать',
		},
		modal: {
			unavailable: 'Недоступно',
			dimensions: 'Размеры',
			fileSize: 'Размер файла',
			frames: 'Кадры',
			rating: 'Рейтинг',
			author: 'Автор',
			uploadedAt: 'Дата добавления',
			close: 'Закрыть',
			noTags: '#нет-тегов',
			openSource: 'Открыть источник',
			dateLocale: 'ru-RU',
		},
		toast: {
			linkCopied: 'Ссылка скопирована',
			copyFailed: 'Не удалось скопировать ссылку',
			downloadStarted: 'GIF скачивается',
			downloadFailed: 'Не удалось скачать GIF',
			enterSearchQuery: 'Введите запрос для поиска',
		},
		gif: {
			open: 'Открыть',
		},
	},
	eu: {
		nav: {
			search: 'SEARCH',
			trending: 'TRENDS',
			random: 'RANDOM',
			chooseLanguage: 'Choose language',
		},
		search: {
			label: 'GIF search',
			placeholder: 'Find a GIF...',
			clear: 'Clear',
			submit: 'Search',
		},
		actions: {
			copyLink: 'Copy link',
			downloadGif: 'Download GIF',
			retry: 'Retry',
		},
		trends: {
			rating: 'Rating',
			all: 'All',
		},
		states: {
			loadingGif: 'Loading GIF',
			loadError: 'Loading error',
			enterQuery: 'Enter a query',
			enterQueryHint: 'Start typing in the search field.',
			notFound: 'Nothing found',
			tryAnotherQuery: 'Try another query.',
			gifNotFound: 'GIF not found',
		},
		random: {
			more: 'More',
			next: 'Next',
			link: 'Link',
			download: 'Download',
		},
		modal: {
			unavailable: 'Unavailable',
			dimensions: 'Dimensions',
			fileSize: 'File size',
			frames: 'Frames',
			rating: 'Rating',
			author: 'Author',
			uploadedAt: 'Upload date',
			close: 'Close',
			noTags: '#no-tags',
			openSource: 'Open source',
			dateLocale: 'en-US',
		},
		toast: {
			linkCopied: 'Link copied',
			copyFailed: 'Could not copy the link',
			downloadStarted: 'GIF download started',
			downloadFailed: 'Could not download GIF',
			enterSearchQuery: 'Enter a search query',
		},
		gif: {
			open: 'Open',
		},
	},
} as const

const euErrorMessages: Record<string, string> = {
	'Добавьте VITE_GIPHY_API_KEY в .env, чтобы загрузить GIF из GIPHY.':
		'Add VITE_GIPHY_API_KEY to .env to load GIFs from GIPHY.',
	'GIPHY вернул ошибку.': 'GIPHY returned an error.',
	'Не удалось получить ответ от GIPHY.':
		'Could not get a response from GIPHY.',
	'Не удалось получить GIF из интернета.':
		'Could not load GIFs from the internet.',
	'GIF без названия': 'Untitled GIF',
	'Не удалось скачать GIF.': 'Could not download GIF.',
}

export const getLocalizedErrorMessage = (
	language: LanguageCode,
	message: string,
) => {
	if (language === 'ru') {
		return message
	}

	return euErrorMessages[message] ?? message
}
