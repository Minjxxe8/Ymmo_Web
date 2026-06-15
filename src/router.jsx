import {BrowserRouter, Routes, Route, Navigate, Outlet} from 'react-router-dom'
import {useAuth} from './context/AuthContext.jsx'
import Layout from './components/layout/Layout'

import Auth from './pages/Auth/AuthPage'
import LandingPage from './pages/LandingPage/LandingPage'
import HomePage from "./pages/Home/HomePage";
import PropertyDetailPage from "./pages/PropertyDetail/PropertyDetailPage";
import WalletPage from "./pages/Wallet/WalletPage";
import ProfilePage from "./pages/Profile/ProfilePage.jsx";
import AdminPage from "./pages/Admin/AdminPage";
import AnalyticsPage from "./pages/Analytics/AnalycticsPage.jsx";

/*const Placeholder = ({ name }) => (
    <div style={{ padding: '2rem', color: '#0D1F3C' }}>{name} — à venir</div>
)*/

function PrivateRoute() {
    const {refreshToken, accessToken, loading} = useAuth()
    if (loading) return null
    return refreshToken !== '' && accessToken !== '' ? <Outlet/> : <Navigate to="/auth" replace/>
}

function AdminRoute() {
    const {user, loading} = useAuth()
    if (loading) return null
    return user?.role === 'admin' || user?.role === 'agent' ? <Outlet/> : <Navigate to="/" replace/>
}

function GuestRoute() {
    const {refreshToken, accessToken, loading} = useAuth()
    if (loading) return null
    return !refreshToken || !accessToken ? <Outlet/> : <Navigate to="/" replace/>
}

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>

                <Route element={<GuestRoute/>}>
                    <Route path="/auth" element={<Auth/>}/>
                </Route>

                <Route element={<Layout/>}>
                    <Route path="/properties" element={<HomePage/>}/>
                    <Route path="/property/:id" element={<PropertyDetailPage/>}/>
                    <Route path="/" element={<LandingPage/>}/>
                    <Route path="/home" element={<HomePage/>}/>

                    <Route element={<PrivateRoute/>}>
                        <Route path="/profile" element={<ProfilePage/>}/>
                        <Route path="/wallet" element={<WalletPage/>}/>
                    </Route>

                    <Route element={<AdminRoute/>}>
                        <Route path="/admin" element={<AdminPage/>}/>
                        <Route path="/analytics" element={<AnalyticsPage/>}/>
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace/>}/>
                </Route>

            </Routes>
        </BrowserRouter>
    )
}