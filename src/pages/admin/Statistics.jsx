import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

function getMonthYear(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

const Statistics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    lockedUsers: 0,
    totalPayments: 0,
    successPayments: 0,
    totalRevenue: 0,
  });
  const [userChart, setUserChart] = useState([]);
  const [paymentChart, setPaymentChart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      // Users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => doc.data());
      const totalUsers = users.length;
      const lockedUsers = users.filter(u => u.locked).length;
      const activeUsers = totalUsers - lockedUsers;

      // Users by month
      const userMonthMap = {};
      users.forEach(u => {
        let createdAt = u.createdAt?.seconds
          ? new Date(u.createdAt.seconds * 1000)
          : (u.createdAt ? new Date(u.createdAt) : null);
        if (createdAt) {
          const key = getMonthYear(createdAt);
          userMonthMap[key] = (userMonthMap[key] || 0) + 1;
        }
      });
      const userChartData = Object.entries(userMonthMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, count]) => ({ month, count }));

      // Payments
      const paymentsSnapshot = await getDocs(collection(db, 'payments'));
      const payments = paymentsSnapshot.docs.map(doc => doc.data());
      const totalPayments = payments.length;
      const successPayments = payments.filter(p => p.status === 'success').length;
      const totalRevenue = payments
        .filter(p => p.status === 'success')
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      // Payments by month (success only)
      const paymentMonthMap = {};
      payments.filter(p => p.status === 'success').forEach(p => {
        let paidAt = p.timestamp?.seconds
          ? new Date(p.timestamp.seconds * 1000)
          : (p.timestamp ? new Date(p.timestamp) : null);
        if (paidAt) {
          const key = getMonthYear(paidAt);
          paymentMonthMap[key] = (paymentMonthMap[key] || 0) + 1;
        }
      });
      const paymentChartData = Object.entries(paymentMonthMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, count]) => ({ month, count }));

      setStats({
        totalUsers,
        activeUsers,
        lockedUsers,
        totalPayments,
        successPayments,
        totalRevenue,
      });
      setUserChart(userChartData);
      setPaymentChart(paymentChartData);
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <div className="text-white">
      <h2 className="text-3xl font-extrabold mb-8 text-yellow-400">Statistics</h2>
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl p-6 shadow-lg flex flex-col items-center">
              <div className="text-lg font-semibold mb-2">Total Users</div>
              <div className="text-4xl font-extrabold">{stats.totalUsers}</div>
            </div>
            <div className="bg-gradient-to-br from-green-900 to-zinc-900 rounded-xl p-6 shadow-lg flex flex-col items-center">
              <div className="text-lg font-semibold mb-2">Active Users</div>
              <div className="text-4xl font-extrabold text-green-400">{stats.activeUsers}</div>
            </div>
            <div className="bg-gradient-to-br from-red-900 to-zinc-900 rounded-xl p-6 shadow-lg flex flex-col items-center">
              <div className="text-lg font-semibold mb-2">Locked Users</div>
              <div className="text-4xl font-extrabold text-red-400">{stats.lockedUsers}</div>
            </div>
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl p-6 shadow-lg flex flex-col items-center">
              <div className="text-lg font-semibold mb-2">Total Payments</div>
              <div className="text-4xl font-extrabold">{stats.totalPayments}</div>
            </div>
            <div className="bg-gradient-to-br from-green-900 to-zinc-900 rounded-xl p-6 shadow-lg flex flex-col items-center">
              <div className="text-lg font-semibold mb-2">Successful Payments</div>
              <div className="text-4xl font-extrabold text-green-400">{stats.successPayments}</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-900 to-zinc-900 rounded-xl p-6 shadow-lg flex flex-col items-center">
              <div className="text-lg font-semibold mb-2">Total Revenue</div>
              <div className="text-4xl font-extrabold text-yellow-400">{stats.totalRevenue.toLocaleString()} VND</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-zinc-800 rounded-xl p-6 shadow-lg">
              <div className="text-lg font-semibold mb-4">New Users by Month</div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Users" fill="#38bdf8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-zinc-800 rounded-xl p-6 shadow-lg">
              <div className="text-lg font-semibold mb-4">Successful Payments by Month</div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={paymentChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Payments" fill="#facc15" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Statistics;