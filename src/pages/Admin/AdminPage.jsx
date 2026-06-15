import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../../context/AuthContext'
import {
    getProperties, createProperty, updateProperty, deleteProperty, updatePropertyStatus, getPropertyTypes
} from '../../api/properties.api'
import {getTransactions} from '../../api/transactions.api'
import {deleteUser, getUsers, toggleRoleUser} from "../../api/user.api.js";

const DPE_OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
const formatPrice = (p) => new Intl.NumberFormat('fr-FR').format(p) + ' €'
const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR')

const EMPTY_FORM = {
    title: '',
    description: '',
    price: '',
    surface: '',
    rooms: '',
    bathrooms: '',
    type: '',
    city: '',
    area: '',
    address: '',
    diagnostic: 'C',
    ges: 'C',
    status: 'available',
}

function StatCard({label, value, sub, color}) {
    return (<div className="bg-white border border-gray-100 p-6">
        <p className="text-xs tracking-widest uppercase mb-3" style={{color: '#C5C6CE'}}>{label}</p>
        <p className="text-3xl font-semibold" style={{color: color ?? '#0D1F3C'}}>{value}</p>
        {sub && <p className="text-xs mt-1" style={{color: '#C5C6CE'}}>{sub}</p>}
    </div>)
}

function PropertyFormModal({initial, onClose, onSave}) {
    const [form, setForm] = useState(initial ?? EMPTY_FORM)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [types, setTypes] = useState([])

    useEffect(() => {
        getPropertyTypes().then((types) => setTypes(types))
        if (initial) {
            setForm((f) => ({
                ...f,
                ...initial,
                type: initial.type?.id ? String(initial.type.id) : (initial.type ? String(initial.type) : f.type),
                surface: initial.surfaceArea ?? initial.surface ?? f.surface,
                rooms: initial.roomCount ?? initial.rooms ?? f.rooms,
            }))
        }
    }, [initial])


    const set = (k, v) => setForm((f) => ({...f, [k]: v}))

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

    const fields = [{key: 'name', label: 'Titre', type: 'text', span: 2}, {
        key: 'price',
        label: 'Prix (€)',
        type: 'number'
    }, {key: 'surface', label: 'Surface (m²)', type: 'number'}, {
        key: 'rooms',
        label: 'Pièces',
        type: 'number'
    }, {key: 'country', label: 'Pays', type: 'text'}, {key: 'city', label: 'Ville', type: 'text'}, {
        key: 'area',
        label: 'Quartier',
        type: 'text'
    }, {key: 'address', label: 'Adresse', type: 'text', span: 2},]

    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
                 style={{backgroundColor: 'rgba(13,31,60,0.7)'}}>
        <div className="bg-white p-8 w-full max-w-2xl shadow-xl my-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl italic" style={{fontFamily: "'Cormorant Garamond', serif"}}>
                    {initial ? 'Modifier le bien' : 'Ajouter un bien'}
                </h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×
                </button>
            </div>

            {error && <p className="text-xs text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                    {fields.map(({key, label, type, span}) => (
                        <div key={key} className={`flex flex-col gap-1 ${span === 2 ? 'col-span-2' : ''}`}>
                            <label className="text-xs tracking-widest uppercase"
                                   style={{color: '#44474D'}}>{label}</label>
                            <input type={type} value={form[key]} onChange={(e) => set(key, e.target.value)} required
                                   className="border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors"
                                   style={{color: '#0D1F3C'}}/>
                        </div>))}

                    {[['diagnostic', 'DPE', DPE_OPTIONS]].map(([key, label, opts]) => (
                        <div key={key} className="flex flex-col gap-1">
                            <label className="text-xs tracking-widest uppercase"
                                   style={{color: '#44474D'}}>{label}</label>
                            <select value={form[key]} onChange={(e) => set(key, e.target.value)}
                                    className="border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400 bg-white"
                                    style={{color: '#0D1F3C'}}>
                                {opts.map((o) => <option key={o}>{o}</option>)}
                            </select>
                        </div>))}

                    <div className="flex flex-col gap-1">
                        <label className="text-xs tracking-widest uppercase" style={{color: '#44474D'}}>Type</label>
                        <select value={form.type} onChange={(e) => set('type', e.target.value)}
                                className="border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400 bg-white"
                                style={{color: '#0D1F3C'}}>
                            <option value="">Choisir un type</option>
                            {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1 col-span-2">
                        <label className="text-xs tracking-widest uppercase"
                               style={{color: '#44474D'}}>Description</label>
                        <textarea rows={3} value={form.description}
                                  onChange={(e) => set('description', e.target.value)}
                                  className="border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400 resize-none"
                                  style={{color: '#0D1F3C'}}/>
                    </div>
                </div>

                <button type="submit" disabled={loading}
                        className="w-full py-3 text-xs tracking-widest uppercase text-white hover:opacity-90 disabled:opacity-60 transition-opacity mt-2"
                        style={{backgroundColor: '#C9A84C'}}>
                    {loading ? 'Enregistrement...' : initial ? 'Enregistrer les modifications →' : 'Ajouter le bien →'}
                </button>
            </form>
        </div>
    </div>)
}

const TABS = [{id: 'properties', label: 'Biens'}, {id: 'users', label: 'Utilisateurs'}, {
    id: 'stats',
    label: 'Dashboard'
},]

export default function AdminPage() {
    const {user} = useAuth()
    const navigate = useNavigate()

    const [tab, setTab] = useState('properties')
    const [properties, setProperties] = useState([])
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(null)
    const [editTarget, setEditTarget] = useState(null)
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [types, setTypes] = useState([])
    const [users, setUsers] = useState([])

    useEffect(() => {
        if (!user || (user.role !== 'admin' && user.role !== 'agent')) {
            navigate('/');
            return
        }
        Promise.all([getProperties(), getTransactions()])
            .then(([props, txs]) => {
                setProperties(props);
                setTransactions(txs)
            })
            .finally(() => setLoading(false))
        getPropertyTypes().then((types) => setTypes(types))

        getUsers().then((users) => setUsers(users))
    }, [user])

    const handleCreate = async (form) => {
        let typeId = Number(form.type)
        if (isNaN(typeId)) {
            const selectedType = types && types.find((t) => t.name === form.type)
            typeId = selectedType ? selectedType.id : null
        }

        const payload = {
            name: form.name,
            typeId: typeId,
            price: Number(form.price),
            surfaceArea: Number(form.surface),
            roomCount: Number(form.rooms),
            diagnostic: form.diagnostic,
            country: form.country,
            city: form.city,
            area: form.area,
            onSale: true
        }

        console.log('Creating property payload:', payload)

        const created = await createProperty(payload)
        setProperties((p) => [...p, created])
    }

    const handleUpdate = async (form) => {
        const updated = await updateProperty(editTarget.id, form)
        setProperties((p) => p.map((x) => x.id === editTarget.id ? {...x, ...updated} : x))
        setEditTarget(null)
    }

    const handleDelete = async (id) => {
        await deleteProperty(id)
        setProperties((p) => p.filter((x) => x.id !== id))
        setConfirmDelete(null)
    }

    const handleMarkSold = async (id) => {
        await updatePropertyStatus(id, 'sold')
        setProperties((p) => p.map((x) => x.id === id ? {...x, status: 'sold'} : x))
    }

    const soldCount = properties.filter((p) => !p.onSale).length
    const availableCount = properties.filter((p) => !p.onSale).length
    const totalRevenue = properties.filter((p) => !p.onSale).reduce((acc, p) => acc + Math.abs(p.price), 0)

    if (loading) {
        return (<div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#FCF9F4'}}>
            <div className="w-8 h-8 border-2 border-gray-200 border-t-yellow-600 rounded-full animate-spin"/>
        </div>)
    }

    return (<div className="min-h-screen"
                 style={{backgroundColor: '#FCF9F4', fontFamily: "'Space Grotesk', sans-serif", color: '#0D1F3C'}}>
        <div className="max-w-7xl mx-auto px-8 lg:px-16 py-16">

            <div className="mb-10">
                <p className="text-xs tracking-widest uppercase mb-2" style={{color: '#C9A84C'}}>
                    {user?.role === 'admin' ? 'Administration' : 'Espace Agent'}
                </p>
                <h1 className="text-4xl lg:text-5xl italic"
                    style={{fontFamily: "'Cormorant Garamond', 'Liberation Serif', serif"}}>
                    {user?.role === 'admin' ? 'Dashboard Admin' : 'Mes Biens'}
                </h1>
            </div>

            <div className="flex gap-1 mb-10 border-b border-gray-200">
                {TABS.filter((t) => t.id !== 'users' || user?.role === 'admin').map((t) => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                            className="px-6 py-3 text-xs tracking-widest uppercase transition-colors border-b-2 -mb-px"
                            style={{
                                borderBottomColor: tab === t.id ? '#C9A84C' : 'transparent',
                                color: tab === t.id ? '#0D1F3C' : '#C5C6CE',
                            }}>
                        {t.label}
                    </button>))}
            </div>

            {tab === 'properties' && (<div>
                <div className="flex justify-between items-center mb-6">
                    <p className="text-xs tracking-widest uppercase" style={{color: '#44474D'}}>
                        {properties.length} bien{properties.length > 1 ? 's' : ''}
                    </p>
                    <button onClick={() => setModal('create')}
                            className="px-6 py-2.5 text-xs tracking-widest uppercase text-white hover:opacity-90 transition-opacity"
                            style={{backgroundColor: '#C9A84C'}}>
                        + Ajouter un bien
                    </button>
                </div>

                <div className="bg-white border border-gray-100 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="border-b border-gray-100">
                            {['Bien', 'Ville', 'Prix', 'Surface', 'DPE', 'Statut', 'Actions'].map((h) => (
                                <th key={h} className="text-left px-5 py-4 text-xs tracking-widest uppercase"
                                    style={{color: '#C5C6CE'}}>{h}</th>))}
                        </tr>
                        </thead>
                        <tbody>
                        {properties.map((p) => (<tr key={p.id}
                                                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-4">
                                <p className="italic text-sm"
                                   style={{fontFamily: "'Cormorant Garamond', serif"}}>{p.name}</p>
                                <p className="text-xs capitalize"
                                   style={{color: '#C5C6CE'}}>{p.type.name}</p>
                            </td>
                            <td className="px-5 py-4 text-sm" style={{color: '#44474D'}}>{p.city}</td>
                            <td className="px-5 py-4 text-sm font-semibold"
                                style={{color: '#C9A84C'}}>{formatPrice(p.price)}</td>
                            <td className="px-5 py-4 text-sm" style={{color: '#44474D'}}>{p.surface} m²</td>
                            <td className="px-5 py-4">
                        <span className="text-xs font-bold text-white px-2 py-0.5"
                              style={{
                                  backgroundColor: {
                                      A: '#00c04b',
                                      B: '#4caf50',
                                      C: '#ffeb3b',
                                      D: '#ff9800',
                                      E: '#ff5722',
                                      F: '#f44336',
                                      G: '#b71c1c'
                                  }[p.diagnostic]
                              }}>
                          {p.diagnostic}
                        </span>
                            </td>
                            <td className="px-5 py-4">
                        <span className="text-xs px-2 py-1"
                              style={{
                                  backgroundColor: p.onSale ? '#e6f7f5' : '#f0f0f0',
                                  color: p.onSale ? '#009886' : '#44474D',
                              }}>
                          {p.onSale ? 'Disponible' : 'Vendu'}
                        </span>
                            </td>
                            <td className="px-5 py-4">
                                <div className="flex gap-3">
                                    <button onClick={() => {
                                        setEditTarget(p);
                                        setModal('edit')
                                    }}
                                            className="text-xs hover:underline"
                                            style={{color: '#009886'}}>Modifier
                                    </button>
                                    {p.status === 'available' && (
                                        <button onClick={() => handleMarkSold(p.id)}
                                                className="text-xs hover:underline"
                                                style={{color: '#C9A84C'}}>Vendu</button>)}
                                    <button onClick={() => setConfirmDelete(p.id)}
                                            className="text-xs hover:underline"
                                            style={{color: '#ff5722'}}>Supprimer
                                    </button>
                                </div>
                            </td>
                        </tr>))}
                        </tbody>
                    </table>
                </div>
            </div>)}

            {tab === 'users' && user?.role === 'admin' && (
                <div className="bg-white border border-gray-100 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="border-b border-gray-100">
                            {['Utilisateur', 'Email', 'Rôle', 'Membre depuis', "Actions"].map((h) => (
                                <th key={h} className="text-left px-5 py-4 text-xs tracking-widest uppercase"
                                    style={{color: '#C5C6CE'}}>{h}</th>))}
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((u) => (
                            <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-8 h-8 flex items-center justify-center text-white text-xs font-semibold shrink-0"
                                            style={{backgroundColor: '#0D1F3C'}}>
                                            {u.name.charAt(0)}{u.lastname.charAt(0)}
                                        </div>
                                        <p className="text-sm font-medium">{u.name} {u.lastname}</p>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-sm" style={{color: '#44474D'}}>{u.email}</td>
                                <td className="px-5 py-4">
                      <span className="text-xs px-2 py-1"
                            style={{
                                backgroundColor: u.role === 'admin' ? '#fff0e6' : u.role === 'agent' ? '#e6f7f5' : '#f4f0e8',
                                color: u.role === 'admin' ? '#ff5722' : u.role === 'agent' ? '#009886' : '#C9A84C',
                            }}>
                        {u.role}
                      </span>
                                </td>
                                <td className="px-5 py-4 text-sm"
                                    style={{color: '#44474D'}}>{formatDate(u.createdAt)}</td>
                                {u.role !== "admin" && <td className="px-5 py-4">
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => toggleRoleUser(u.id).then(() => setUsers(users.map((x) => x.id === u.id ? {
                                                ...x,
                                                role: u.role === "user" ? "agent" : "user"
                                            } : x)))}
                                            className="text-xs hover:underline"
                                            style={{color: '#009886'}}>{u.role === "user" ? "Changer En Agent" : "Changer En Utilisateur"}
                                        </button>
                                        <button onClick={() => {
                                            deleteUser(u.id).then(() => setUsers(users.filter((x) => x.id !== u.id)))
                                        }}
                                                className="text-xs hover:underline"
                                                style={{color: '#ff5722'}}>Supprimer
                                        </button>
                                    </div>
                                </td>}
                            </tr>))}
                        </tbody>
                    </table>
                </div>)}

            {tab === 'stats' && (<div className="flex flex-col gap-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <StatCard label="Total biens" value={properties.length} sub="dans le catalogue"/>
                    <StatCard label="Biens disponibles" value={availableCount} color="#009886"/>
                    <StatCard label="Biens vendus" value={soldCount} color="#C9A84C"/>
                    <StatCard label="Volume transactions" value={formatPrice(totalRevenue)}
                              sub={`${transactions.length} opérations`} color="#C9A84C"/>
                </div>

                <div className="bg-white border border-gray-100 p-8">
                    <h2 className="text-xl italic mb-6" style={{fontFamily: "'Cormorant Garamond', serif"}}>
                        Dernières transactions
                    </h2>
                    <div className="flex flex-col gap-0">
                        {transactions.slice(0, 5).map((tx) => (<div key={tx.id}
                                                                    className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0">
                            <div>
                                <p className="text-sm font-medium">{tx.properties.name ?? (tx.type === 'deposit' ? 'Dépôt' : 'Retrait')}</p>
                                <p className="text-xs mt-0.5"
                                   style={{color: '#C5C6CE'}}>{formatDate(tx.createdAt)} ·
                                    Réf. {`YMM-${String(tx.properties.id).padStart(5, '0')}`}</p>
                            </div>
                            <span className="text-sm font-semibold"
                                  style={{color: '#C9A84C'}}>
                      {formatPrice(tx.amount)}
                    </span>
                        </div>))}
                    </div>
                </div>

                <div className="bg-white border border-gray-100 p-8">
                    <h2 className="text-xl italic mb-6" style={{fontFamily: "'Cormorant Garamond', serif"}}>
                        Répartition par type
                    </h2>
                    <div className="flex flex-col gap-3">
                        {types.map((t) => {
                            const typeName = typeof t === 'string' ? t : t.name
                            const count = properties.filter((p) => (p.type?.name ?? p.type) === typeName).length
                            const pct = properties.length > 0 ? Math.round((count / properties.length) * 100) : 0
                            return (<div key={typeName} className="flex items-center gap-4">
                                <p className="text-xs tracking-widest uppercase w-24 shrink-0"
                                   style={{color: '#44474D'}}>{typeName}</p>
                                <div className="flex-1 h-2 bg-gray-100">
                                    <div className="h-full transition-all duration-500"
                                         style={{width: `${pct}%`, backgroundColor: '#C9A84C'}}/>
                                </div>
                                <p className="text-xs w-8 text-right" style={{color: '#C5C6CE'}}>{count}</p>
                            </div>)
                        })}
                    </div>
                </div>
            </div>)}

        </div>

        {(modal === 'create' || modal === 'edit') && (<PropertyFormModal
            initial={modal === 'edit' ? editTarget : null}
            onClose={() => {
                setModal(null);
                setEditTarget(null)
            }}
            onSave={modal === 'create' ? handleCreate : handleUpdate}
        />)}

        {confirmDelete && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                                style={{backgroundColor: 'rgba(13,31,60,0.7)'}}>
            <div className="bg-white p-8 w-full max-w-sm shadow-xl text-center">
                <h3 className="text-xl italic mb-3"
                    style={{fontFamily: "'Cormorant Garamond', serif"}}>Confirmer la suppression</h3>
                <p className="text-sm mb-6" style={{color: '#44474D'}}>Cette action est irréversible.</p>
                <div className="flex gap-3">
                    <button onClick={() => setConfirmDelete(null)}
                            className="flex-1 py-3 text-xs tracking-widest uppercase border hover:bg-gray-50 transition-colors"
                            style={{borderColor: '#C5C6CE', color: '#44474D'}}>
                        Annuler
                    </button>
                    <button onClick={() => handleDelete(confirmDelete)}
                            className="flex-1 py-3 text-xs tracking-widest uppercase text-white hover:opacity-90 transition-opacity"
                            style={{backgroundColor: '#ff5722'}}>
                        Supprimer
                    </button>
                </div>
            </div>
        </div>)}
    </div>)
}