import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import moment from 'moment';
import { Link } from 'react-router-dom';

const WatchHistory = () => {
  const user = useSelector((state) => state.auth.user);// lay thong tin nguoi dung tu redux store
  const [history, setHistory] = useState([]);// lay danh sach lich su xem phim
  const [loading, setLoading] = useState(true);

  // Fetch watch history from Firestore
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try { 
        const historyRef = collection(db, 'users', user.uid, 'watchHistory');// Truy cập vào collection watchHistory
        const snapshot = await getDocs(historyRef);// lay cac phim da xem
        const data = snapshot.docs.map(doc => ({ // Chuyen doi du lieu nhan ve tu Firestore sang dang object
          id: doc.id,
          ...doc.data()
        }));
        // Sắp xếp mới nhất lên đầu
        const sorted = data.sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt));
        setHistory(sorted);// Luu danh sach lich su vao state
      } catch (err) {
        console.error("Failed to fetch history:", err);
      }
      setLoading(false);
    };

    fetchHistory();
  }, [user]);

  if (loading) return <div className="text-white text-center py-8">Loading watch history...</div>;

  return (
    <div className="container mt-10 pt-10 mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-white mb-6">Watch History</h2>

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
