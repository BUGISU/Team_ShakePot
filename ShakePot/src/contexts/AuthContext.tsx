// AuthContext.tsx
import React, {createContext, useState, useContext, ReactNode, useEffect} from 'react'

interface AuthContextType {
  isLoggedIn: boolean
  email: string | null
  userType: string | null
  login: (email: string, userType: string, token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState<string | null>(sessionStorage.getItem('email'))
  const [userType, setUserType] = useState<string | null>(
    sessionStorage.getItem('userType')
  )

  useEffect(() => {
    const token = sessionStorage.getItem('token')
    if (token && email && userType) {
      setIsLoggedIn(true) // 토큰, 이메일, userType이 모두 존재하면 로그인 상태 유지
    }
  }, [email, userType])

  const login = (Email: string, userType: string, token: string) => {
    if (!token || !userType || !Email) {
      console.error('Missing login data:', {Email, userType, token})
      return
    }

    // 10/31 11:32 유저이메일은 이메일로 변경함
    setIsLoggedIn(true)
    setEmail(Email)
    setUserType(userType)

    // 세션에 저장
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('userType', userType)
    sessionStorage.setItem('email', Email)
  }

  const logout = () => {
    setIsLoggedIn(false)
    setEmail(null)
    setUserType(null)
    sessionStorage.removeItem('token') // 세션에서 토큰 삭제
    sessionStorage.removeItem('userType') // 세션에서 역할 삭제
    sessionStorage.removeItem('email') // 세션에서 이메일 삭제
  }

  return (
    <AuthContext.Provider value={{isLoggedIn, email, userType, login, logout}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
