import React from 'react'
import MobileNavbar from '@/components/shared/navigation/mobileNavbar'
import DesktopNavbar from '@/components/shared/navigation/desktopNavbar'

const Navbar = () => {
  return (
    <>
      <div className="block md:hidden">
        <MobileNavbar/>
      </div>
      <div className="hidden md:block">
        <DesktopNavbar />
      </div>
    </>
  )
}

export default Navbar
