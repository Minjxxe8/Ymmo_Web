import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getProperties } from '../../api/properties.api'
import { getZones } from '../../api/analyctics.api'

const DPE_COLORS = { A: '#00c04b', B: '#4caf50', C: '#ffeb3b', D: '#ff9800', E: '#ff5722', F: '#f44336', G: '#b71c1c' }
const TYPES = ['Résidentiel', 'Appartement', 'Maison', 'Loft', 'Chalet', 'Bureau', 'Terrain']
const AGENCES = ['Aix', 'Marseille', 'Nice', 'Paris', 'Lyon', 'Bordeaux', 'St-Tropez', 'Lille', 'Toulouse', 'Rennes', 'Strasbourg', 'Montpellier']

const formatPrice = (p) => new Intl.NumberFormat('fr-FR').format(p) + ' €'
const formatPriceShort = (v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M€` : `${v / 1000}k€`

export default function LandingPage() {
    const navigate = useNavigate()
    const { user } = useAuth()

    const [featured, setFeatured] = useState([])
    const [zones, setZones] = useState([])
    const [search, setSearch] = useState({ city: '', type: 'Résidentiel', maxPrice: 10000000 })

    useEffect(() => {
        getProperties().then((props) => setFeatured(props.slice(0, 3)))
        getZones().then(setZones)
    }, [])

    const handleSearch = () => {
        const params = new URLSearchParams()
        if (search.city) params.set('city', search.city)
        if (search.type) params.set('type', search.type)
        params.set('maxPrice', search.maxPrice)
        navigate(`/home?${params.toString()}`)
    }

    return (
        <div style={{ backgroundColor: '#FCF9F4', fontFamily: "'Space Grotesk', sans-serif", color: '#0D1F3C' }}>

            <section className="relative min-h-screen flex flex-col">
                <div className="absolute inset-0 z-0" style={{ backgroundColor: '#0D1F3C' }}>
                    <div className="w-full h-full opacity-20" style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600)',
                        backgroundSize: 'cover', backgroundPosition: 'center'
                    }} />
                </div>
                <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/30 to-transparent z-10" />

                <div className="relative z-20 flex-1 flex flex-col justify-center items-start max-w-7xl mx-auto w-full px-8 lg:px-16 pt-32 pb-24">
                    <p className="text-xs tracking-widest uppercase mb-6" style={{ color: '#C9A84C' }}>
                        12 Agences · Une seule plateforme
                    </p>
                    <h1 className="text-6xl lg:text-8xl italic leading-none mb-6 text-white max-w-3xl"
                        style={{ fontFamily: "'Cormorant Garamond', 'Liberation Serif', serif" }}>
                        L'Immobilier,<br />réinventé.
                    </h1>
                    <p className="text-sm tracking-widest uppercase mb-12" style={{ color: '#C5C6CE' }}>
                        Propulsé par l'intelligence artificielle
                    </p>

                    <div className="bg-white p-6 w-full max-w-2xl shadow-xl">
                        <div className="mb-4">
                            <div className="flex justify-between mb-1">
                                <span className="text-xs tracking-widest uppercase" style={{ color: '#44474D' }}>Budget maximum</span>
                                <span className="text-xs font-medium" style={{ color: '#C9A84C' }}>{formatPriceShort(search.maxPrice)}</span>
                            </div>
                            <input type="range" min={100000} max={10000000} step={50000}
                                   value={search.maxPrice}
                                   onChange={(e) => setSearch({ ...search, maxPrice: Number(e.target.value) })}
                                   className="w-full accent-yellow-600" />
                        </div>

                        <div className="flex gap-3 mb-4">
                            <div className="flex-1 flex items-center gap-2 border border-gray-200 px-3 py-2.5">
                                <span className="text-gray-400 text-sm">📍</span>
                                <input
                                    placeholder="Ville, quartier..."
                                    value={search.city}
                                    onChange={(e) => setSearch({ ...search, city: e.target.value })}
                                    className="flex-1 text-sm outline-none"
                                    style={{ color: '#0D1F3C' }}
                                />
                            </div>
                            <div className="flex items-center gap-2 border border-gray-200 px-3 py-2.5">
                                <span className="text-gray-400 text-sm">🏠</span>
                                <select value={search.type} onChange={(e) => setSearch({ ...search, type: e.target.value })}
                                        className="text-sm outline-none bg-transparent" style={{ color: '#0D1F3C' }}>
                                    {TYPES.map((t) => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>

                        <button onClick={handleSearch}
                                className="w-full py-3 text-xs tracking-widest uppercase text-white hover:opacity-90 transition-opacity"
                                style={{ backgroundColor: '#C9A84C' }}>
                            Rechercher →
                        </button>
                    </div>
                </div>
            </section>

            <section style={{ backgroundColor: '#0D1F3C' }} className="py-20">
                <div className="max-w-7xl mx-auto px-8 lg:px-16 grid grid-cols-3 gap-8 text-center">
                    {[['4 200+', 'Biens vendus'], ['12', 'Agences'], ['98%', 'Satisfaction client']].map(([val, label]) => (
                        <div key={label} className="flex flex-col gap-2">
                            <span className="text-5xl lg:text-6xl font-semibold" style={{ color: '#C9A84C' }}>{val}</span>
                            <span className="text-xs tracking-widest uppercase" style={{ color: '#C5C6CE' }}>{label}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-24 max-w-7xl mx-auto px-8 lg:px-16">
                <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#C9A84C' }}>La sélection</p>
                <h2 className="text-4xl lg:text-5xl italic mb-12" style={{ fontFamily: "'Cormorant Garamond', 'Liberation Serif', serif" }}>
                    Biens en vedette
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {featured.map((p) => (
                        <Link to="/home" key={p.id} className="group cursor-pointer">
                            <div className="relative overflow-hidden mb-4" style={{ aspectRatio: '4/3', backgroundColor: '#E8E4DC' }}>
                                <div className="w-full h-full group-hover:scale-105 transition-transform duration-500" style={{ backgroundColor: '#D4CFC7' }} />
                            </div>
                            <div className="flex justify-between items-start mb-1">
                                <div>
                                    <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#44474D' }}>{p.type} · {p.city}</p>
                                    <h3 className="text-xl italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{p.title}</h3>
                                </div>
                                <span className="text-lg font-semibold whitespace-nowrap ml-4" style={{ color: '#C9A84C' }}>
                  {formatPrice(p.price)}
                </span>
                            </div>
                            <div className="flex gap-6 mt-3">
                                <div>
                                    <p className="text-xs tracking-widest uppercase" style={{ color: '#C5C6CE' }}>Surface</p>
                                    <p className="text-sm font-medium">{p.surface} m²</p>
                                </div>
                                <div>
                                    <p className="text-xs tracking-widest uppercase" style={{ color: '#C5C6CE' }}>DPE</p>
                                    <span className="inline-block text-xs font-bold text-white px-2 py-0.5" style={{ backgroundColor: DPE_COLORS[p.dpe] }}>
                    {p.dpe}
                  </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="flex justify-center mt-12">
                    <button onClick={() => navigate('/home')}
                            className="px-10 py-3 text-xs tracking-widest uppercase border transition-colors hover:bg-neutral-100"
                            style={{ borderColor: '#0D1F3C', color: '#0D1F3C' }}>
                        Voir toutes les annonces →
                    </button>
                </div>
            </section>

            <section className="py-24" style={{ backgroundColor: '#F4F0E8' }}>
                <div className="max-w-7xl mx-auto px-8 lg:px-16 text-center">
                    <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#C9A84C' }}>Notre réseau</p>
                    <h2 className="text-4xl lg:text-5xl italic mb-12" style={{ fontFamily: "'Cormorant Garamond', 'Liberation Serif', serif" }}>
                        12 agences à travers la France
                    </h2>
                    <div className="flex flex-wrap justify-center gap-3">
                        {AGENCES.map((a) => (
                            <span key={a} className="text-xs tracking-widest uppercase px-4 py-2 border"
                                  style={{ borderColor: '#C5C6CE', color: '#44474D' }}>
                {a}
              </span>
                        ))}
                    </div>
                </div>
            </section>

            {!user && (
                <section className="py-24" style={{ backgroundColor: '#0D1F3C' }}>
                    <div className="max-w-2xl mx-auto px-8 text-center">
                        <h2 className="text-4xl lg:text-5xl italic mb-4 text-white"
                            style={{ fontFamily: "'Cormorant Garamond', 'Liberation Serif', serif" }}>
                            Prêt à trouver votre bien idéal ?
                        </h2>
                        <p className="text-sm mb-10 tracking-wide" style={{ color: '#C5C6CE' }}>
                            Rejoignez Ymmo et accédez à notre sélection exclusive de biens immobiliers.
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