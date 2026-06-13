import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Layout from './components/layout/Layout'

import Home from './pages/Home/Home'
import Listings from './pages/Listings/Listings'
import PropertyDetail from './pages/PropertyDetail/PropertyDetail'
import Auth from './pages/Auth/Auth'
import Profile from './pages/Profile/Profile'
import Wallet from './pages/Wallet/Wallet'
import Analytics from './pages/Analytics/Analytics'
import Admin from './pages/Admin/Admin'

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
                <Route element={<Layout />}>

                    <Route path="/" element={<Home />} />
                    <Route path="/properties" element={<Listings />} />
                    <Route path="/properties/:id" element={<PropertyDetail />} />

                    <Route element={<GuestRoute />}>
                        <Route path="/auth" element={<Auth />} />
                    </Route>

                    <Route element={<PrivateRoute />}>
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/wallet" element={<Wallet />} />
                    </Route>

                    <Route element={<AdminRoute />}>
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/analytics" element={<Analytics />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />

                </Route>
            </Routes>
        </BrowserRouter>
    )
}