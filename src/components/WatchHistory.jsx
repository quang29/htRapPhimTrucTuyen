import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import moment from 'moment';
import { Link } from 'react-router-dom';

const WatchHistory = () => {
  const user = useSelector((state) => state.auth.user);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;

      try {
        const historyRef = collection(db, 'users', user.uid, 'watchHistory');
        const snapshot = await getDocs(historyRef);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Sắp xếp mới nhất lên đầu
        const sorted = data.sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt));
        setHistory(sorted);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      }
    };

    fetchHistory();
  }, [user]);

  return (
    <div className="container mt-10 pt-10 mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-white mb-6">📺 Watch History</h2>

      {history.length === 0 ? (
        <p className="text-white">You haven't watched any movies yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {history.map(item => (
            <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center bg-gray-800/80 rounded-xl p-4 gap-2 sm:gap-6">
              <span className="text-sm sm:text-base font-medium text-gray-300 w-full sm:w-40 whitespace-nowrap">
                {moment(item.watchedAt).format('DD/MM/YYYY')}
              </span>
              <Link
                to={`/${item.media_type || 'movie'}/${item.id}`}
                className="text-lg font-semibold text-white hover:text-yellow-300 transition"
              >
                {item.title}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchHistory;
