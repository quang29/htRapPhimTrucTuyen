import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

// luu tru du lieu thong ke 
const Statistics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    lockedUsers: 0,
    totalPayments: 0,
    successPayments: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);

  // lay du lieu thong ke tu firebase
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      try {
        const usersSnapshot = await getDocs(collection(db, 'users')); // lay toan bo nguoi dung tu bang users trong firebase
        const users = usersSnapshot.docs.map(doc => doc.data());// lay du lieu nguoi dung tu cac tai lieu trong bang users

        const totalUsers = users.length; // dem tong so nguoi dung
        const lockedUsers = users.filter(u => u.locked).length; // dem so nguoi dung co locked = true
        const activeUsers = totalUsers - lockedUsers; // tinh so nguoi dung hoat dong = tong so nguoi dung - so nguoi dung bi khoa

        const paymentsSnapshot = await getDocs(collection(db, 'payments'));// lay toan bo giao dich thanh toan tu bang payments trong firebase
        const payments = paymentsSnapshot.docs.map(doc => doc.data());// lay du lieu giao dich thanh toan tu cac tai lieu trong bang payments

        const totalPayments = payments.length;// dem tong so giao dich thanh toan
        const successPayments = payments.filter(p => p.status === 'success').length; // dem so giao dich thanh toan thanh cong
        const totalRevenue = payments
          .filter(p => p.status === 'success') // chi lay cac giao dich thanh cong
          .reduce((sum, p) => sum + Number(p.amount || 0), 0); // tinh tong doanh thu = tong so tien cua cac giao dich thanh cong

        // Cập nhật state
        setStats({
          totalUsers,
          activeUsers,
          lockedUsers,
          totalPayments,
          successPayments,
          totalRevenue,
        });
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }

      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-white text-center mt-10">Loading statistics...</div>
    );
  }

  return (
    <div className="text-white max-w-xl mx-auto mt-10 space-y-4">
      <h2 className="text-3xl font-extrabold mb-8 text-yellow-400 text-center">System Statistics</h2>

      <div className="bg-zinc-800 p-4 rounded-lg shadow">
        <strong>Total Users:</strong> {stats.totalUsers}
      </div>

      <div className="bg-zinc-800 p-4 rounded-lg shadow">
        <strong>Active Users:</strong> {stats.activeUsers}
      </div>

      <div className="bg-zinc-800 p-4 rounded-lg shadow">
        <strong>Locked Users:</strong> {stats.lockedUsers}
      </div>

      <div className="bg-zinc-800 p-4 rounded-lg shadow">
        <strong>Total Payments:</strong> {stats.totalPayments}
      </div>

      <div className="bg-zinc-800 p-4 rounded-lg shadow">
        <strong>Successful Payments:</strong> {stats.successPayments}
      </div>

      <div className="bg-zinc-800 p-4 rounded-lg shadow">
        <strong>Total Revenue:</strong> {stats.totalRevenue.toLocaleString()} VND
      </div>
    </div>
  );
};

export default Statistics;
