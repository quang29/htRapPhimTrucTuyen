import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function RatingButton({ movieId }) {
  const user = useSelector((state) => state.auth.user);
  const [rating, setRating] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // Reset rating mỗi khi movieId thay đổi
  useEffect(() => {
    setRating(null);
  }, [movieId]);

  useEffect(() => {
    if (!user) return;
    const fetchRating = async () => {
      const ref = doc(db, "users", user.uid, "ratings", movieId.toString());
      const snap = await getDoc(ref);
      if (snap.exists()) setRating(snap.data().type);
    };
    fetchRating();
  }, [user, movieId]);

  const handleRate = async (type) => {
    if (!user) {
      toast.error("Please log in to rate this movie!");
      return;
    }
    const ref = doc(db, "users", user.uid, "ratings", movieId.toString());

    if (rating === type) {
      await deleteDoc(ref);
      setRating(null);
    } else {
      await setDoc(ref, {
        type,
        timestamp: Date.now(),
      });
      setRating(type);
    }

    setShowTooltip(false);
  };

  const getMainBtnStyle = () => {
    if (rating === "like") return "bg-green-500 text-white";
    if (rating === "dislike") return "bg-red-500 text-white";
    return "";
  };

  const getMainIcon = () => {
    if (rating === "dislike") return <FaThumbsDown />;
    return <FaThumbsUp />;
  };

  return (
    <div
      className="relative inline-block mt-3 w-10 h-10"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Main button (ẩn khi hover) */}
      <button
        className={`absolute top-0 left-0 w-10 h-10 flex items-center justify-center p-2 rounded-full border border-white transition-colors 
        ${getMainBtnStyle()} ${showTooltip ? "opacity-0 invisible" : "opacity-100 visible"}`}
      >
        {getMainIcon()}
      </button>

      {/* Popup rating buttons (hiện đúng vị trí) */}
      {showTooltip && (
        <div className="absolute top-0 left-0 w-10 h-10 flex gap-3 items-center justify-center bg-black rounded-full z-50">
          {/* Like */}
          <div className="relative group">
            <button
              onClick={() => handleRate("like")}
              className={`transition-transform hover:scale-110 ${
                rating === "like" ? "text-green-500" : "text-white"
              }`}
            >
              <FaThumbsUp size={20} />
            </button>
            <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
              I like this
            </span>
          </div>

          {/* Dislike */}
          <div className="relative group">
            <button
              onClick={() => handleRate("dislike")}
              className={`transition-transform hover:scale-110 ${
                rating === "dislike" ? "text-red-500" : "text-white"
              }`}
            >
              <FaThumbsDown size={20} />
            </button>
            <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
              I don't like this
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
