import React from 'react'
import Logo from "/pa_valuetech_logo.png"
import Notification from '@/components/shared/notification'
import UserAvatar from '@/components/shared/auth/userAvatar'
import { Link } from 'react-router-dom'


const MobileNavbar = () => {
    return (
        <div className="flex flex-col items-center justify-between gap-4 w-full px-4 sm:px-6 py-3 bg-card border-b border-border shadow-sm">

            <div>
                <p className="text-sm sm:text-base font-semibold text-foreground capitalize tracking-wide">
                    Super Admin Dashboard
                </p>
            </div>

            <div className='flex items-center justify-between w-full py-3 bg-card border-t border-border'>
                <Link to="/" className="flex items-center gap-3">
                    <img src={Logo} alt="PA Valuetech" className="h-8 sm:h-9 w-auto object-contain" />
                </Link>

                <div className="flex items-center gap-2">
                    <Notification />
                    <UserAvatar />
                </div>
            </div>

        </div>
    )
}

export default MobileNavbar
