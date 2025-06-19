import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const useSubscriptionStatus = (uid) => {
  const [status, setStatus] = useState(null); // 'loading', 'success', 'none'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPayment = async () => {
      if (!uid) {
        setStatus("none");
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "payments"),
        where("userId", "==", uid),
        where("status", "==", "success")
      );

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setStatus("success");
      } else {
        setStatus("none");
      }
      setLoading(false);
    };

    checkPayment();
  }, [uid]);

  return { status, loading };
};
