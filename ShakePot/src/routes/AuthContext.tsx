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
  // 초기 상태를 sessionStorage에서 불러오기
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    () => !!sessionStorage.getItem('token')
  )
  const [email, setEmail] = useState<string | null>(() => sessionStorage.getItem('email'))
  const [userType, setUserType] = useState<string | null>(() =>
    sessionStorage.getItem('userType')
  )

  // 초기 상태 설정 시 로그 출력
  useEffect(() => {
    const token = sessionStorage.getItem('token')
    const storedEmail = sessionStorage.getItem('email')
    const storedUserType = sessionStorage.getItem('userType')

    console.log('AuthProvider initial load - token:', token)
    console.log('AuthProvider initial load - email:', storedEmail)
    console.log('AuthProvider initial load - userType:', storedUserType)

    if (token && storedEmail && storedUserType) {
      setIsLoggedIn(true)
      setEmail(storedEmail)
      setUserType(storedUserType)
    }
  }, [])

  const login = (Email: string, userType: string, token: string) => {
    if (!token || !userType || !Email) {
      console.error('Missing login data:', {Email, userType, token})
      return
    }

    console.log('Login function called - Storing data in sessionStorage')
    setIsLoggedIn(true)
    setEmail(Email)
    setUserType(userType)

    // sessionStorage에 로그인 정보 저장
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('userType', userType)
    sessionStorage.setItem('email', Email)

    console.log('sessionStorage after login:', {
      token: sessionStorage.getItem('token'),
      userType: sessionStorage.getItem('userType'),
      email: sessionStorage.getItem('email')
    })
  }

  const logout = () => {
    console.log('Logout function called - Clearing sessionStorage')
    setIsLoggedIn(false)
    setEmail(null)
    setUserType(null)

    // sessionStorage에서 로그인 정보 제거
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('userType')
    sessionStorage.removeItem('email')

    console.log('sessionStorage after logout:', {
      token: sessionStorage.getItem('token'),
      userType: sessionStorage.getItem('userType'),
      email: sessionStorage.getItem('email')
    })
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
