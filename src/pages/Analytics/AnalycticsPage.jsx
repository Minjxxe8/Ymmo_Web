import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getPopular, getTrends, getZones, getPredictions } from '../../api/analyctics.api'

const formatPrice = (p) => new Intl.NumberFormat('fr-FR').format(p) + ' €'
const CONFIDENCE_COLOR = { haute: '#009886', moyenne: '#C9A84C', faible: '#ff5722' }
const CONFIDENCE_BG = { haute: '#e6f7f5', moyenne: '#fff8e6', faible: '#fff0f0' }

const PERIODS = ['3 mois', '6 mois', '1 an', 'Tout']
const CITIES = ['Toutes', 'Paris', 'Nice', 'Aix-en-Provence', 'Bordeaux', 'Lyon']

export default function AnalyticsPage() {
    const { user } = useAuth()
    const navigate = useNavigate()

    const [popular, setPopular] = useState([])
    const [trends, setTrends] = useState([])
    const [zones, setZones] = useState([])
    const [predictions, setPredictions] = useState([])
    const [loading, setLoading] = useState(true)
    const [period, setPeriod] = useState('6 mois')
    const [city, setCity] = useState('Toutes')

    useEffect(() => {
        if (!user || (user.role !== 'admin' && user.role !== 'agent')) { navigate('/'); return }
        Promise.all([getPopular(), getTrends(), getZones(), getPredictions()])
            .then(([pop, tr, zo, pred]) => { setPopular(pop); setTrends(tr); setZones(zo); setPredictions(pred) })
            .finally(() => setLoading(false))
    }, [user])

    const filteredZones = city === 'Toutes' ? zones : zones.filter((z) => z.city === city)
    const maxViews = Math.max(...popular.map((p) => p.views), 1)
    const maxPrice = Math.max(...trends.map((t) => t.avgPrice), 1)

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FCF9F4' }}>
                <div className="w-8 h-8 border-2 border-gray-200 border-t-yellow-600 rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#FCF9F4', fontFamily: "'Space Grotesk', sans-serif", color: '#0D1F3C' }}>
            <div className="max-w-7xl mx-auto px-8 lg:px-16 py-16">

                <div className="mb-10">
                    <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#C9A84C' }}>Intelligence artificielle</p>
                    <h1 className="text-4xl lg:text-5xl italic mb-6" style={{ fontFamily: "'Cormorant Garamond', 'Liberation Serif', serif" }}>
                        Analytics
                    </h1>

                    <div className="flex flex-wrap gap-3 items-center">
                        <div className="flex gap-1 border border-gray-200 p-1 bg-white">
                            {PERIODS.map((p) => (
                                <button key={p} onClick={() => setPeriod(p)}
                                        className="px-4 py-1.5 text-xs tracking-widest uppercase transition-colors"
                                        style={{
                                            backgroundColor: period === p ? '#0D1F3C' : 'transparent',
                                            color: period === p ? 'white' : '#44474D',
                                        }}>
                                    {p}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-1 border border-gray-200 p-1 bg-white">
                            {CITIES.map((c) => (
                                <button key={c} onClick={() => setCity(c)}
                                        className="px-4 py-1.5 text-xs tracking-widest uppercase transition-colors"
                                        style={{
                                            backgroundColor: city === c ? '#0D1F3C' : 'transparent',
                                            color: city === c ? 'white' : '#44474D',
                                        }}>
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

                    <div className="bg-white border border-gray-100 p-8">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#C9A84C' }}>Consultation</p>
                                <h2 className="text-xl italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Biens les plus vus</h2>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            {popular.map((p, i) => (
                                <div key={p.propertyId} className="flex items-center gap-4">
                  <span className="text-2xl font-semibold w-8 shrink-0 text-right" style={{ color: '#C5C6CE' }}>
                    {i + 1}
                  </span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <Link to={`/property/${p.propertyId}`}
                                                  className="text-sm font-medium truncate hover:underline" style={{ color: '#0D1F3C' }}>
                                                {p.title}
                                            </Link>
                                            <span className="text-xs ml-3 shrink-0" style={{ color: '#C9A84C' }}>{p.views} vues</span>
                                        </div>
                                        <div className="h-1.5 bg-gray-100">
                                            <div className="h-full transition-all duration-700"
                                                 style={{ width: `${(p.views / maxViews) * 100}%`, backgroundColor: i === 0 ? '#C9A84C' : '#0D1F3C' }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 p-8">
                        <div className="mb-6">
                            <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#C9A84C' }}>Prévisions IA</p>
                            <h2 className="text-xl italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Prédictions de vente</h2>
                        </div>
                        <div className="flex flex-col gap-4">
                            {predictions.map((pred) => (
                                <div key={pred.city} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                                    <div>
                                        <p className="text-sm font-medium">{pred.city}</p>
                                        <span className="text-xs px-2 py-0.5 mt-1 inline-block"
                                              style={{ backgroundColor: CONFIDENCE_BG[pred.confidence], color: CONFIDENCE_COLOR[pred.confidence] }}>
                      Confiance {pred.confidence}
                    </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-semibold"
                                           style={{ color: pred.trend.startsWith('+') ? '#009886' : '#ff5722' }}>
                                            {pred.trend}
                                        </p>
                                        <p className="text-xs mt-0.5" style={{ color: '#C5C6CE' }}>sur 12 mois</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                <div className="bg-white border border-gray-100 p-8 mb-8">
                    <div className="mb-8">
                        <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#C9A84C' }}>Historique</p>
                        <h2 className="text-xl italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Évolution des prix moyens</h2>
                    </div>

                    <div className="flex items-end gap-4 h-48 mb-3">
                        {trends.map((t, i) => {
                            const pct = (t.avgPrice / maxPrice) * 100
                            const isLast = i === trends.length - 1
                            return (
                                <div key={t.month} className="flex flex-col items-center gap-2 flex-1 group relative">
                                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity
                    bg-white border border-gray-200 px-2 py-1 text-xs whitespace-nowrap z-10 shadow-sm"
                                         style={{ color: '#0D1F3C' }}>
                                        {formatPrice(t.avgPrice)}
                                    </div>
                                    <div className="w-full rounded-sm transition-all duration-700 cursor-pointer"
                                         style={{
                                             height: `${pct}%`,
                                             backgroundColor: isLast ? '#C9A84C' : '#0D1F3C',
                                             opacity: isLast ? 1 : 0.6,
                                         }} />
                                    <span className="text-xs" style={{ color: '#44474D' }}>{t.month}</span>
                                </div>
                            )
                        })}
                    </div>

                    <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3" style={{ backgroundColor: '#0D1F3C', opacity: 0.6 }} />
                            <span className="text-xs" style={{ color: '#44474D' }}>Mois précédents</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3" style={{ backgroundColor: '#C9A84C' }} />
                            <span className="text-xs" style={{ color: '#44474D' }}>Mois en cours</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-100 p-8">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#C9A84C' }}>Géographie</p>
                            <h2 className="text-xl italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Zones géographiques populaires</h2>
                        </div>
                        <span className="text-xs px-3 py-1 border" style={{ borderColor: '#C5C6CE', color: '#44474D' }}>
              {filteredZones.length} zone{filteredZones.length > 1 ? 's' : ''}
            </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredZones.map((z, i) => {
                            const maxCount = Math.max(...filteredZones.map((x) => x.count), 1)
                            const pct = (z.count / maxCount) * 100
                            return (
                                <div key={z.city} className="border border-gray-100 p-5 hover:border-gray-300 transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="text-base font-medium">{z.city}</p>
                                            <p className="text-xs mt-0.5" style={{ color: '#C5C6CE' }}>{z.count} biens actifs</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold" style={{ color: '#C9A84C' }}>{formatPrice(z.avgPrice)}</p>
                                            <p className="text-xs" style={{ color: '#C5C6CE' }}>prix moyen</p>
                                        </div>
                                    </div>
                                    <div className="h-1 bg-gray-100">
                                        <div className="h-full transition-all duration-700"
                                             style={{ width: `${pct}%`, backgroundColor: i === 0 ? '#C9A84C' : '#0D1F3C', opacity: i === 0 ? 1 : 0.5 }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>
        </div>
    )
}