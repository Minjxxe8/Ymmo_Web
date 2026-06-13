import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getProperties } from '../../api/properties.api'
import { getTrends, getZones } from '../../api/analyctics.api'
import { addFavorite, removeFavorite, getFavorites } from '../../api/favorite.api'

const DPE_COLORS = { A: '#00c04b', B: '#4caf50', C: '#ffeb3b', D: '#ff9800', E: '#ff5722', F: '#f44336', G: '#b71c1c' }
const TYPES = ['Tous', 'appartement', 'maison', 'loft', 'chalet', 'bureau', 'terrain']

const formatPrice = (p) => new Intl.NumberFormat('fr-FR').format(p) + ' €'
const formatPriceShort = (v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M€` : `${v / 1000}k€`

function PropertyCard({ property, isFav, onToggleFav, user }) {
    return (
        <div className="bg-white group">
            <div className="relative overflow-hidden" style={{ aspectRatio: '16/10', backgroundColor: '#E8E4DC' }}>
                <div className="w-full h-full group-hover:scale-105 transition-transform duration-500" style={{ backgroundColor: '#D4CFC7' }} />
                {property.status === 'sold' && (
                    <span className="absolute top-3 left-3 text-xs tracking-widest uppercase px-3 py-1 text-white" style={{ backgroundColor: '#44474D' }}>Vendu</span>
                )}
                {user && (
                    <button
                        onClick={(e) => { e.preventDefault(); onToggleFav(property.id) }}
                        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-white transition-colors"
                    >
                        <span style={{ color: isFav ? '#C9A84C' : '#C5C6CE' }}>{isFav ? '♥' : '♡'}</span>
                    </button>
                )}
            </div>
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#44474D' }}>{property.type} · {property.city}</p>
                        <h3 className="text-lg italic" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#0D1F3C' }}>{property.title}</h3>
                    </div>
                    <span className="text-base font-semibold whitespace-nowrap ml-4" style={{ color: '#C9A84C' }}>{formatPrice(property.price)}</span>
                </div>
                <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: '#44474D' }}>{property.description}</p>
                <div className="flex gap-6 pt-4 border-t border-gray-100">
                    <div>
                        <p className="text-xs tracking-widest uppercase" style={{ color: '#C5C6CE' }}>Surface</p>
                        <p className="text-sm font-medium">{property.surface} m²</p>
                    </div>
                    <div>
                        <p className="text-xs tracking-widest uppercase" style={{ color: '#C5C6CE' }}>Pièces</p>
                        <p className="text-sm font-medium">{property.rooms}</p>
                    </div>
                    <div>
                        <p className="text-xs tracking-widest uppercase" style={{ color: '#C5C6CE' }}>DPE</p>
                        <span className="inline-block text-xs font-bold text-white px-2 py-0.5" style={{ backgroundColor: DPE_COLORS[property.dpe] }}>
              {property.dpe}
            </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function HomePage() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const [filters, setFilters] = useState({
        city: searchParams.get('city') ?? '',
        type: searchParams.get('type') ?? 'Tous',
        maxPrice: Number(searchParams.get('maxPrice')) || 10000000,
    })

    const [properties, setProperties] = useState([])
    const [trends, setTrends] = useState([])
    const [zones, setZones] = useState([])
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const params = {}
        if (filters.city) params.city = filters.city
        if (filters.type !== 'Tous') params.type = filters.type
        if (filters.maxPrice) params.maxPrice = filters.maxPrice

        setLoading(true)
        Promise.all([
            getProperties(params),
            getTrends(),
            getZones(),
            user ? getFavorites() : Promise.resolve([]),
        ]).then(([props, tr, zo, favs]) => {
            setProperties(props)
            setTrends(tr)
            setZones(zo)
            setFavorites(favs.map((f) => typeof f === 'string' ? f : f.id))
        }).finally(() => setLoading(false))
    }, [filters, user])

    const handleToggleFav = async (id) => {
        if (favorites.includes(id)) {
            await removeFavorite(id)
            setFavorites(favorites.filter((f) => f !== id))
        } else {
            await addFavorite(id)
            setFavorites([...favorites, id])
        }
    }

    return (
        <div style={{ backgroundColor: '#FCF9F4', fontFamily: "'Space Grotesk', sans-serif", color: '#0D1F3C' }}>

            <section className="py-12 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-8 lg:px-16">
                    <h1 className="text-4xl lg:text-5xl italic mb-8" style={{ fontFamily: "'Cormorant Garamond', 'Liberation Serif', serif" }}>
                        {filters.city ? `Biens à ${filters.city}` : 'Toutes les annonces'}
                    </h1>

                    <div className="flex flex-wrap gap-3 mb-6">
                        {TYPES.map((t) => (
                            <button key={t}
                                    onClick={() => setFilters((f) => ({ ...f, type: t }))}
                                    className="text-xs tracking-widest uppercase px-4 py-2 border transition-colors"
                                    style={{
                                        borderColor: filters.type === t ? '#0D1F3C' : '#C5C6CE',
                                        backgroundColor: filters.type === t ? '#0D1F3C' : 'transparent',
                                        color: filters.type === t ? 'white' : '#44474D',
                                    }}>
                                {t}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-6 items-end">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs tracking-widest uppercase" style={{ color: '#44474D' }}>Ville</label>
                            <input
                                value={filters.city}
                                onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
                                placeholder="Toutes les villes"
                                className="border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400 transition-colors w-48"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs tracking-widest uppercase" style={{ color: '#44474D' }}>
                                Budget max — {formatPriceShort(filters.maxPrice)}
                            </label>
                            <input type="range" min={100000} max={10000000} step={50000}
                                   value={filters.maxPrice}
                                   onChange={(e) => setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))}
                                   className="w-48 accent-yellow-600" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12">
                <div className="max-w-7xl mx-auto px-8 lg:px-16">
                    {loading ? (
                        <div className="flex justify-center py-24">
                            <div className="w-8 h-8 border-2 border-gray-200 border-t-yellow-600 rounded-full animate-spin" />
                        </div>
                    ) : properties.length === 0 ? (
                        <div className="text-center py-24">
                            <p className="text-xl italic mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Aucun bien trouvé</p>
                            <p className="text-sm" style={{ color: '#44474D' }}>Essayez d'élargir vos critères de recherche.</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-xs tracking-widest uppercase mb-8" style={{ color: '#44474D' }}>
                                {properties.length} bien{properties.length > 1 ? 's' : ''} trouvé{properties.length > 1 ? 's' : ''}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {properties.map((p) => (
                                    <PropertyCard
                                        key={p.id}
                                        property={p}
                                        isFav={favorites.includes(p.id)}
                                        onToggleFav={handleToggleFav}
                                        user={user}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>

            <section className="py-16" style={{ backgroundColor: '#F4F0E8' }}>
                <div className="max-w-7xl mx-auto px-8 lg:px-16">
                    <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#C9A84C' }}>Analyses IA</p>
                    <h2 className="text-3xl italic mb-10" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Tendances du marché</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <p className="text-xs tracking-widest uppercase mb-6" style={{ color: '#44474D' }}>Évolution des prix moyens</p>
                            <div className="flex items-end gap-3 h-32">
                                {trends.map((t) => {
                                    const max = Math.max(...trends.map((x) => x.avgPrice))
                                    const pct = (t.avgPrice / max) * 100
                                    return (
                                        <div key={t.month} className="flex flex-col items-center gap-2 flex-1">
                                            <div className="w-full" style={{ height: `${pct}%`, backgroundColor: '#C9A84C', opacity: 0.8 }} />
                                            <span className="text-xs" style={{ color: '#44474D' }}>{t.month}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div>
                            <p className="text-xs tracking-widest uppercase mb-6" style={{ color: '#44474D' }}>Zones les plus actives</p>
                            <div className="flex flex-col gap-3">
                                {zones.map((z) => (
                                    <div key={z.city} className="flex justify-between items-center py-3 border-b border-gray-200">
                                        <span className="text-sm font-medium">{z.city}</span>
                                        <div className="flex gap-6 text-right">
                                            <div>
                                                <p className="text-xs" style={{ color: '#C5C6CE' }}>Prix moy.</p>
                                                <p className="text-sm" style={{ color: '#C9A84C' }}>{formatPrice(z.avgPrice)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs" style={{ color: '#C5C6CE' }}>Biens</p>
                                                <p className="text-sm font-medium">{z.count}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {!user && (
                <section className="py-20" style={{ backgroundColor: '#0D1F3C' }}>
                    <div className="max-w-2xl mx-auto px-8 text-center">
                        <h2 className="text-4xl italic mb-4 text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            Sauvegardez vos favoris
                        </h2>
                        <p className="text-sm mb-8" style={{ color: '#C5C6CE' }}>
                            Créez un compte pour sauvegarder vos biens préférés et accéder à toutes nos fonctionnalités.
                        </p>
                        <Link to="/auth"
                              className="inline-block px-10 py-3 text-xs tracking-widest uppercase text-white hover:opacity-90 transition-opacity"
                              style={{ backgroundColor: '#C9A84C' }}>
                            Créer mon espace →
                        </Link>
                    </div>
                </section>
            )}
        </div>
    )
}