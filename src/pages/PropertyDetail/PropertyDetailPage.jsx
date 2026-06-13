import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getPropertyById, getProperties } from '../../api/properties.api'
import { addFavorite, removeFavorite, getFavorites } from '../../api/favorite.api'

const DPE_COLORS = { A: '#00c04b', B: '#4caf50', C: '#ffeb3b', D: '#ff9800', E: '#ff5722', F: '#f44336', G: '#b71c1c' }
const DPE_TEXT = { A: '#fff', B: '#fff', C: '#0D1F3C', D: '#fff', E: '#fff', F: '#fff', G: '#fff' }
const formatPrice = (p) => new Intl.NumberFormat('fr-FR').format(p) + ' €'

function SimilarCard({ property }) {
    const navigate = useNavigate()
    return (
        <div
            onClick={() => navigate(`/property/${property.id}`)}
            className="cursor-pointer group"
        >
            <div className="overflow-hidden mb-3" style={{ aspectRatio: '4/3', backgroundColor: '#E8E4DC' }}>
                <div className="w-full h-full group-hover:scale-105 transition-transform duration-500" style={{ backgroundColor: '#D4CFC7' }} />
            </div>
            <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#44474D' }}>{property.type} · {property.city}</p>
            <h4 className="text-base italic mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#0D1F3C' }}>{property.title}</h4>
            <p className="text-sm font-semibold" style={{ color: '#C9A84C' }}>{formatPrice(property.price)}</p>
        </div>
    )
}

export default function PropertyDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()

    const [property, setProperty] = useState(null)
    const [similar, setSimilar] = useState([])
    const [isFav, setIsFav] = useState(false)
    const [loading, setLoading] = useState(true)
    const [activeImage, setActiveImage] = useState(0)
    const [showContact, setShowContact] = useState(false)
    const [contactForm, setContactForm] = useState({ message: '' })

    const placeholderImages = [1, 2, 3, 4]

    useEffect(() => {
        setLoading(true)
        Promise.all([
            getPropertyById(id),
            user ? getFavorites() : Promise.resolve([]),
        ]).then(([prop, favs]) => {
            setProperty(prop)
            const favIds = favs.map((f) => typeof f === 'string' ? f : f.id)
            setIsFav(favIds.includes(id))
            return getProperties({ type: prop.type })
        }).then((props) => {
            setSimilar(props.filter((p) => p.id !== id).slice(0, 3))
        }).finally(() => setLoading(false))
    }, [id, user])

    const handleToggleFav = async () => {
        if (!user) { navigate('/auth'); return }
        if (isFav) {
            await removeFavorite(id)
            setIsFav(false)
        } else {
            await addFavorite(id)
            setIsFav(true)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FCF9F4' }}>
                <div className="w-8 h-8 border-2 border-gray-200 border-t-yellow-600 rounded-full animate-spin" />
            </div>
        )
    }

    if (!property) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: '#FCF9F4' }}>
                <p className="text-2xl italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Bien introuvable</p>
                <button onClick={() => navigate('/home')} className="text-sm underline" style={{ color: '#C9A84C' }}>
                    Retour aux annonces
                </button>
            </div>
        )
    }

    return (
        <div style={{ backgroundColor: '#FCF9F4', fontFamily: "'Space Grotesk', sans-serif", color: '#0D1F3C' }}>

            <div className="max-w-7xl mx-auto px-8 lg:px-16 py-6">
                <div className="flex items-center gap-2 text-xs tracking-widest" style={{ color: '#C5C6CE' }}>
                    <Link to="/home" className="hover:text-yellow-600 transition-colors">Annonces</Link>
                    <span>/</span>
                    <span className="capitalize">{property.type}</span>
                    <span>/</span>
                    <span style={{ color: '#0D1F3C' }}>{property.title}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 lg:px-16 mb-12">
                <div className="grid grid-cols-4 grid-rows-2 gap-3" style={{ height: '520px' }}>
                    <div className="col-span-2 row-span-2 overflow-hidden cursor-pointer" style={{ backgroundColor: '#D4CFC7' }}
                         onClick={() => setActiveImage(0)}>
                        <div className="w-full h-full hover:scale-105 transition-transform duration-500" style={{ backgroundColor: '#C4BFB7' }} />
                    </div>
                    {placeholderImages.slice(1).map((_, i) => (
                        <div key={i} className="overflow-hidden cursor-pointer relative" style={{ backgroundColor: '#DDD9D2' }}
                             onClick={() => setActiveImage(i + 1)}>
                            <div className="w-full h-full hover:scale-105 transition-transform duration-500" style={{ backgroundColor: '#CECCCA' }} />
                            {i === 2 && (
                                <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(13,31,60,0.5)' }}>
                                    <span className="text-white text-sm tracking-widest">+8 photos</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 lg:px-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

                    <div className="lg:col-span-2">

                        <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                            <div>
                                <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#44474D' }}>
                                    {property.type} · {property.neighborhood} · {property.city}
                                </p>
                                <h1 className="text-4xl lg:text-5xl italic" style={{ fontFamily: "'Cormorant Garamond', 'Liberation Serif', serif" }}>
                                    {property.title}
                                </h1>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-semibold" style={{ color: '#C9A84C' }}>{formatPrice(property.price)}</p>
                                <p className="text-xs mt-1" style={{ color: '#C5C6CE' }}>
                                    {Math.round(property.price / property.surface).toLocaleString('fr-FR')} €/m²
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-gray-200 mb-10">
                            {[
                                ['Surface', `${property.surface} m²`],
                                ['Pièces', property.rooms],
                                ['Salle(s) de bain', property.bathrooms],
                                ['Étage', property.floor === 0 ? 'RDC' : `${property.floor}/${property.totalFloors}`],
                            ].map(([label, value]) => (
                                <div key={label}>
                                    <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#C5C6CE' }}>{label}</p>
                                    <p className="text-lg font-medium">{value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mb-10">
                            <h2 className="text-xl italic mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Description</h2>
                            <p className="text-sm leading-relaxed" style={{ color: '#44474D' }}>{property.description}</p>
                        </div>

                        <div className="mb-10">
                            <h2 className="text-xl italic mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Prestations</h2>
                            <div className="flex flex-wrap gap-2">
                                {property.features?.map((f) => (
                                    <span key={f} className="text-xs tracking-widest uppercase px-3 py-2 border"
                                          style={{ borderColor: '#C5C6CE', color: '#44474D' }}>
                    {f}
                  </span>
                                ))}
                            </div>
                        </div>

                        <div className="mb-10">
                            <h2 className="text-xl italic mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Localisation</h2>
                            <div className="flex items-center gap-3 mb-3">
                                <span style={{ color: '#C9A84C' }}>📍</span>
                                <p className="text-sm" style={{ color: '#44474D' }}>{property.address}, {property.neighborhood}, {property.city}</p>
                            </div>
                            <div className="w-full flex items-center justify-center border border-gray-200" style={{ height: '220px', backgroundColor: '#EDE9E0' }}>
                                <p className="text-xs tracking-widest uppercase" style={{ color: '#C5C6CE' }}>Carte — disponible avec le backend</p>
                            </div>
                        </div>

                        <div className="mb-16">
                            <h2 className="text-xl italic mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Diagnostic énergétique</h2>
                            <div className="flex gap-8">
                                {[['DPE', property.dpe], ['GES', property.ges]].map(([label, val]) => (
                                    <div key={label} className="flex items-center gap-4">
                                        <p className="text-xs tracking-widest uppercase" style={{ color: '#C5C6CE' }}>{label}</p>
                                        <div className="flex gap-1">
                                            {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((l) => (
                                                <div key={l} className="flex items-center justify-center text-xs font-bold w-8 h-8"
                                                     style={{
                                                         backgroundColor: l === val ? DPE_COLORS[l] : '#E8E4DC',
                                                         color: l === val ? DPE_TEXT[l] : '#C5C6CE',
                                                         transform: l === val ? 'scale(1.2)' : 'scale(1)',
                                                         transition: 'transform 0.2s',
                                                     }}>
                                                    {l}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-24 flex flex-col gap-4">

                            {property.status === 'sold' && (
                                <div className="px-4 py-3 text-center text-xs tracking-widest uppercase text-white" style={{ backgroundColor: '#44474D' }}>
                                    Ce bien a été vendu
                                </div>
                            )}

                            {property.status !== 'sold' && (
                                <button
                                    onClick={() => { if (!user) { navigate('/auth'); return } setShowContact(true) }}
                                    className="w-full py-4 text-xs tracking-widest uppercase text-white hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: '#C9A84C' }}>
                                    {user ? 'Acheter / Contacter l\'agent →' : 'Se connecter pour acheter →'}
                                </button>
                            )}

                            <button
                                onClick={handleToggleFav}
                                className="w-full py-4 text-xs tracking-widest uppercase border transition-colors hover:bg-gray-50"
                                style={{ borderColor: isFav ? '#C9A84C' : '#C5C6CE', color: isFav ? '#C9A84C' : '#44474D' }}>
                                {isFav ? '♥ Retirer des favoris' : '♡ Ajouter aux favoris'}
                            </button>

                            <div className="border border-gray-200 p-6 mt-2">
                                <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#C5C6CE' }}>Votre agent</p>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 flex items-center justify-center text-white text-lg font-semibold"
                                         style={{ backgroundColor: '#0D1F3C' }}>
                                        {property.agentName?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{property.agentName}</p>
                                        <p className="text-xs" style={{ color: '#C5C6CE' }}>Agent immobilier</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <a href={`tel:${property.agentPhone}`} className="text-xs flex items-center gap-2 hover:underline" style={{ color: '#009886' }}>
                                        📞 {property.agentPhone}
                                    </a>
                                    <a href={`mailto:${property.agentEmail}`} className="text-xs flex items-center gap-2 hover:underline" style={{ color: '#009886' }}>
                                        ✉️ {property.agentEmail}
                                    </a>
                                </div>
                            </div>

                            <div className="border border-gray-200 p-6">
                                <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#C5C6CE' }}>Référence</p>
                                <p className="text-sm font-medium">YMM-{property.id.padStart(5, '0')}</p>
                                <p className="text-xs mt-3" style={{ color: '#C5C6CE' }}>
                                    Publié le {new Date(property.createdAt).toLocaleDateString('fr-FR')}
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {showContact && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(13,31,60,0.7)' }}>
                    <div className="bg-white p-8 w-full max-w-md shadow-xl">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Contacter l'agent</h3>
                            <button onClick={() => setShowContact(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="p-3 border border-gray-100 text-sm" style={{ backgroundColor: '#F4F0E8' }}>
                                <p className="font-medium">{property.title}</p>
                                <p style={{ color: '#C9A84C' }}>{formatPrice(property.price)}</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs tracking-widest uppercase" style={{ color: '#44474D' }}>Message</label>
                                <textarea
                                    rows={4}
                                    value={contactForm.message}
                                    onChange={(e) => setContactForm({ message: e.target.value })}
                                    placeholder="Bonjour, je suis intéressé par ce bien..."
                                    className="border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400 resize-none"
                                    style={{ color: '#0D1F3C' }}
                                />
                            </div>
                            <button
                                onClick={() => setShowContact(false)}
                                className="w-full py-3 text-xs tracking-widest uppercase text-white hover:opacity-90 transition-opacity"
                                style={{ backgroundColor: '#C9A84C' }}>
                                Envoyer la demande →
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {similar.length > 0 && (
                <section className="py-20 mt-8 border-t border-gray-200">
                    <div className="max-w-7xl mx-auto px-8 lg:px-16">
                        <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#C9A84C' }}>Suggestions IA</p>
                        <h2 className="text-3xl italic mb-10" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            Biens similaires
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {similar.map((p) => <SimilarCard key={p.id} property={p} />)}
                        </div>
                    </div>
                </section>
            )}

        </div>
    )
}