import React from 'react'
import { mobileNavigation } from '../constants/navigation'
import { NavLink } from 'react-router-dom'

const MobileNavigation = () => {
  return (
    <section className='lg:hidden h-14 bg-black/70 backdrop-blur-sm fixed bottom-0 w-full z-40'>
        <div className='flex items-center justify-around h-full text-neutral-400'>
            {
                mobileNavigation.map((nav, index) => {
                    return (
                        <NavLink 
                            key={nav.label + "mobilenavigation"} 
                            to={nav.href} 
                            className= {({isActive})=>`flex flex-col items-center justify-center gap-1 ${isActive && "text-white"}`}>
                            <div className='text-2xl'>
                                {nav.icon}
                            </div>
                            <p className='text-sm'>{nav.label}</p>
                        </NavLink>
                    )
                })
            }
        </div>
    </section>
  )
}

export default MobileNavigation