// src/pages/main/Layout.tsx
import React from 'react'
import MainHeader from './MainHeader'
import MainFooter from './MainFooter'
import {Outlet} from 'react-router-dom'

function Layout() {
  return (
    <div className="app">
      <MainHeader />
      <Outlet />
      <MainFooter />
    </div>
  )
}

export default Layout
