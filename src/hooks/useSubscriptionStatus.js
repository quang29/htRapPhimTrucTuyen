import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
//kiem tra trang thai dang ky(thanh toan) cua nguoi dung
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
      //tao truy van den firestore
      const q = query(
        collection(db, "payments"),
        where("userId", "==", uid),
        where("status", "==", "success")
      );
      //gui truy van di va nhan ket qua tra ve
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {// neu co ket qua thanh toan thanh cong
        setStatus("success"); // cap nhat trang thai thanh 'success' trong state
      } else {
        setStatus("none");
      }
      setLoading(false);
    };

    checkPayment();
  }, [uid]);

  return { status, loading };
};
