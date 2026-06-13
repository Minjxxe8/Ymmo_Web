import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Layout from './components/layout/Layout'

import Auth from './pages/Auth/AuthPage'
/*
import Home from './pages/Home/Home'
import Listings from './pages/Listings/Listings'
import PropertyDetail from './pages/PropertyDetail/PropertyDetail'
import Profile from './pages/Profile/Profile'
import Wallet from './pages/Wallet/Wallet'
import Analytics from './pages/Analytics/Analytics'
import Admin from './pages/Admin/Admin'*/

const Placeholder = ({ name }) => (
    <div style={{ padding: '2rem', color: '#0D1F3C' }}>{name} — à venir</div>
)

function PrivateRoute() {
    const { token, loading } = useAuth()
    if (loading) return null
    return token ? <Outlet /> : <Navigate to="/auth" replace />
}

function AdminRoute() {
    const { user, loading } = useAuth()
    if (loading) return null
    return user?.role === 'admin' || user?.role === 'agent' ? <Outlet /> : <Navigate to="/" replace />
}

function GuestRoute() {
    const { token, loading } = useAuth()
    if (loading) return null
    return !token ? <Outlet /> : <Navigate to="/" replace />
}

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>

                <Route element={<GuestRoute />}>
                    <Route path="/auth" element={<Auth />} />
                </Route>

                <Route element={<Layout />}>
                    <Route path="/" element={<Placeholder name="Home" />} />
                    <Route path="/properties" element={<Placeholder name="Listings" />} />
                    <Route path="/properties/:id" element={<Placeholder name="PropertyDetail" />} />

                    <Route element={<PrivateRoute />}>
                        <Route path="/profile" element={<Placeholder name="Profile" />} />
                        <Route path="/wallet" element={<Placeholder name="Wallet" />} />
                    </Route>

                    <Route element={<AdminRoute />}>
                        <Route path="/admin" element={<Placeholder name="Admin" />} />
                        <Route path="/analytics" element={<Placeholder name="Analytics" />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>

            </Routes>
        </BrowserRouter>
    )
}