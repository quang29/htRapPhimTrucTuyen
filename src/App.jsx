import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import MobileNavigation from './components/MobileNavigation'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setBannerData, setImageURL } from './store/movieSlice'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from './firebase'
import { setUser, clearUser } from './store/authSlice'
import { doc, getDoc } from 'firebase/firestore'
import tmdbAxios from './api/tmdbAxios'

function App() {
  const location = useLocation()
   console.log('🔍 Pathname:', location.pathname);
  const dispatch = useDispatch()

  // lay du lieu "day trending" cho banner tu tmdb va luu vao redux
  const fetchTrendingData = async () => {
    try {
      const response = await tmdbAxios.get('/trending/all/day')

      dispatch(setBannerData(response.data.results))

    } catch (error) {
      console.error("error", error)
    }
  }

  // lay cau hinh tu tmdb de luu vao redux
  const fetchConfiguration = async () => {
    try {
      const response = await tmdbAxios.get('/configuration')

      dispatch(setImageURL(response.data.images.secure_base_url + "original")) // Lưu URL ảnh vào Redux store
    } catch (error) {
      console.error("error", error)
    }
  }

  useEffect(() => {
    fetchTrendingData()
    fetchConfiguration()
  }, [])

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.locked) {
            dispatch(clearUser());
            await auth.signOut();
            return;
          }
          dispatch(setUser({
            ...userData,
            email: user.email,
            uid: user.uid
          }));
        } else {
          //Nếu user chưa có document trong Firestore, tạo mới 
          dispatch(setUser({
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
            uid: user.uid
          }));
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    } else {
      dispatch(clearUser());
    }
  });

    return () => unsubscribe(); // cleanup
  }, [dispatch]);

  return (
    <main className='pb-14 lg:pb-0'>
      <Header/>
      <div className='min-h-[90vh]'> 
        <Outlet/>
      </div>
      <Footer/>
      <MobileNavigation/>
    </main>
  )
}

export default App
