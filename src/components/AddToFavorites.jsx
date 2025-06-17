import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../firebase';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const AddToFavorites = ({ movie }) => {
  const user = useSelector((state) => state.auth.user);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!user) return;

    const checkFavorite = async () => {
      const docRef = doc(db, 'users', user.uid, 'favorites', movie.id.toString());
      const docSnap = await getDoc(docRef);
      setIsFavorite(docSnap.exists());
    };

    checkFavorite();
  }, [user, movie.id]);

  const toggleFavorite = async () => {
    if (!user) {
      toast.error("Please login to use favorites");
      return;
    }

    const docRef = doc(db, 'users', user.uid, 'favorites', movie.id.toString());
    const media_type = movie.media_type || "movie"; // fallback nếu không có

    try {
      if (isFavorite) {
        await deleteDoc(docRef);
        setIsFavorite(false);
        toast("Removed from Favorites");
      } else {
        await setDoc(docRef, {
          ...movie,
          media_type, // luôn lưu media_type vào Firestore
        });
        setIsFavorite(true);
        toast.success("Added to Favorites");
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`mt-3 w-full py-2 px-4 text-center font-bold text-lg rounded transition-all cursor-pointer active:scale-95
        ${isFavorite ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-white text-black hover:bg-black hover:text-white'}`}
    >
      {isFavorite ? 'Added to Favorites' : 'Add to Favorites'}
    </button>
  );
};

export default AddToFavorites;
