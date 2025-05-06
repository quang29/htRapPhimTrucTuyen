import React, {useEffect, useState} from 'react'
import logo from '../assets/logo.png'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import userIcon from '../assets/user.png'
import { IoSearchOutline } from "react-icons/io5";
import { navigation } from '../constants/navigation';


const Header = () => {
    const location = useLocation()
    const removeSpace = location?.search?.slice(3)?.split("%20")?.join(" ")
    const [searchInput, setSearchInput] = useState(removeSpace)
    const navigate = useNavigate()

    console.log("location",)

    useEffect(() => {
        if(searchInput){
            navigate(`/search?q=${searchInput}`)
        }
    }, [searchInput])

    const handleSubmit = (e) => {
        e.preventDefault()
    }

  return (
    <header className='fixed top-0 w-full h-16 bg-black/34 z-40'>
        <div className='container mx-auto px-3 flex items-center h-full'>
            <Link to={'/'}>
                <img src={logo} alt="logo" width={120} />
            </Link>

            <nav className='hidden lg:flex items-center gap-2 ml-5'>
            {
                navigation.map((nav, index) => {
                    return (
                        <div>
                            <NavLink key={nav.label} to={nav.href} className={({isActive})=>`px-2 hover:text-neutral-400 ${isActive && "text-neutral-400"}`}>
                                {nav.label}
                            </NavLink>
                        </div>
                    )
                })
            }
            </nav>

            <div className='ml-auto flex items-center gap-4'>
                <form action="" className='flex items-center gap-2' onSubmit={handleSubmit}>
                    <input type="text" 
                        className='text-white px-3 py-1 rounded-md outline-none hidden lg:block' 
                        placeholder='Search...'
                        onChange={(e)=>setSearchInput(e.target.value)}
                        value={searchInput}
                    />
                    <button className='gap-5 text-white text-2xl cursor-pointer'>
                    <IoSearchOutline/>
                    </button>
                </form>
                <div className='w-8 h-8 rounded-full overflow-hidden cursor-pointer active:scale-50 transition-transform'>
                    <img src={userIcon} alt="" className='w-full h-full'/>
                </div>
            </div>

        </div>
    </header>
  )
}

export default Header