import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const PaymentsManager = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState('');

  // Fetch payments and user emails
  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      // Fetch all plans once for mapping planId -> plan name
      const plansSnapshot = await getDocs(collection(db, 'plans'));
      const plansMap = {};
      plansSnapshot.forEach(planDoc => {
        plansMap[planDoc.id] = planDoc.data().name || planDoc.id;
      });

      const q = query(collection(db, 'payments'), where('status', '==', 'pending'));
      const querySnapshot = await getDocs(q);
      const paymentList = [];
      for (const paymentDoc of querySnapshot.docs) {
        const paymentData = paymentDoc.data();
        // Fetch user email
        let userEmail = '';
        try {
          const userDoc = await getDoc(doc(db, 'users', paymentData.userId));
          if (userDoc.exists()) {
            userEmail = userDoc.data().email;
          }
        } catch {}
        paymentList.push({
          id: paymentDoc.id,
          ...paymentData,
          userEmail,
          planName: plansMap[paymentData.planId] || paymentData.planId,
        });
      }
      setPayments(paymentList);
      setLoading(false);
    };
    fetchPayments();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateDoc(doc(db, 'payments', id), { status, updatedAt: new Date() });
      setPayments(payments.filter(p => p.id !== id));
      setMessage(`Payment ${status === 'success' ? 'approved' : 'rejected'} successfully!`);
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('Error updating payment status.');
      setTimeout(() => setMessage(''), 2000);
    }
    setUpdatingId(null);
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