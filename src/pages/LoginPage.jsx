// src/pages/LoginPage.jsx
import React, {useEffect} from 'react';
import bgImage from '../assets/posterwall.jpg';
import { useDispatch } from 'react-redux';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { setUser } from '../store/authSlice';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, provider, db } from "../firebase";

const LoginPage = ({ onClose }) => {
    const dispatch = useDispatch();
    // Disable scroll when popup is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);


const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
        // Dữ liệu cần lưu
      const userInfo = {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photo: user.photoURL,
      };

      // Gửi lên Redux
      dispatch(setUser(userInfo));

      // Lưu vào Firestore nếu chưa có
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(userRef, {
          ...userInfo,
          createdAt: new Date().toISOString(),
        });
      }
    console.log("Đăng nhập thành công:", user);
    // Nếu muốn lưu vào localStorage hoặc Redux thì thêm ở đây
    onClose(); // đóng popup sau khi đăng nhập
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
  }
};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      {/* Form Container */}
      <div className="relative z-10 bg-zinc-900 rounded-xl p-10 shadow-xl w-[420px] h-[300px] flex flex-col justify-between items-center text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-white text-2xl font-bold hover:text-red-400 cursor-pointer transition-colors duration-200"
        >
          ✕
        </button>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mt-4">
          Continue to <span className="text-white">MEOVI</span>
        </h1>

        {/* Google Button */}
        <button onClick={handleGoogleLogin} className="cursor-pointer text-black flex gap-2 items-center justify-center bg-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-zinc-300 transition-all ease-in duration-200">
          <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
            <path
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8
              c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,
              7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,
              4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,
              20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              fill="#FFC107"
            ></path>
            <path
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12
              c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,
              29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              fill="#FF3D00"
            ></path>
            <path
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,
              35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946
              l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              fill="#4CAF50"
            ></path>
            <path
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,
              4.166-4.087,5.571c0.001-0.001,0.002-0.001,
              0.003-0.002l6.19,5.238C36.971,39.205,
              44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              fill="#1976D2"
            ></path>
          </svg>
          Continue with Google
        </button>

        {/* Terms */}
        <p className="text-xs text-zinc-400 mt-4">
          By clicking continue, you agree to{' '}
          our <span className="underline cursor-pointer">Terms</span>.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
