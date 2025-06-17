import { Outlet } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import MobileNavigation from './components/MobileNavigation'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setBannerData, setImageURL } from './store/movieSlice'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from './firebase'
import { setUser, clearUser } from './store/authSlice'
import { doc, getDoc } from 'firebase/firestore'
import { Toaster } from 'react-hot-toast'

function App() {
  const dispatch = useDispatch()

  const fetchTrendingData = async () => {
    try {
      const response = await axios.get('/trending/all/day')

      dispatch(setBannerData(response.data.results))

    } catch (error) {
      console.error("error", error)
    }
  }

  const fetchConfiguration = async () => {
    try {
      const response = await axios.get('/configuration')

      dispatch(setImageURL(response.data.images.secure_base_url + "original"))
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
          // ✅ Ưu tiên thông tin mới nhất từ Firestore
          const userData = docSnap.data();
          dispatch(setUser({
            ...userData,
            email: user.email,
            uid: user.uid
          }));
        } else {
          // 🔄 Nếu user chưa có document trong Firestore, tạo mới (tuỳ)
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
