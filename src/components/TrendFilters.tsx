import { type LanguageCode, messages } from '../i18n'

export type RatingFilter = 'all' | 'y' | 'g' | 'pg' | 'pg-13' | 'r'

interface TrendFiltersProps {
	language: LanguageCode
	ratingFilter: RatingFilter
	onRatingFilterChange: (filter: RatingFilter) => void
}

const ratingOptions: Array<{
	value: RatingFilter
	labelKey?: 'all'
	label?: string
}> = [
	{ value: 'all', labelKey: 'all' },
	{ value: 'g', label: 'G' },
	{ value: 'pg', label: 'PG' },
]

export function TrendFilters({
	language,
	ratingFilter,
	onRatingFilterChange,
}: TrendFiltersProps) {
	const t = messages[language]
	const activeRating =
		ratingOptions.find(option => option.value === ratingFilter) ??
		ratingOptions[0]
	const activeRatingLabel = activeRating.labelKey
		? t.trends[activeRating.labelKey]
		: activeRating.label

	return (
		<section className='mx-auto mt-8 flex w-full max-w-3xl flex-wrap items-center justify-center gap-3'>
			<div className='group relative font-black'>
				<button
					type='button'
					className='flex min-h-12 min-w-44 items-center justify-between gap-3 rounded-full border-4 border-slate-950 bg-white/70 px-4 py-2 text-sm uppercase tracking-wide text-slate-950 shadow-control transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-200'
				>
					<span className='text-slate-700'>{t.trends.rating}</span>
					<span>{activeRatingLabel}</span>
				</button>

				<div className='invisible absolute left-1/2 top-full z-20 w-44 -translate-x-1/2 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100'>
					<div className='rounded-2xl border-4 border-slate-950 bg-white p-2 shadow-control'>
						{ratingOptions.map(option => {
							const isActive = option.value === ratingFilter

							return (
								<button
									key={option.value}
									type='button'
									onClick={() =>
										onRatingFilterChange(option.value)
									}
									className={`flex w-full items-center justify-center rounded-xl px-3 py-2 text-sm transition ${
										isActive
											? 'bg-slate-950 text-white'
											: 'text-slate-800 hover:bg-emerald-100'
									}`}
								>
								{option.labelKey
									? t.trends[option.labelKey]
									: option.label}
							</button>
							)
						})}
					</div>
				</div>
			</div>
		</section>
	)
}
