import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../../context/AuthContext'
import {getWallet, deposit, withdraw} from '../../api/wallet.api'
import {getTransactions} from '../../api/transactions.api'

const formatPrice = (p) => new Intl.NumberFormat('fr-FR').format(Math.abs(p)) + ' €'
const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
})

const TYPE_LABELS = {deposit: 'Dépôt', withdrawal: 'Retrait', purchase: 'Achat'}
const TYPE_COLORS = {deposit: '#009886', withdrawal: '#ff5722', purchase: '#C9A84C'}
const STATUS_BG = {completed: '#e6f7f5', pending: '#fff8e6', failed: '#fff0f0'}
const STATUS_COLOR = {completed: '#009886', pending: '#C9A84C', failed: '#ff5722'}

function TransactionRow({tx, isOpen, onToggle}) {
    return (<div className="border-b border-gray-100 last:border-0">
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between py-5 text-left hover:bg-gray-50 transition-colors px-2"
        >
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center shrink-0"
                     style={{backgroundColor: `${TYPE_COLORS.purchase}18`}}>
            <span className="text-lg">
              {tx.type === 'deposit' ? '↓' : tx.type === 'withdrawal' ? '↑' : '🏠'}
            </span>
                </div>
                <div>
                    <p className="text-sm font-medium" style={{color: '#0D1F3C'}}>
                        {tx.properties.name ?? TYPE_LABELS[tx.type]}
                    </p>
                    <p className="text-xs mt-0.5" style={{color: '#C5C6CE'}}>
                        {formatDate(tx.createdAt)}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">
          <span className="text-xs px-2 py-1"
                style={{
                    backgroundColor: tx.properties.onSale ? STATUS_BG.pending : STATUS_BG.completed,
                    color: tx.properties.onSale ? STATUS_COLOR.pending : STATUS_COLOR.completed
                }}>
            {tx.properties.onSale ? "En vente" : "Vendu"}
          </span>
                <span className="text-base font-semibold w-28 text-right"
                      style={{color: '#0D1F3C'}}>
            {formatPrice(tx.amount)}
          </span>
                <span className="text-xs ml-2 transition-transform duration-200"
                      style={{
                          color: '#C5C6CE',
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          display: 'inline-block'
                      }}>
            ▾
          </span>
            </div>
        </button>

        {isOpen && (<div className="px-4 pb-5 pt-1">
            <div className="border border-gray-100 p-5" style={{backgroundColor: '#F9F7F3'}}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-xs tracking-widest uppercase mb-1"
                           style={{color: '#C5C6CE'}}>Référence</p>
                        <p className="text-sm font-medium">YMM-{String(tx.properties.id).padStart(5, '0')}</p>
                    </div>
                    <div>
                        <p className="text-xs tracking-widest uppercase mb-1"
                           style={{color: '#C5C6CE'}}>Type</p>
                        <p className="text-sm font-medium">{TYPE_LABELS.purchase}</p>
                    </div>
                    <div>
                        <p className="text-xs tracking-widest uppercase mb-1"
                           style={{color: '#C5C6CE'}}>Montant</p>
                        <p className="text-sm font-semibold"
                           style={{color: '#0D1F3C'}}>
                            {formatPrice(tx.amount)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs tracking-widest uppercase mb-1"
                           style={{color: '#C5C6CE'}}>Statut</p>
                        <span className="text-xs px-2 py-1"
                              style={{
                                  backgroundColor: STATUS_BG[tx.properties.onSale],
                                  color: STATUS_COLOR[tx.properties.onSale]
                              }}>
                  {tx.properties.onSale ? "En vente" : "Vendu"}
                </span>
                    </div>

                    {tx.properties.name && (<>
                        <div>
                            <p className="text-xs tracking-widest uppercase mb-1"
                               style={{color: '#C5C6CE'}}>Bien</p>
                            <p className="text-sm font-medium">{tx.properties.name}</p>
                        </div>
                        <div>
                            <p className="text-xs tracking-widest uppercase mb-1"
                               style={{color: '#C5C6CE'}}>Ville</p>
                            <p className="text-sm">{tx.properties.city}</p>
                        </div>
                    </>)}

                    {tx.note && (<div className="col-span-2 md:col-span-4">
                        <p className="text-xs tracking-widest uppercase mb-1"
                           style={{color: '#C5C6CE'}}>Note</p>
                        <p className="text-sm" style={{color: '#44474D'}}>{tx.note}</p>
                    </div>)}
                </div>
            </div>
        </div>)}
    </div>)
}

function AmountModal({type, onClose, onConfirm}) {
    const [amount, setAmount] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!amount || Number(amount) <= 0) {
            setError('Montant invalide.');
            return
        }
        setLoading(true)
        setError(null)
        try {
            await onConfirm(Number(amount))
            onClose()
        } catch (err) {
            setError(err?.message ?? 'Une erreur est survenue.')
        } finally {
            setLoading(false)
        }
    }

    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                 style={{backgroundColor: 'rgba(13,31,60,0.7)'}}>
        <div className="bg-white p-8 w-full max-w-sm shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl italic" style={{fontFamily: "'Cormorant Garamond', serif"}}>
                    {type === 'deposit' ? 'Effectuer un dépôt' : 'Effectuer un retrait'}
                </h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×
                </button>
            </div>

            {error && <p className="text-xs text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-xs tracking-widest uppercase" style={{color: '#44474D'}}>Montant
                        (€)</label>
                    <input
                        type="number"
                        min="1"
                        step="100"
                        value={amount}
                        onChange={(e) => {
                            setAmount(e.target.value);
                            setError(null)
                        }}
                        placeholder="0"
                        className="border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors"
                        style={{color: '#0D1F3C'}}
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {[1000, 5000, 10000, 20000].map((v) => (
                        <button key={v} type="button" onClick={() => setAmount(String(v))}
                                className="text-xs px-3 py-1.5 border hover:bg-gray-50 transition-colors"
                                style={{borderColor: '#C5C6CE', color: '#44474D'}}>
                            {v.toLocaleString('fr-FR')} €
                        </button>))}
                </div>
                <button type="submit" disabled={loading}
                        className="w-full py-3 text-xs tracking-widest uppercase text-white hover:opacity-90 disabled:opacity-60 transition-opacity mt-2"
                        style={{backgroundColor: type === 'deposit' ? '#009886' : '#C9A84C'}}>
                    {loading ? 'Traitement...' : type === 'deposit' ? 'Confirmer le dépôt →' : 'Confirmer le retrait →'}
                </button>
            </form>
        </div>
    </div>)
}

export default function WalletPage() {
    const {user} = useAuth()
    const navigate = useNavigate()

    const [wallet, setWallet] = useState(null)
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [openTx, setOpenTx] = useState(null)
    const [modal, setModal] = useState(null)

    useEffect(() => {
        if (!user) {
            navigate('/auth');
            return
        }
        Promise.all([getWallet(), getTransactions()])
            .then(([w, txs]) => {
                setWallet(w);
                setTransactions(txs)
            })
            .finally(() => setLoading(false))
    }, [user])

    const handleDeposit = async (amount) => {
        const updated = await deposit({balance: amount})
        setWallet(updated)
    }

    const handleWithdraw = async (amount) => {
        const updated = await withdraw({balance: amount})
        setWallet(updated)
    }

    const totalPurchases = Array.isArray(transactions) && transactions.reduce((acc, t) => acc + Math.abs(t.amount), 0)

    if (loading) {
        return (<div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#FCF9F4'}}>
            <div className="w-8 h-8 border-2 border-gray-200 border-t-yellow-600 rounded-full animate-spin"/>
        </div>)
    }

    return (<div className="min-h-screen"
                 style={{backgroundColor: '#FCF9F4', fontFamily: "'Space Grotesk', sans-serif", color: '#0D1F3C'}}>
        <div className="max-w-5xl mx-auto px-8 lg:px-16 py-16">

            <div className="mb-12">
                <p className="text-xs tracking-widest uppercase mb-2" style={{color: '#C9A84C'}}>Mon espace</p>
                <h1 className="text-4xl lg:text-5xl italic"
                    style={{fontFamily: "'Cormorant Garamond', 'Liberation Serif', serif"}}>
                    Portefeuille
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                <div className="lg:col-span-1 p-8 flex flex-col justify-between"
                     style={{backgroundColor: '#0D1F3C', minHeight: '200px'}}>
                    <div>
                        <p className="text-xs tracking-widest uppercase mb-6" style={{color: '#C5C6CE'}}>Solde
                            disponible</p>
                        <p className="text-4xl font-semibold" style={{color: '#C9A84C'}}>
                            {new Intl.NumberFormat('fr-FR').format(wallet?.balance ?? 0)} €
                        </p>
                    </div>
                    <p className="text-xs mt-4" style={{color: '#C5C6CE'}}>
                        {user?.firstName} {user?.lastName}
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <button onClick={() => setModal('deposit')}
                            className="flex-1 flex flex-col items-center justify-center gap-2 border-2 border-dashed hover:bg-gray-50 transition-colors py-6"
                            style={{borderColor: '#009886'}}>
                        <span className="text-2xl" style={{color: '#009886'}}>↓</span>
                        <span className="text-xs tracking-widest uppercase"
                              style={{color: '#009886'}}>Déposer des fonds</span>
                    </button>
                    <button onClick={() => setModal('withdrawal')}
                            className="flex-1 flex flex-col items-center justify-center gap-2 border-2 border-dashed hover:bg-gray-50 transition-colors py-6"
                            style={{borderColor: '#C9A84C'}}>
                        <span className="text-2xl" style={{color: '#C9A84C'}}>↑</span>
                        <span className="text-xs tracking-widest uppercase"
                              style={{color: '#C9A84C'}}>Retirer des fonds</span>
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    {[['Total dépensé', totalPurchases, '#C9A84C'], ['Transactions', transactions.length, '#0D1F3C'],].map(([label, value, color]) => (
                        <div key={label} className="flex-1 border border-gray-200 p-4 flex flex-col justify-between"
                             style={{backgroundColor: 'white'}}>
                            <p className="text-xs tracking-widest uppercase" style={{color: '#C5C6CE'}}>{label}</p>
                            <p className="text-xl font-semibold mt-2" style={{color}}>
                                {typeof value === 'number' && label !== 'Transactions' ? `${new Intl.NumberFormat('fr-FR').format(value)} €` : value}
                            </p>
                        </div>))}
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl italic" style={{fontFamily: "'Cormorant Garamond', serif"}}>
                        Historique des transactions
                    </h2>
                    <span className="text-xs tracking-widets uppercase px-3 py-1 border"
                          style={{borderColor: '#C5C6CE', color: '#44474D'}}>
              {transactions.length} opération{transactions.length > 1 ? 's' : ''}
            </span>
                </div>

                <div className="bg-white border border-gray-100">
                    {transactions.length === 0 ? (<div className="py-16 text-center">
                        <p className="text-xl italic mb-2"
                           style={{fontFamily: "'Cormorant Garamond', serif"}}>Aucune transaction</p>
                        <p className="text-xs" style={{color: '#C5C6CE'}}>Vos opérations apparaîtront ici</p>
                    </div>) : (transactions.map((tx) => (<TransactionRow
                        key={tx.id}
                        tx={tx}
                        isOpen={openTx === tx.id}
                        onToggle={() => setOpenTx(openTx === tx.id ? null : tx.id)}
                    />)))}
                </div>
            </div>

        </div>

        {modal && (<AmountModal
            type={modal}
            onClose={() => setModal(null)}
            onConfirm={modal === 'deposit' ? handleDeposit : handleWithdraw}
        />)}
    </div>)
}