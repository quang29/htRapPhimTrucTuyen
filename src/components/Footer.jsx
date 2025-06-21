import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='text-center w-full bg-black/70 text-white/50 py-2'>
        <div className='flex item-center justify-center gap-4 mb-1'>
            <Link to="/">About</Link>
            <Link to="/">Contact</Link>
        </div>
        <p>What r chu looking at?</p>
    </footer>

  )
}

export default Footer