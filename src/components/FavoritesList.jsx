import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Card from './Card';

const FavoritesList = () => {
  const user = useSelector((state) => state.auth.user);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;

      try {
        const favRef = collection(db, 'users', user.uid, 'favorites');
        const snapshot = await getDocs(favRef);
        const favMovies = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFavorites(favMovies);
        console.log(favMovies)
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    };

    fetchFavorites();
  }, [user]);

  return (
    <div className="container mx-auto pt-10 mt-10 px-4 py-6">
      <h2 className="text-2xl font-bold text-white mb-4">🎞️ Your Favorite Movies</h2>
      {favorites.length === 0 ? (
        <p className="text-white">You haven't added any favorites yet.</p>
      ) : (
        <div className="flex flex-wrap gap-4 justify-start">
          {favorites.map((movie, index) => {
  console.log("movie", movie); // 👈 Thêm dòng này
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
