import React from 'react'
import {Navigate} from 'react-router-dom'
import {useAuth} from './AuthContext'

interface PrivateRouteProps {
  component: React.ComponentType
  requiredUserType?: string
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  requiredUserType
}) => {
  const {isLoggedIn, userType} = useAuth()
  const token = sessionStorage.getItem('token')

  const isAuthenticated = () => {
    const tokenExists = token !== null
    const userTypeMatches =
      !requiredUserType || userType?.toLowerCase() === requiredUserType.toLowerCase()

    return isLoggedIn && tokenExists && userTypeMatches
  }

  if (isAuthenticated()) {
    return <Component />
  } else {
    // console.warn('User not authenticated or unauthorized; redirecting to login.')
    // return <Navigate to="/login" replace />
  }
}

export default PrivateRoute
