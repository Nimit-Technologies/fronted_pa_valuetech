import React from 'react'
import Logo from "/pa_valuetech_logo.png"
import Notification from '@/components/shared/notification'
import UserAvatar from '@/components/shared/auth/userAvatar'
import { Link } from 'react-router-dom'

const DesktopNavbar = () => {
  return (
    <div className="flex items-center justify-between w-full px-6 py-3 bg-card border-b border-border shadow-sm">
      <Link to="/" className="flex items-center gap-3">
        <img src={Logo} alt="PA Valuetech" className="h-9 w-auto object-contain" />
      </Link>

      <p className="text-sm font-semibold text-foreground capitalize tracking-wide">
        Super Admin Dashboard
      </p>

      <div className="flex items-center gap-2">
        <Notification />
        <UserAvatar />
      </div>
    </div>
  )
}

export default DesktopNavbar