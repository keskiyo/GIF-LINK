export type DateFilter = 'default' | 'newest' | 'oldest'
export type RatingFilter = 'all' | 'y' | 'g' | 'pg' | 'pg-13' | 'r'

interface TrendFiltersProps {
	dateFilter: DateFilter
	ratingFilter: RatingFilter
	onDateFilterChange: (filter: DateFilter) => void
	onRatingFilterChange: (filter: RatingFilter) => void
}

export function TrendFilters({
	dateFilter,
	ratingFilter,
	onDateFilterChange,
	onRatingFilterChange,
}: TrendFiltersProps) {
	return (
		<section className='mx-auto mt-8 flex w-full max-w-3xl flex-wrap items-center justify-center gap-3'>
			<label className='flex items-center gap-2 rounded-full border-4 border-slate-950 bg-white/70 px-4 py-2 font-black shadow-control'>
				<span className='text-sm uppercase tracking-wide text-slate-700'>
					Дата
				</span>
				<select
					value={dateFilter}
					onChange={event =>
						onDateFilterChange(event.target.value as DateFilter)
					}
					className='bg-transparent text-sm font-black text-slate-950 outline-none'
				>
					<option value='default'>По умолчанию</option>
					<option value='newest'>Сначала новые</option>
					<option value='oldest'>Сначала старые</option>
				</select>
			</label>

			<label className='flex items-center gap-2 rounded-full border-4 border-slate-950 bg-white/70 px-4 py-2 font-black shadow-control'>
				<span className='text-sm uppercase tracking-wide text-slate-700'>
					Рейтинг
				</span>
				<select
					value={ratingFilter}
					onChange={event =>
						onRatingFilterChange(event.target.value as RatingFilter)
					}
					className='bg-transparent text-sm font-black text-slate-950 outline-none w-20'
				>
					<option value='all'>Все</option>
					<option value='g'>G</option>
					<option value='pg'>PG</option>
				</select>
			</label>
		</section>
	)
}

// убери фильтры по дате на странице тренды оставь только по рейгинку и сделай чтобы выбор рейтенга был при навидении а не по нажатию
