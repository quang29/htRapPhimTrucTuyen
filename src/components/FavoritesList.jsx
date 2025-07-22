import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Card from './Card';

const FavoritesList = () => {
  const user = useSelector((state) => state.auth.user); // lay thong tin nguoi dung tu redux store
  const [favorites, setFavorites] = useState([]); // luu danh sach phim yeu thich khi lay ve tu Firestore

  // khi component load, lay du lieu
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;

      try {
        const favRef = collection(db, 'users', user.uid, 'favorites');// tro toi collection favorites trong Firestore
        const snapshot = await getDocs(favRef); // lay toan bo phim cua tai lieu favorites
        const favMovies = snapshot.docs.map((doc) => ({ // snapshot.docs la mang cac tai lieu tu Firestore, map dung de chuyen doi tai lieu nhan duoc tu firestore thanh object
          id: doc.id,
          ...doc.data(),
        }));
        setFavorites(favMovies);// luu danh sach phim yeu thich vao state
        console.log(favMovies)
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    };

    fetchFavorites();
  }, [user]);

  return (
    <div className="container mx-auto pt-10 mt-10 px-4 py-6">
      <h2 className="text-2xl font-bold text-white mb-4">Your Favorite Movies</h2>
      {favorites.length === 0 ? (
        <p className="text-white">You haven't added any favorites yet.</p>
      ) : (
        <div className="flex flex-wrap gap-4 justify-start">
          {favorites.map((movie, index) => {
  return (
    <Card key={movie.id} data={movie} index={index + 1} media_type={movie.media_type} />
  );
})}
        </div>
      )}
    </div>
  );
};

export default FavoritesList;
