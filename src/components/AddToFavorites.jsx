import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../firebase';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const AddToFavorites = ({ movie }) => {// movie là props được truyền vào từ DetailsPage
  const user = useSelector((state) => state.auth.user);// lay thong tin nguoi dung tu redux store
  const [isFavorite, setIsFavorite] = useState(false);// kiem tra xem phim da duoc them vao yeu thich hay chua

  useEffect(() => {
    if (!user) return;

    // Kiem tra neu phim da co trong danh sach yeu thich
    const checkFavorite = async () => {
      const docRef = doc(db, 'users', user.uid, 'favorites', movie.id.toString()); // lay thong tin phim yeu thich tu Firestore
      const docSnap = await getDoc(docRef); // kiem tra neu tai lieu ton tai
      setIsFavorite(docSnap.exists()); // neu ton tai, set isFavorite la true
    };

    checkFavorite();
  }, [user, movie.id]);// kiem tra khi user hoac movie.id thay doi

  // Ham toggle khi nguoi dung click vao nut yeu thich
  const toggleFavorite = async () => {
    if (!user) {
      toast.error("Please login to use favorites");
      return;
    }

    const docRef = doc(db, 'users', user.uid, 'favorites', movie.id.toString()); // tham chiếu đến tài liệu favorites trong Firestore
    const media_type = movie.media_type || "movie"; // luu media_type, neu khong co thi mac dinh la "movie"

    try {
      if (isFavorite) {
        await deleteDoc(docRef);// xoa tai lieu khoi Firestore neu da co trong danh sach yeu thich
        setIsFavorite(false);
        toast("Removed from Favorites");
      } else {
        await setDoc(docRef, { // neu chua co, them vao Firestore
          ...movie,
          media_type, // luôn lưu media_type
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
