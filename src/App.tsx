import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
	DEFAULT_GIF_LIMIT,
	getLiveSearchSuggestions,
	getRandomGif,
	getTrendingGifs,
	searchGifs,
} from './api/gifApi'
import { GifGrid } from './components/GifGrid'
import { GifModal } from './components/GifModal'
import { Header } from './components/Header'
import { RandomGifPanel } from './components/RandomGifPanel'
import { SearchBar } from './components/SearchBar'
import { Suggestions } from './components/Suggestions'
import { Toast } from './components/Toast'
import {
	type DateFilter,
	type RatingFilter,
	TrendFilters,
} from './components/TrendFilters'
import { useGifStore } from './store/useGifStore'
import type { GifItem } from './types/gif'
import { downloadGif } from './utils/download'
import {
	getPopularSearchSuggestions,
	mergeSuggestions,
} from './utils/suggestions'

export default function App() {
	const [gifPage, setGifPage] = useState(0)
	const [loadedGifs, setLoadedGifs] = useState<GifItem[]>([])
	const [hasMoreGifs, setHasMoreGifs] = useState(true)
	const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false)
	const [dateFilter, setDateFilter] = useState<DateFilter>('default')
	const [ratingFilter, setRatingFilter] = useState<RatingFilter>('all')
	const [selectedGif, setSelectedGif] = useState<GifItem | null>(null)
	const searchWrapRef = useRef<HTMLDivElement>(null)
	const loadMoreRef = useRef<HTMLDivElement>(null)
	const {
		mode,
		query,
		lastSubmittedQuery,
		randomSeed,
		toast,
		setMode,
		setQuery,
		submitQuery,
		requestRandom,
		clearQuery,
		showToast,
		hideToast,
	} = useGifStore()

	const isSearchIdle = mode === 'search' && !lastSubmittedQuery
	const gifOffset = gifPage * DEFAULT_GIF_LIMIT

	const gifQuery = useQuery({
		queryKey: [
			'gifs',
			mode,
			lastSubmittedQuery,
			randomSeed,
			gifPage,
			mode === 'trending' ? ratingFilter : 'all',
		],
		enabled: !isSearchIdle,
		queryFn: () => {
			if (mode === 'search') {
				return searchGifs(
					lastSubmittedQuery,
					DEFAULT_GIF_LIMIT,
					gifOffset,
				)
			}

			if (mode === 'random') {
				return getRandomGif()
			}

			return getTrendingGifs(DEFAULT_GIF_LIMIT, gifOffset, ratingFilter)
		},
	})

	const liveSuggestionsQuery = useQuery({
		queryKey: ['suggestions', query.trim().toLowerCase()],
		enabled: mode === 'search' && query.trim().length > 0,
		queryFn: () => getLiveSearchSuggestions(query),
		retry: false,
		staleTime: 1000 * 60 * 5,
	})

	const suggestions = useMemo(() => {
		return mergeSuggestions(
			query,
			[
				liveSuggestionsQuery.data ?? [],
				getPopularSearchSuggestions(query, 5),
			],
			5,
		)
	}, [liveSuggestionsQuery.data, query])

	const canLoadMore = useMemo(
		() =>
			!isSearchIdle &&
			mode !== 'random' &&
			!gifQuery.error &&
			hasMoreGifs &&
			loadedGifs.length > 0 &&
			!gifQuery.isLoading,
		[
			gifQuery.error,
			gifQuery.isLoading,
			hasMoreGifs,
			isSearchIdle,
			loadedGifs.length,
			mode,
		],
	)

	useEffect(() => {
		const target = loadMoreRef.current

		if (!target || !canLoadMore) {
			return
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !gifQuery.isFetching) {
					setGifPage(currentPage => currentPage + 1)
				}
			},
			{ rootMargin: '360px 0px' },
		)

		observer.observe(target)
		return () => observer.disconnect()
	}, [canLoadMore, gifQuery.isFetching, loadedGifs.length])

	const shouldShowSuggestions = useMemo(
		() =>
			isSuggestionsOpen &&
			mode === 'search' &&
			query.trim().length > 0 &&
			suggestions.length > 0,
		[isSuggestionsOpen, mode, query, suggestions.length],
	)

	const visibleGifs = useMemo(() => {
		if (mode !== 'trending') {
			return loadedGifs
		}

		const ratingFilteredGifs =
			ratingFilter === 'all'
				? loadedGifs
				: loadedGifs.filter(
						gif => gif.rating.toLowerCase() === ratingFilter,
					)

		if (dateFilter === 'default') {
			return ratingFilteredGifs
		}

		return [...ratingFilteredGifs].sort((left, right) => {
			const leftTime = left.uploadedAt
				? new Date(left.uploadedAt).getTime()
				: 0
			const rightTime = right.uploadedAt
				? new Date(right.uploadedAt).getTime()
				: 0

			return dateFilter === 'newest'
				? rightTime - leftTime
				: leftTime - rightTime
		})
	}, [dateFilter, loadedGifs, mode, ratingFilter])

	useEffect(() => {
		if (
			mode !== 'trending' ||
			ratingFilter === 'all' ||
			visibleGifs.length > 0 ||
			loadedGifs.length === 0 ||
			!hasMoreGifs ||
			gifQuery.isFetching
		) {
			return
		}

		setGifPage(currentPage => currentPage + 1)
	}, [
		gifQuery.isFetching,
		hasMoreGifs,
		loadedGifs.length,
		mode,
		ratingFilter,
		visibleGifs.length,
	])

	useEffect(() => {
		const handlePointerDown = (event: PointerEvent) => {
			if (!searchWrapRef.current?.contains(event.target as Node)) {
				setIsSuggestionsOpen(false)
			}
		}

		document.addEventListener('pointerdown', handlePointerDown)
		return () =>
			document.removeEventListener('pointerdown', handlePointerDown)
	}, [])

	useEffect(() => {
		if (!toast) {
			return
		}

		const timeoutId = window.setTimeout(hideToast, 2400)
		return () => window.clearTimeout(timeoutId)
	}, [hideToast, toast])

	useEffect(() => {
		setGifPage(0)
		setLoadedGifs([])
		setHasMoreGifs(true)
	}, [lastSubmittedQuery, mode, ratingFilter])

	useEffect(() => {
		if (!gifQuery.data || mode === 'random') {
			return
		}

		setHasMoreGifs(gifQuery.data.length >= DEFAULT_GIF_LIMIT)

		setLoadedGifs(currentGifs => {
			if (gifPage === 0) {
				return gifQuery.data
			}

			const seenIds = new Set(currentGifs.map(gif => gif.id))
			const nextGifs = gifQuery.data.filter(gif => !seenIds.has(gif.id))

			return [...currentGifs, ...nextGifs]
		})
	}, [gifPage, gifQuery.data, mode])

	const handleSearch = () => {
		setIsSuggestionsOpen(false)
		setGifPage(0)
		setLoadedGifs([])
		setHasMoreGifs(true)
		submitQuery(query)
	}

	const handleSearchMode = () => {
		setMode('search')
	}

	const handleTrending = () => {
		setGifPage(0)
		setLoadedGifs([])
		setHasMoreGifs(true)
		setMode('trending')
	}

	const handleRandom = () => {
		requestRandom()
	}

	const handleSuggestion = (suggestion: string) => {
		setIsSuggestionsOpen(false)
		setGifPage(0)
		setLoadedGifs([])
		setHasMoreGifs(true)
		setQuery(suggestion)
		submitQuery(suggestion)
	}

	const handleCopy = async (gif: GifItem) => {
		try {
			await navigator.clipboard.writeText(gif.gifUrl)
			showToast('Ссылка скопирована')
		} catch {
			showToast('Не удалось скопировать ссылку')
		}
	}

	const handleDownload = async (gif: GifItem) => {
		try {
			await downloadGif(gif, mode === 'search' ? lastSubmittedQuery : '')
			showToast('GIF скачивается')
		} catch (error) {
			showToast(
				error instanceof Error
					? error.message
					: 'Не удалось скачать GIF',
			)
		}
	}

	const handleEmptySubmit = () => {
		setIsSuggestionsOpen(false)
		showToast('Введите запрос для поиска')
	}

	const handleQueryChange = (nextQuery: string) => {
		setQuery(nextQuery)
		setIsSuggestionsOpen(nextQuery.trim().length > 0)
	}

	const handleClearQuery = () => {
		setIsSuggestionsOpen(false)
		clearQuery()
	}

	return (
		<main className='animated-gradient min-h-screen px-4 pb-14 text-slate-950'>
			<div className='mx-auto max-w-6xl'>
				<Header
					activeMode={mode}
					onSearchMode={handleSearchMode}
					onTrending={handleTrending}
					onRandom={handleRandom}
				/>

				{mode === 'search' && (
					<div
						ref={searchWrapRef}
						className='relative mx-auto w-full max-w-3xl'
					>
						<SearchBar
							value={query}
							isLoading={gifQuery.isFetching}
							onChange={handleQueryChange}
							onClear={handleClearQuery}
							onSubmit={handleSearch}
							onEmptySubmit={handleEmptySubmit}
						/>
						{shouldShowSuggestions && (
							<Suggestions
								suggestions={suggestions}
								onPick={handleSuggestion}
							/>
						)}
					</div>
				)}

				{mode === 'trending' && (
					<TrendFilters
						dateFilter={dateFilter}
						ratingFilter={ratingFilter}
						onDateFilterChange={setDateFilter}
						onRatingFilterChange={setRatingFilter}
					/>
				)}

				{mode === 'random' ? (
					<RandomGifPanel
						gif={gifQuery.data?.[0] ?? null}
						isLoading={gifQuery.isLoading || gifQuery.isFetching}
						error={gifQuery.error}
						onNext={handleRandom}
						onRetry={() => void gifQuery.refetch()}
						onCopy={handleCopy}
						onDownload={handleDownload}
					/>
				) : (
					<GifGrid
						gifs={visibleGifs}
						isLoading={
							(gifQuery.isLoading && loadedGifs.length === 0) ||
							(mode === 'trending' &&
								ratingFilter !== 'all' &&
								visibleGifs.length === 0 &&
								hasMoreGifs &&
								gifQuery.isFetching)
						}
						isLoadingMore={
							gifQuery.isFetching && loadedGifs.length > 0
						}
						error={gifQuery.error}
						isSearchIdle={isSearchIdle}
						showLoadMoreSentinel={canLoadMore}
						onRetry={() => void gifQuery.refetch()}
						onCopy={handleCopy}
						onDownload={handleDownload}
						onOpen={setSelectedGif}
						loadMoreRef={loadMoreRef}
					/>
				)}
			</div>
			<GifModal
				gif={selectedGif}
				onClose={() => setSelectedGif(null)}
				onCopy={handleCopy}
				onDownload={handleDownload}
			/>
			<Toast message={toast} />
		</main>
	)
}
