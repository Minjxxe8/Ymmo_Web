import {useState, useEffect} from 'react'
import {useNavigate, Link} from 'react-router-dom'
import {useAuth} from '../../context/AuthContext'
import {updateMe} from '../../api/auth.api'
import {getWallet} from '../../api/wallet.api'
import {getFavorites} from '../../api/favorite.api'

const DPE_COLORS = {A: '#00c04b', B: '#4caf50', C: '#ffeb3b', D: '#ff9800', E: '#ff5722', F: '#f44336', G: '#b71c1c'}
const ROLE_LABELS = {admin: 'Administrateur', agent: 'Agent immobilier', client: 'Client'}
const formatPrice = (p) => new Intl.NumberFormat('fr-FR').format(p) + ' €'

function FavoriteCard({property}) {
    const navigate = useNavigate()
    return (<div onClick={() => navigate(`/property/${property.id}`)}
                 className="cursor-pointer group flex gap-4 p-4 border border-gray-100 hover:border-gray-300 transition-colors bg-white">
        <div className="shrink-0 overflow-hidden"
             style={{width: '80px', height: '60px', backgroundColor: '#E8E4DC'}}>
            <div className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                 style={{backgroundColor: '#D4CFC7'}}/>
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs tracking-widest uppercase mb-0.5"
               style={{color: '#44474D'}}>{property.type.name} · {property.city}</p>
            <h4 className="text-sm italic truncate"
                style={{fontFamily: "'Cormorant Garamond', serif", color: '#0D1F3C'}}>{property.name}</h4>
            <p className="text-sm font-semibold mt-1" style={{color: '#C9A84C'}}>{formatPrice(property.price)}</p>
        </div>
        {property.diagnostic && (<div className="shrink-0 flex items-start pt-1">
          <span className="text-xs font-bold text-white px-1.5 py-0.5"
                style={{backgroundColor: DPE_COLORS[property.diagnostic]}}>
            {property.diagnostic}
          </span>
        </div>)}
    </div>)
}

function EditModal({user, onClose, onSave}) {
    const [form, setForm] = useState({
        firstName: user.name ?? '',
        lastName: user.lastname ?? '',
        email: user.email ?? '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            await onSave(form)
            onClose()
        } catch (err) {
            setError(err?.message ?? 'Une erreur est survenue.')
        } finally {
            setLoading(false)
        }
    }

    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                 style={{backgroundColor: 'rgba(13,31,60,0.7)'}}>
        <div className="bg-white p-8 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl italic" style={{fontFamily: "'Cormorant Garamond', serif"}}>Modifier mes
                    informations</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×
                </button>
            </div>

            {error && <p className="text-xs text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex gap-3">
                    {[['firstName', 'Prénom'], ['lastName', 'Nom']].map(([key, label]) => (
                        <div key={key} className="flex flex-col gap-1 flex-1">
                            <label className="text-xs tracking-widest uppercase"
                                   style={{color: '#44474D'}}>{label}</label>
                            <input
                                value={form[key]}
                                onChange={(e) => setForm({...form, [key]: e.target.value})}
                                className="border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors"
                                style={{color: '#0D1F3C'}}
                            />
                        </div>))}
                </div>
                {[['email', 'Email', 'email'], ['phone', 'Téléphone', 'tel']].map(([key, label, type]) => (
                    <div key={key} className="flex flex-col gap-1">
                        <label className="text-xs tracking-widest uppercase"
                               style={{color: '#44474D'}}>{label}</label>
                        <input
                            type={type}
                            value={form[key]}
                            onChange={(e) => setForm({...form, [key]: e.target.value})}
                            className="border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors"
                            style={{color: '#0D1F3C'}}
                        />
                    </div>))}
                <button type="submit" disabled={loading}
                        className="w-full py-3 text-xs tracking-widest uppercase text-white hover:opacity-90 disabled:opacity-60 transition-opacity mt-2"
                        style={{backgroundColor: '#C9A84C'}}>
                    {loading ? 'Enregistrement...' : 'Enregistrer les modifications →'}
                </button>
            </form>
        </div>
    </div>)
}

export default function ProfilePage() {
    const {user, login, accessToken, refreshToken} = useAuth()
    const navigate = useNavigate()

    const [wallet, setWallet] = useState(null)
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true)
    const [showEdit, setShowEdit] = useState(false)

    useEffect(() => {
        if (!user) {
            navigate('/auth');
            return
        }
        Promise.all([getWallet(), getFavorites()])
            .then(([w, favs]) => {
                setWallet(w)
                setFavorites(favs)
            })
            .finally(() => setLoading(false))
    }, [user])

    const handleSave = async (data) => {
        const updated = await updateMe(data)
        login(accessToken, refreshToken)
    }

    if (loading) {
        return (<div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#FCF9F4'}}>
            <div className="w-8 h-8 border-2 border-gray-200 border-t-yellow-600 rounded-full animate-spin"/>
        </div>)
    }

    const initials = `${user?.name?.charAt(0) ?? ''}${user?.lastname?.charAt(0) ?? ''}`.toUpperCase()

    return (<div className="min-h-screen"
                 style={{backgroundColor: '#FCF9F4', fontFamily: "'Space Grotesk', sans-serif", color: '#0D1F3C'}}>
        <div className="max-w-5xl mx-auto px-8 lg:px-16 py-16">

            <div className="mb-12">
                <p className="text-xs tracking-widest uppercase mb-2" style={{color: '#C9A84C'}}>Mon espace</p>
                <h1 className="text-4xl lg:text-5xl italic"
                    style={{fontFamily: "'Cormorant Garamond', 'Liberation Serif', serif"}}>
                    Profil
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                <div className="lg:col-span-1 flex flex-col gap-6">

                    <div className="bg-white border border-gray-100 p-8 flex flex-col items-center text-center">
                        <div
                            className="w-24 h-24 flex items-center justify-center text-white text-3xl font-semibold mb-4"
                            style={{backgroundColor: '#0D1F3C'}}>
                            {user?.avatar ? <img src={user.avatar} alt="avatar"
                                                 className="w-full h-full object-cover"/> : initials}
                        </div>

                        <h2 className="text-xl italic mb-1" style={{fontFamily: "'Cormorant Garamond', serif"}}>
                            {user?.name} {user?.lastname}
                        </h2>
                        <p className="text-sm mb-3" style={{color: '#44474D'}}>{user?.email}</p>

                        <span className="text-xs tracking-widest uppercase px-3 py-1 mb-6"
                              style={{backgroundColor: '#F4F0E8', color: '#C9A84C', border: '1px solid #C9A84C'}}>
                {ROLE_LABELS[user?.role] ?? user?.role}
              </span>

                        {user?.phone && (<p className="text-xs mb-4" style={{color: '#C5C6CE'}}>{user.phone}</p>)}

                        <button onClick={() => setShowEdit(true)}
                                className="w-full py-3 text-xs tracking-widest uppercase border hover:bg-gray-50 transition-colors"
                                style={{borderColor: '#C5C6CE', color: '#44474D'}}>
                            Modifier mes informations
                        </button>
                    </div>

                    <div className="bg-white border border-gray-100 p-6">
                        <p className="text-xs tracking-widest uppercase mb-4"
                           style={{color: '#C5C6CE'}}>Portefeuille</p>
                        <p className="text-3xl font-semibold mb-1" style={{color: '#C9A84C'}}>
                            {wallet ? new Intl.NumberFormat('fr-FR').format(wallet.balance) + ' €' : '—'}
                        </p>
                        <p className="text-xs mb-5" style={{color: '#C5C6CE'}}>Solde disponible</p>
                        <Link to="/wallet"
                              className="w-full flex items-center justify-center py-3 text-xs tracking-widest uppercase text-white hover:opacity-90 transition-opacity"
                              style={{backgroundColor: '#0D1F3C'}}>
                            Accéder au wallet →
                        </Link>
                    </div>

                </div>

                <div className="lg:col-span-2 flex flex-col gap-8">

                    <div className="bg-white border border-gray-100 p-8">
                        <h2 className="text-xl italic mb-6" style={{fontFamily: "'Cormorant Garamond', serif"}}>
                            Informations personnelles
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[['Prénom', user?.name], ['Nom', user?.lastname], ['Email', user?.email], ['Rôle', ROLE_LABELS[user?.role] ?? user?.role], ['Membre depuis', user?.createdAt.substring(0, user?.createdAt.indexOf("-"))],].map(([label, value]) => (
                                <div key={label} className="border-b border-gray-100 pb-4">
                                    <p className="text-xs tracking-widest uppercase mb-1"
                                       style={{color: '#C5C6CE'}}>{label}</p>
                                    <p className="text-sm font-medium">{value}</p>
                                </div>))}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl italic" style={{fontFamily: "'Cormorant Garamond', serif"}}>
                                Mes favoris
                            </h2>
                            <span className="text-xs tracking-widest uppercase px-3 py-1 border"
                                  style={{borderColor: '#C5C6CE', color: '#44474D'}}>
                  {favorites.length} bien{favorites.length > 1 ? 's' : ''}
                </span>
                        </div>

                        {favorites.length === 0 ? (<div className="bg-white border border-gray-100 py-12 text-center">
                            <p className="text-xl italic mb-2"
                               style={{fontFamily: "'Cormorant Garamond', serif"}}>Aucun favori</p>
                            <p className="text-xs mb-4" style={{color: '#C5C6CE'}}>Ajoutez des biens à vos
                                favoris depuis les annonces</p>
                            <Link to="/home" className="text-xs tracking-widest uppercase hover:underline"
                                  style={{color: '#C9A84C'}}>
                                Voir les annonces →
                            </Link>
                        </div>) : (<div className="flex flex-col gap-3">
                            {favorites.map((p) => <FavoriteCard key={p.property.id} property={p.property}/>)}
                        </div>)}
                    </div>

                </div>
            </div>
        </div>

        {showEdit && (<EditModal
            user={user}
            onClose={() => setShowEdit(false)}
            onSave={handleSave}
        />)}
    </div>)
}