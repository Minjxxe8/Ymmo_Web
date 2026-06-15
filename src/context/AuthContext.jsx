import {createContext, useContext, useState, useEffect} from 'react'
import {getMe} from '../api/auth.api'

const AuthContext = createContext(null)

export function AuthProvider({children}) {
    const [user, setUser] = useState(null)
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'))
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'))
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!refreshToken || !accessToken) {
            setLoading(false)
            return
        }
        getMe()
            .then(setUser)
            .catch(() => {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                setRefreshToken(null)
                setAccessToken(null)
            })
            .finally(() => setLoading(false))
    }, [refreshToken, accessToken])

    const login = (receivedAccessToken, receivedRefreshToken) => {
        localStorage.setItem('accessToken', receivedAccessToken)
        localStorage.setItem('refreshToken', receivedRefreshToken)
        setRefreshToken(receivedRefreshToken)
        setAccessToken(receivedAccessToken)
    }

    const logout = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        setRefreshToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{user, refreshToken: refreshToken, accessToken: accessToken, loading, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)