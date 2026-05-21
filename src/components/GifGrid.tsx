import { AlertTriangle, RefreshCw, SearchX } from 'lucide-react'
import { type RefObject, useEffect, useMemo, useState } from 'react'
import type { GifItem } from '../types/gif'
import { GifCard } from './GifCard'

interface GifGridProps {
	gifs: GifItem[]
	isLoading: boolean
	isLoadingMore: boolean
	error: Error | null
	isSearchIdle: boolean
	showLoadMoreSentinel: boolean
	onRetry: () => void
	onCopy: (gif: GifItem) => void
	onDownload: (gif: GifItem) => void
	onOpen: (gif: GifItem) => void
	loadMoreRef: RefObject<HTMLDivElement>
}

export function GifGrid({
	gifs,
	isLoading,
	isLoadingMore,
	error,
	isSearchIdle,
	showLoadMoreSentinel,
	onRetry,
	onCopy,
	onDownload,
	onOpen,
	loadMoreRef,
}: GifGridProps) {
	const [columnCount, setColumnCount] = useState(1)

	useEffect(() => {
		const updateColumnCount = () => {
			if (window.innerWidth >= 1280) {
				setColumnCount(4)
			} else if (window.innerWidth >= 1024) {
				setColumnCount(3)
			} else if (window.innerWidth >= 640) {
				setColumnCount(2)
			} else {
				setColumnCount(1)
			}
		}

		updateColumnCount()
		window.addEventListener('resize', updateColumnCount)
		return () => window.removeEventListener('resize', updateColumnCount)
	}, [])

	const columns = useMemo(() => {
		const nextColumns = Array.from(
			{ length: columnCount },
			() => [] as GifItem[],
		)

		gifs.forEach((gif, index) => {
			nextColumns[index % columnCount].push(gif)
		})

		return nextColumns
	}, [columnCount, gifs])

	if (isLoading) {
		return (
			<section className='mx-auto mt-10 flex min-h-80 max-w-xl items-center justify-center'>
				<img
					src='/DANCE_CAT.gif'
					alt='Загрузка GIF'
					className='w-full max-w-xs object-contain'
				/>
			</section>
		)
	}

	if (error) {
		return (
			<section className='mx-auto mt-10 max-w-xl rounded-lg border-4 border-slate-950 bg-white p-8 text-center shadow-card'>
				<AlertTriangle
					aria-hidden
					className='mx-auto mb-4 text-rose-500'
					size={42}
				/>
				<h2 className='animated-text-gradient animated-text-gradient-status text-2xl font-black'>
					Ошибка загрузки
				</h2>
				<p className='mt-2 text-sm font-semibold text-slate-600'>
					{error.message}
				</p>
				<button
					type='button'
					onClick={onRetry}
					className='mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-slate-950 px-5 font-black uppercase tracking-wide text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200'
				>
					<RefreshCw aria-hidden size={18} />
					Повторить
				</button>
			</section>
		)
	}

	if (isSearchIdle) {
		return (
			<section className='mx-auto mt-10 max-w-xl rounded-lg border-4 border-slate-950 bg-white/82 p-8 text-center shadow-card'>
				<SearchX
					aria-hidden
					className='mx-auto mb-4 text-slate-500'
					size={44}
				/>
				<h2 className='animated-text-gradient animated-text-gradient-status text-2xl font-black'>
					Введите запрос
				</h2>
				<p className='mt-2 text-sm font-semibold text-slate-600'>
					Начните набирать текст в поле для поиска.
				</p>
			</section>
		)
	}

	if (gifs.length === 0) {
		return (
			<section className='mx-auto mt-10 max-w-xl rounded-lg border-4 border-slate-950 bg-white/82 p-8 text-center shadow-card'>
				<SearchX
					aria-hidden
					className='mx-auto mb-4 text-slate-500'
					size={44}
				/>
				<h2 className='animated-text-gradient animated-text-gradient-status text-2xl font-black'>
					Ничего не найдено
				</h2>
				<p className='mt-2 text-sm font-semibold text-slate-600'>
					Попробуйте другой запрос.
				</p>
			</section>
		)
	}

	return (
		<>
			<div
				className='mt-10 grid gap-4'
				style={{
					gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
				}}
			>
				{columns.map((column, columnIndex) => (
					<div key={columnIndex} className='min-w-0'>
						{column.map(gif => (
							<GifCard
								key={gif.id}
								gif={gif}
								onCopy={onCopy}
								onDownload={onDownload}
								onOpen={onOpen}
							/>
						))}
					</div>
				))}
			</div>

			{showLoadMoreSentinel && (
				<div
					ref={loadMoreRef}
					className='mt-8 flex min-h-24 items-center justify-center'
				>
					{isLoadingMore && (
						<img
							src='/DANCE_CAT.gif'
							alt='Загрузка GIF'
							className='h-24 w-24 object-contain'
						/>
					)}
				</div>
			)}
		</>
	)
}
