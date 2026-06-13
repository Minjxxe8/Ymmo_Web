import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0D1F3C] border-b border-neutral-800">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                <Link to="/" className="text-white font-semibold text-xl tracking-widest uppercase">
                    Ymmo
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <NavLink
                        to="/properties"
                        className={({ isActive }) =>
                            `text-sm tracking-wide transition-colors ${isActive ? 'text-white' : 'text-neutral-400 hover:text-white'}`
                        }
                    >
                        Annonces
                    </NavLink>

                    {user?.role === 'admin' || user?.role === 'agent' ? (
                        <>
                            <NavLink
                                to="/admin"
                                className={({ isActive }) =>
                                    `text-sm tracking-wide transition-colors ${isActive ? 'text-white' : 'text-neutral-400 hover:text-white'}`
                                }
                            >
                                Admin
                            </NavLink>
                            <NavLink
                                to="/analytics"
                                className={({ isActive }) =>
                                    `text-sm tracking-wide transition-colors ${isActive ? 'text-white' : 'text-neutral-400 hover:text-white'}`
                                }
                            >
                                Analytics
                            </NavLink>
                        </>
                    ) : null}
                </nav>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <NavLink
                                to="/wallet"
                                className={({ isActive }) =>
                                    `text-sm tracking-wide transition-colors ${isActive ? 'text-white' : 'text-neutral-400 hover:text-white'}`
                                }
                            >
                                Wallet
                            </NavLink>
                            <NavLink
                                to="/profile"
                                className="text-sm tracking-wide text-neutral-400 hover:text-white transition-colors"
                            >
                                {user.firstName ?? 'Profil'}
                            </NavLink>
                            <button
                                onClick={handleLogout}
                                className="text-sm tracking-wide text-neutral-400 hover:text-white transition-colors"
                            >
                                Déconnexion
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/auth"
                            className="text-sm tracking-widest uppercase px-5 py-2 border border-neutral-600 text-white hover:border-white transition-colors"
                        >
                            Connexion
                        </Link>
                    )}
                </div>

            </div>
        </header>
    )
}