import {useState} from 'react'
import {useNavigate, Link} from 'react-router-dom'
import {useAuth} from '../../context/AuthContext'
import {login as loginApi, register as registerApi} from '../../api/auth.api'

export default function AuthPage() {
    const {login} = useAuth()
    const navigate = useNavigate()

    const [mode, setMode] = useState('login')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        email: '',
        name: '',
        surname: '',
        unhashedPassword: '',
    })

    const fillMock = (userIndex) => {
        const users = [
            {email: 'lena@heritage.com', password: 'password'},
            {email: 'noah@heritage.com', password: 'password'},
            {email: 'emma@heritage.com', password: 'password'},
        ]
        setForm((f) => ({...f, ...users[userIndex]}))
        setError(null)
    }

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value})
        setError(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            if (mode === 'login') {
                const res = await loginApi({email: form.email, password: form.password})
                login(res.accessToken, res.refreshToken)

            } else {
                const res = await registerApi({
                    email: form.email,
                    name: form.firstName,
                    surname: form.lastName,
                    unhashedPassword: form.password
                })
                login(res.accessToken, res.refreshToken)
            }
            navigate('/home')
        } catch (err) {
            setError(err?.message ?? 'Identifiants incorrects.')
        } finally {
            setLoading(false)
        }
    }

    const isMock = import.meta.env.VITE_MOCK === 'true'

    return (
        <div className="min-h-screen flex"
             style={{backgroundColor: '#FCF9F4', fontFamily: "'Space Grotesk', sans-serif"}}>

            <div className="hidden lg:flex flex-1 flex-col justify-between p-16" style={{backgroundColor: '#0D1F3C'}}>
                <Link to="/"
                      className="flex items-center gap-2 text-white text-lg tracking-widest uppercase font-semibold">
                    <span>🏛</span> Ymmo
                </Link>
                <div>
                    <h2 className="text-5xl xl:text-6xl italic leading-tight mb-6"
                        style={{fontFamily: "'Cormorant Garamond', 'Liberation Serif', serif", color: '#FCF9F4'}}>
                        L'Excellence<br/>Immobilière<br/>à votre service.
                    </h2>
                    <p className="text-sm tracking-wide leading-relaxed max-w-sm" style={{color: '#C5C6CE'}}>
                        Accédez aux meilleures opportunités immobilières, analysées par notre intelligence artificielle.
                    </p>
                </div>
                <div className="flex gap-8">
                    <div className="flex flex-col gap-1">
                        <span className="text-2xl font-semibold" style={{color: '#C9A84C'}}>+4 200</span>
                        <span className="text-xs tracking-widest uppercase"
                              style={{color: '#C5C6CE'}}>Biens vendus</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-2xl font-semibold" style={{color: '#C9A84C'}}>12</span>
                        <span className="text-xs tracking-widest uppercase" style={{color: '#C5C6CE'}}>Agences nationales</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-2xl font-semibold" style={{color: '#C9A84C'}}>98%</span>
                        <span className="text-xs tracking-widest uppercase" style={{color: '#C5C6CE'}}>Clients satisfaits</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 lg:max-w-lg flex flex-col justify-between p-8 lg:p-16">
                <div className="lg:hidden flex justify-center mb-8">
                    <Link to="/" className="flex items-center gap-2 text-lg tracking-widest uppercase font-semibold"
                          style={{color: '#0D1F3C'}}>
                        <span>🏛</span> Ymmo
                    </Link>
                </div>

                <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
                    <div className="mb-10">
                        <h1 className="text-4xl italic mb-3 leading-snug"
                            style={{fontFamily: "'Cormorant Garamond', 'Liberation Serif', serif", color: '#0D1F3C'}}>
                            {mode === 'login' ? 'Bienvenue dans votre\nEspace Héritage' : 'Créez votre\nEspace Héritage'}
                        </h1>
                        <p className="text-sm" style={{color: '#44474D'}}>
                            {mode === 'login' ? 'Accédez à votre portefeuille immobilier.' : 'Rejoignez la plateforme Ymmo.'}
                        </p>
                    </div>

                    {isMock && mode === 'login' && (
                        <div className="mb-5 p-3 border border-dashed border-amber-300 bg-amber-50 rounded">
                            <p className="text-xs font-medium mb-2" style={{color: '#C9A84C'}}>Mode mock — connexion
                                rapide</p>
                            <div className="flex gap-2 flex-wrap">
                                {[['Admin', 0], ['Agent', 1], ['Client', 2]].map(([label, i]) => (
                                    <button
                                        key={label}
                                        onClick={() => fillMock(i)}
                                        className="text-xs px-3 py-1 border border-amber-300 hover:bg-amber-100 transition-colors"
                                        style={{color: '#0D1F3C'}}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-white p-8 shadow-sm">
                        {error && <p className="text-xs text-red-500 mb-4">{error}</p>}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            {mode === 'register' && (
                                <div className="flex gap-3">
                                    <div className="flex flex-col gap-1 flex-1">
                                        <label className="text-xs tracking-widest uppercase"
                                               style={{color: '#44474D'}}>Prénom</label>
                                        <input name="firstName" value={form.firstName} onChange={handleChange}
                                               placeholder="Jean" required
                                               className="border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors w-full"
                                               style={{color: '#0D1F3C'}}/>
                                    </div>
                                    <div className="flex flex-col gap-1 flex-1">
                                        <label className="text-xs tracking-widest uppercase"
                                               style={{color: '#44474D'}}>Nom</label>
                                        <input name="lastName" value={form.lastName} onChange={handleChange}
                                               placeholder="Dupont" required
                                               className="border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors w-full"
                                               style={{color: '#0D1F3C'}}/>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col gap-1">
                                <label className="text-xs tracking-widest uppercase" style={{color: '#44474D'}}>Identifiant
                                    email</label>
                                <input name="email" type="email" value={form.email} onChange={handleChange}
                                       placeholder="nom@heritage.com" required
                                       className="border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors"
                                       style={{color: '#0D1F3C'}}/>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs tracking-widest uppercase" style={{color: '#44474D'}}>Clé
                                    d'accès</label>
                                <input name="password" type="password" value={form.password} onChange={handleChange}
                                       placeholder="••••••••" required
                                       className="border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors"
                                       style={{color: '#0D1F3C'}}/>
                            </div>

                            <button type="submit" disabled={loading}
                                    className="w-full py-3 text-xs tracking-widest uppercase text-white transition-opacity hover:opacity-90 disabled:opacity-60 mt-1"
                                    style={{backgroundColor: '#C9A84C'}}>
                                {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter →' : 'Créer mon compte →'}
                            </button>
                        </form>

                        <div className="flex justify-between items-center mt-4">
                            {mode === 'login' ? (
                                <>
                                    <button className="text-xs tracking-wide" style={{color: '#009886'}}>Mot de passe
                                        oublié ?
                                    </button>
                                    <button onClick={() => setMode('register')}
                                            className="text-xs tracking-widest uppercase"
                                            style={{color: '#0D1F3C'}}>Créer un compte
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => setMode('login')}
                                        className="text-xs tracking-widest uppercase ml-auto"
                                        style={{color: '#0D1F3C'}}>Déjà un compte ?</button>
                            )}
                        </div>

                        <div className="flex items-center gap-3 my-6">
                            <div className="flex-1 h-px bg-gray-100"/>
                            <span className="text-xs tracking-widest" style={{color: '#C5C6CE'}}>OU</span>
                            <div className="flex-1 h-px bg-gray-100"/>
                        </div>

                        <button
                            className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 text-xs tracking-widest uppercase hover:border-gray-400 transition-colors"
                            style={{color: '#0D1F3C'}}>
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="#4285F4"
                                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853"
                                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05"
                                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                                <path fill="#EA4335"
                                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Continuer avec Google
                        </button>
                    </div>

                    <div className="flex gap-8 mt-8">
                        <div className="flex items-center gap-2">
                            <span style={{color: '#009886'}}>🛡</span>
                            <span className="text-xs tracking-widest uppercase" style={{color: '#44474D'}}>Cryptage Héritage</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span style={{color: '#009886'}}>📊</span>
                            <span className="text-xs tracking-widest uppercase" style={{color: '#44474D'}}>Analyses IA Actives</span>
                        </div>
                    </div>
                </div>

                <footer className="mt-8">
                    <p className="text-xs mb-2" style={{color: '#C5C6CE'}}>© 2024 Ymmo. L'Excellence Immobilière.</p>
                    <div className="flex gap-6">
                        <span className="text-xs tracking-widest uppercase cursor-pointer hover:underline"
                              style={{color: '#C5C6CE'}}>Mentions légales</span>
                        <span className="text-xs tracking-widest uppercase cursor-pointer hover:underline"
                              style={{color: '#C5C6CE'}}>Confidentialité</span>
                        <span className="text-xs tracking-widest uppercase cursor-pointer hover:underline"
                              style={{color: '#C5C6CE'}}>Assistance</span>
                    </div>
                </footer>
            </div>
        </div>
    )
}