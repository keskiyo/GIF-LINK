import { Dices, Flame, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { GifMode } from '../types/gif'

interface HeaderProps {
	activeMode: GifMode
	onSearchMode: () => void
	onTrending: () => void
	onRandom: () => void
}

const navItems: Array<{
	mode: GifMode
	label: string
	icon: typeof Search
}> = [
	{ mode: 'search', label: 'ПОИСК', icon: Search },
	{ mode: 'trending', label: 'ТРЕНДЫ', icon: Flame },
	{ mode: 'random', label: 'РАНДОМ', icon: Dices },
]

const logoPalettes = [
	[
		'#fb7185',
		'#fde047',
		'#67e8f9',
		'#a3e635',
		'#d946ef',
		'#020617',
		'#ffffff',
		'#fb923c',
		'#0891b2',
		'#ffffff',
		'#020617',
		'#6ee7b7',
		'#8b5cf6',
		'#f9a8d4',
		'#facc15',
		'#020617',
	],
	[
		'#00e5ff',
		'#27f59a',
		'#f9e94f',
		'#ff8a3d',
		'#ff4fb8',
		'#111827',
		'#f8fafc',
		'#9b5cff',
		'#35a7ff',
		'#f8fafc',
		'#111827',
		'#22c55e',
		'#ef4444',
		'#f472b6',
		'#f97316',
		'#0f172a',
	],
	[
		'#38bdf8',
		'#f0abfc',
		'#bef264',
		'#fef08a',
		'#2dd4bf',
		'#020617',
		'#ffffff',
		'#fb7185',
		'#a78bfa',
		'#ffffff',
		'#020617',
		'#facc15',
		'#34d399',
		'#60a5fa',
		'#f472b6',
		'#111827',
	],
	[
		'#fb923c',
		'#7dd3fc',
		'#f472b6',
		'#86efac',
		'#c084fc',
		'#020617',
		'#ffffff',
		'#fde047',
		'#14b8a6',
		'#ffffff',
		'#020617',
		'#f87171',
		'#22d3ee',
		'#a3e635',
		'#e879f9',
		'#0f172a',
	],
]

const getRandomPalette = (currentPalette: string[]) => {
	const nextPalettes = logoPalettes.filter(
		palette => palette !== currentPalette,
	)
	return (
		nextPalettes[Math.floor(Math.random() * nextPalettes.length)] ??
		logoPalettes[0]
	)
}

export function Header({
	activeMode,
	onSearchMode,
	onTrending,
	onRandom,
}: HeaderProps) {
	const [logoColors, setLogoColors] = useState(logoPalettes[0])
	const [isLogoRebuilding, setIsLogoRebuilding] = useState(false)

	const actions: Record<GifMode, () => void> = {
		search: onSearchMode,
		trending: onTrending,
		random: onRandom,
	}

	const logoTileOffsets = useMemo(
		() => [
			'-translate-x-7 -translate-y-7 -rotate-45',
			'-translate-y-8 rotate-12',
			'translate-y-7 -rotate-12',
			'translate-x-7 -translate-y-7 rotate-45',
			'-translate-x-8 rotate-12',
			'-translate-y-7 -rotate-45',
			'translate-y-8 rotate-45',
			'translate-x-8 -rotate-12',
			'-translate-x-7 translate-y-7 rotate-45',
			'-translate-y-8 rotate-12',
			'translate-y-7 -rotate-45',
			'translate-x-7 translate-y-7 rotate-12',
			'-translate-x-8 translate-y-8 -rotate-12',
			'-translate-y-7 rotate-45',
			'translate-y-8 -rotate-12',
			'translate-x-8 translate-y-8 rotate-45',
		],
		[],
	)

	useEffect(() => {
		const rebuildLogo = () => {
			setIsLogoRebuilding(true)

			window.setTimeout(() => {
				setLogoColors(currentPalette =>
					getRandomPalette(currentPalette),
				)
				setIsLogoRebuilding(false)
			}, 1400)
		}

		const intervalId = window.setInterval(rebuildLogo, 30000)
		return () => window.clearInterval(intervalId)
	}, [])

	return (
		<header className='flex flex-col items-center gap-7 pt-9 sm:pt-12'>
			<nav className='flex w-full max-w-xl items-center justify-center gap-2 rounded-full bg-white/42 p-2 shadow-control backdrop-blur'>
				{navItems.map(({ mode, label, icon: Icon }) => {
					const isActive = activeMode === mode

					return (
						<button
							key={mode}
							type='button'
							onClick={actions[mode]}
							className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full px-3 text-sm font-black tracking-[0.08em] transition focus:outline-none focus:ring-4 focus:ring-emerald-200 ${
								isActive
									? 'bg-slate-950 text-white shadow-control'
									: 'bg-white/60 text-slate-800 hover:bg-white'
							}`}
						>
							<Icon aria-hidden size={18} strokeWidth={2.7} />
							<span>{label}</span>
						</button>
					)
				})}
			</nav>

			<div className='flex items-center gap-4'>
				<div className='grid h-16 w-16 shrink-0 grid-cols-4 grid-rows-4 rounded border-4 border-slate-950 shadow-control sm:h-20 sm:w-20'>
					{logoColors.map((color, index) => (
						<span
							key={index}
							className={`transition-all duration-500 ease-in-out ${
								isLogoRebuilding
									? `${logoTileOffsets[index]} scale-75 opacity-45`
									: 'translate-x-0 translate-y-0 rotate-0 scale-100 opacity-100'
							}`}
							style={{
								backgroundColor: color,
								transitionDelay: `${index * 24}ms`,
							}}
						/>
					))}
				</div>
				<h1 className='animated-text-gradient animated-text-gradient-logo font-display text-6xl font-black leading-none drop-shadow-sm sm:text-8xl'>
					GIPHY
				</h1>
			</div>
		</header>
	)
}
