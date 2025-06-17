import React, {useEffect, useState, useRef} from 'react'
import logo from '../assets/logo.png'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import userIcon from '../assets/user.png'
import { IoSearchOutline } from "react-icons/io5";
import { navigation } from '../constants/navigation';
import LoginPage  from '../pages/LoginPage';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from 'firebase/auth'; 
import { auth } from '../firebase'; 
import { clearUser, showLogin, hideLogin } from '../store/authSlice'; 
import ViewProfile from './ViewProfile';
import FavoritesList from './FavoritesList';

const Header = () => {
    const location = useLocation()
    const removeSpace = location?.search?.slice(3)?.split("%20")?.join(" ")
    const [searchInput, setSearchInput] = useState(removeSpace)
    const showLoginPopup = useSelector((state) => state.auth.showLoginPopup);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user)

    console.log("location", location);
    console.log("searchInput", searchInput);

    useEffect(() => {
        if(searchInput){
            navigate(`/search?q=${searchInput}`)
        }
    }, [searchInput])

     useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      setShowDropdown(false);
      navigate('/');
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    }
  }

  return (
    <header className='fixed top-0 w-full h-16 bg-black/34 z-40'>
        <div className='container mx-auto px-3 flex items-center h-full'>
            {/* Logo */}
            <Link to={'/'}>
                <img src={logo} alt="logo" width={120} />
            </Link>
            {/* Navigation */}
            <nav className='hidden lg:flex items-center gap-2 ml-5'>
            {
                navigation.map((nav, index) => {
                    return (
                        <div>
                            <NavLink key={nav.label} to={nav.href} className={({isActive})=>`px-2 hover:text-white ${isActive && "text-white"}`}>
                                {nav.label}
                            </NavLink>
                        </div>
                    )
                })
            }
            </nav>
            {/* Search and User Icon */}
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
          {/* Avatar + Tên */}
          {user ? (
            <div className='relative' ref={dropdownRef}>
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className='w-8 h-8 rounded-full overflow-hidden cursor-pointer border-2 border-white'
              >
                <img src={user.photo} alt={user.name} className='w-full h-full object-cover' />
              </div>

              {showDropdown && (
                <div className='absolute right-0 mt-3 w-48 bg-zinc-800 text-white rounded-md shadow-lg z-50'>
                  <div className='px-4 py-3 border-b border-zinc-700'>
                    <p className='text-sm font-semibold'>{user.name}</p>
                    <p className='text-xs text-zinc-400 truncate'>{user.email}</p>
                  </div>
                  <ul className='text-sm'>
                    <li
  onClick={() => {
    setShowDropdown(false);
    setShowProfile(true);
  }}
  className='px-4 py-2 hover:bg-zinc-700 cursor-pointer'
>
  View Profile
</li>

                    <li
  onClick={() => {
    setShowDropdown(false);
    navigate('/favorites');
  }}
  className='px-4 py-2 hover:bg-zinc-700 cursor-pointer'
>
  Favorites List
</li>

                    <li 
                      onClick={() => {
                        setShowDropdown(false);
                        navigate('/watch-history');
                      }}
                      className='px-4 py-2 hover:bg-zinc-700 cursor-pointer'>Watch History</li>
                    <li
                      onClick={handleLogout}
                      className='px-4 py-2 hover:bg-red-600 text-red-400 hover:text-white cursor-pointer border-t border-zinc-700'
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div
              onClick={() => dispatch(showLogin())}
              className='w-8 h-8 rounded-full overflow-hidden cursor-pointer active:scale-50 transition-transform'
            >
              <img src={userIcon} alt="login" className='w-full h-full' />
            </div>
          )}
            </div>

        </div>
        {/* Popup Login from LoginPage */}
      {showLoginPopup && <LoginPage onClose={() => dispatch(hideLogin())} />}
        {/* Popup View Profile */}
      {showProfile && <ViewProfile onClose={() => setShowProfile(false)} />}
        
    </header>
    
  )
}

export default Header