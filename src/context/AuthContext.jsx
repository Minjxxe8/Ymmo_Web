import { createContext, useContext, useState, useEffect } from 'react'
import { getMe } from '../api/auth.api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!token) {
            setLoading(false)
            return
        }
        getMe()
            .then(setUser)
            .catch(() => {
                localStorage.removeItem('token')
                setToken(null)
            })
            .finally(() => setLoading(false))
    }, [token])

    const login = (userData, receivedToken) => {
        localStorage.setItem('token', receivedToken)
        setToken(receivedToken)
        setUser(userData)
    }

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)