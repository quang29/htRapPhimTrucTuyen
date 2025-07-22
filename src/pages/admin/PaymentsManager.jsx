import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const PaymentsManager = () => {
  const [payments, setPayments] = useState([]); // luu tru danh sach cac thanh toan
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null); // luu id cua giao dich dang duoc xu ly
  const [message, setMessage] = useState('');

  // lay du lieu thanh toan tu firebase
  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      const plansSnapshot = await getDocs(collection(db, 'plans')); // lay toan bo cac goi tu bang plans
      const plansMap = {}; // khai bao plansMap de luu tru ten goi theo id
      plansSnapshot.forEach(planDoc => { // duyet qua tung goi
        plansMap[planDoc.id] = planDoc.data().name || planDoc.id; // luu ten goi vao plansMap voi key la id cua goi
      });

      const q = query(collection(db, 'payments'), where('status', '==', 'pending'));// tao truy van q: lay cac truong trong bang payments co status = pending
      const querySnapshot = await getDocs(q); // ket qua truy van
      const paymentList = []; // khoi tao danh sach thanh toan rong
      for (const paymentDoc of querySnapshot.docs) { // duyet qua tung tai lieu trong ket qua truy van
        const paymentData = paymentDoc.data(); // lay du lieu thanh toan tu tai lieu
        let userEmail = ''; // khoi tao userEmail rong
        try {
          const userDoc = await getDoc(doc(db, 'users', paymentData.userId)); // lay tai lieu nguoi dung tu bang users theo userId
          if (userDoc.exists()) { // neu tai lieu nguoi dung ton tai
            userEmail = userDoc.data().email; // lay email cua nguoi dung
          }
        } catch {}
        paymentList.push({ // gop lai du lieu tung giao dich, tao 1 doi tuong chua id, useremail, planName, va cac truong khac
          id: paymentDoc.id,
          ...paymentData,
          userEmail,
          planName: plansMap[paymentData.planId] || paymentData.planId,
        });
      }
      setPayments(paymentList); // cap nhat state payments voi danh sach cac giao dich thanh toan
      setLoading(false);
    };
    fetchPayments();
  }, []);

  // ham xu ly cap nhat trang thai thanh toan
  const handleUpdateStatus = async (id, status) => {
    setUpdatingId(id); // luu id cua giao dich dang duoc cap nhat
    try {
      await updateDoc(doc(db, 'payments', id), { status, updatedAt: new Date() }); // cap nhat trang thai giao dich thanh toan trong bang payments
      setPayments(payments.filter(p => p.id !== id)); // loai bo giao dich da cap nhat khoi danh sach payments
      setMessage(`Payment ${status === 'success' ? 'approved' : 'rejected'} successfully!`); // hien thi thong bao thanh cong
      setTimeout(() => setMessage(''), 2000); // xoa thong bao sau 2 giay
    } catch (error) {
      setMessage('Error updating payment status.');
      setTimeout(() => setMessage(''), 2000);
    }
    setUpdatingId(null); // reset id dang cap nhat de hien thi lai nut cho cac dong khac
  };

  return (
    <div className="text-white">
      <h2 className="text-2xl font-extrabold mb-6 text-yellow-400">Payments Management</h2>
      {message && (
        <div className="mb-4 p-2 rounded bg-zinc-800 text-green-400">{message}</div>
      )}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></span>
        </div>
      ) : payments.length === 0 ? (
        <div className="text-gray-400">No pending payments.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg bg-zinc-900">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-zinc-800">
                <th className="py-3 px-2">User Email</th>
                <th className="py-3 px-2">Plan</th>
                <th className="py-3 px-2">Cycle</th>
                <th className="py-3 px-2">Amount</th>
                <th className="py-3 px-2">Method</th>
                <th className="py-3 px-2">Time</th>
                <th className="py-3 px-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.id} className="border-b border-zinc-700 hover:bg-zinc-800 transition">
                  <td className="py-2 px-2">{payment.userEmail || payment.userId}</td>
                  <td className="py-2 px-2">{payment.planName}</td>
                  <td className="py-2 px-2 capitalize">{payment.billingCycle}</td>
                  <td className="py-2 px-2 text-yellow-400">{payment.amount?.toLocaleString()} VND</td>
                  <td className="py-2 px-2">{payment.method?.toUpperCase()}</td>
                  <td className="py-2 px-2 text-xs">
                    {payment.timestamp?.seconds
                      ? new Date(payment.timestamp.seconds * 1000).toLocaleString()
                      : ''}
                  </td>
                  <td className="py-2 px-2 flex gap-2">
                    <button
                      onClick={() => handleUpdateStatus(payment.id, 'success')}
                      className="px-3 py-1 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold shadow"
                      disabled={updatingId === payment.id}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(payment.id, 'rejected')}
                      className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold shadow"
                      disabled={updatingId === payment.id}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentsManager;