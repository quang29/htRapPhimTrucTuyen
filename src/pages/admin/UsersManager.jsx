import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';

const UsersManager = () => {
  const [users, setUsers] = useState([]); // danh sach nguoi dung tu firebase
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null); // id cua nguoi dung dang duoc cap nhat
  const [message, setMessage] = useState('');

  // lay danh sach nguoi dung tu firebase khi component duoc mount
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const usersSnapshot = await getDocs(collection(db, 'users')); // lay toan bo nguoi dung tu collection 'users'
      const userList = usersSnapshot.docs.map(doc => ({ // chuyen doi tung document thanh object
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList); // luu du lieu vao state 
      setLoading(false);
    };
    fetchUsers();
  }, []);

  // Toggle role between user/admin
  const handleToggleRole = async (user) => {
    if (user.role === 'admin') return;
    setUpdatingId(user.id); // id cua nguoi dung dang duoc cap nhat
    try {
      await updateDoc(doc(db, 'users', user.id), { role: user.role === 'user' ? 'admin' : 'user' });// cap nhat role cua nguoi dung trong firebase
      setUsers(users.map(u => u.id === user.id ? { ...u, role: u.role === 'user' ? 'admin' : 'user' } : u)); // cap nhat state users de hien thi tren giao dien
      setMessage('Role updated!');
      setTimeout(() => setMessage(''), 2000);
    } catch {
      setMessage('Error updating role.');
      setTimeout(() => setMessage(''), 2000);
    }
    setUpdatingId(null);
  };

  // Lock/Unlock user
  const handleToggleLock = async (user) => {
    setUpdatingId(user.id);
    try {
      await updateDoc(doc(db, 'users', user.id), { locked: !user.locked });// cap nhat trang thai locked cua nguoi dung trong firebase
      setUsers(users.map(u => u.id === user.id ? { ...u, locked: !u.locked } : u));// cap nhat state users de hien thi tren giao dien
      setMessage(user.locked ? 'User unlocked!' : 'User locked!');
      setTimeout(() => setMessage(''), 2000);
    } catch {
      setMessage('Error updating user status.');
      setTimeout(() => setMessage(''), 2000);
    }
    setUpdatingId(null);
  };

  return (
    <div className="text-white">
      <h2 className="text-2xl font-extrabold mb-6 text-yellow-400">Users Management</h2>
      {message && (
        <div className="mb-4 p-2 rounded bg-zinc-800 text-green-400">{message}</div>
      )}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></span>
        </div>
      ) : users.length === 0 ? (
        <div className="text-gray-400">No users found.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg bg-zinc-900">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-zinc-800">
                <th className="py-3 px-2">Email</th>
                <th className="py-3 px-2">Name</th>
                <th className="py-3 px-2">Role</th>
                <th className="py-3 px-2">Created At</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-zinc-700 hover:bg-zinc-800 transition">
                  <td className="py-2 px-2">{user.email}</td>
                  <td className="py-2 px-2">{user.name}</td>
                  <td className="py-2 px-2">{user.role}</td>
                  <td className="py-2 px-2 text-xs">
                    {user.createdAt
                      ? user.createdAt.seconds
                        ? new Date(user.createdAt.seconds * 1000).toLocaleString()
                        : new Date(user.createdAt).toLocaleString()
                      : ''}
                  </td>
                  <td className="py-2 px-2">
                    {user.locked ? (
                      <span className="text-red-400 font-bold">Locked</span>
                    ) : (
                      <span className="text-green-400 font-bold">Active</span>
                    )}
                  </td>
                  <td className="py-2 px-2 flex flex-wrap gap-2">
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleToggleRole(user)}
                        className="px-3 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold shadow"
                        disabled={updatingId === user.id}
                      >
                        Set {user.role === 'user' ? 'Admin' : 'User'}
                      </button>
                    )}
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleToggleLock(user)}
                        className={`px-3 py-1 rounded-lg font-bold shadow ${
                          user.locked
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-red-500 hover:bg-red-600'
                        } text-white`}
                        disabled={updatingId === user.id}
                      >
                        {user.locked ? 'Unlock' : 'Lock'}
                      </button>
                    )}
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

export default UsersManager;