import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { setUser } from '../store/authSlice';

const ViewProfile = ({ onClose }) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [name, setName] = useState(user?.name || '');
  const [photoFile, setPhotoFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleFileChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    let updatedPhoto = user.photo;

    try {
      // 1. Upload new avatar if selected
      if (photoFile) {
        const storageRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(storageRef, photoFile);
        updatedPhoto = await getDownloadURL(storageRef);
      }

      // 2. Update Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        name: name,
        photo: updatedPhoto,
      });

      // 3. Update local Redux store
      dispatch(setUser({
        ...user,
        name: name,
        photo: updatedPhoto
      }));

      alert('Profile updated successfully!');
      onClose();
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('An error occurred while updating your profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
      <div className="bg-gray-1000 border rounded-lg w-96 relative text-white">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-2xl font-medium text-center flex-1">Update Information</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-400 text-xl mb-6 text-center">Change your information</p>
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-6">
            <p className="text-white text-sm mb-4 self-start">Profile Picture</p>
            <div className="relative mb-4">
              <img
  src={photoFile ? URL.createObjectURL(photoFile) : user.photo}
  alt="avatar"
  className="w-20 h-20 rounded-full object-cover"
/>

            </div>
            <label className="flex items-center justify-center gap-2 text-white cursor-pointer hover:text-gray-300">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L13.09 8.26L19 7L17.74 13.09L24 12L17.74 10.91L19 17L13.09 15.74L12 22L10.91 15.74L5 17L6.26 10.91L0 12L6.26 13.09L5 7L10.91 8.26L12 2Z"/>
              </svg>
              Choose Image
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-white text-sm mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-3 bg-gray-1000 border border-gray-600 rounded-lg text-white placeholder-gray-1000 focus:outline-none focus:border-blue-500"
              placeholder="Enter your name"
            />
          </div>

          {/* Email Display */}
          <div className="mb-6">
            <label className="block text-white text-sm mb-2">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-3 py-3 bg-gray-1000 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-white/10 text-white py-3 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer transition-colors duration-200 flex items-center justify-center"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;