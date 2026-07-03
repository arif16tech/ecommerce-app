import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'sonner';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    pincode: user?.pincode || ''
  });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await api.put('/auth/profile', formData);
      if (response.data.success) {
        updateUser(response.data.user);
        setEditing(false);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="py-8 sm:py-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[60vh]">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 sm:mb-8">My Profile</h1>

      <div className="bg-slate-900/50 p-6 sm:p-10 rounded-3xl shadow-lg border border-slate-800">
        <div className="mb-8 border-b border-slate-800 pb-6">
          <div className="flex justify-between py-3 px-4 bg-slate-800/30 rounded-lg mb-2">
            <span className="font-semibold text-slate-400">Email:</span>
            <span className="font-bold text-white">{user?.email}</span>
          </div>
          <div className="flex justify-between py-3 px-4 bg-slate-800/30 rounded-lg">
            <span className="font-semibold text-slate-400">Account Type:</span>
            <span className={`font-bold ${user?.isAdmin ? 'text-purple-400' : 'text-emerald-400'}`}>
              {user?.isAdmin ? 'Admin' : 'Customer'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold text-white mb-6">Personal Information</h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!editing}
                className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-white placeholder-slate-500 disabled:opacity-50 disabled:bg-slate-800/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Enter your phone number"
                className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-white placeholder-slate-500 disabled:opacity-50 disabled:bg-slate-800/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Enter your address"
                rows="3"
                className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-white placeholder-slate-500 disabled:opacity-50 disabled:bg-slate-800/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Enter your pincode"
                className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-white placeholder-slate-500 disabled:opacity-50 disabled:bg-slate-800/50"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-8 pt-6 border-t border-slate-800">
            {editing ? (
              <>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-lg disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      name: user?.name || '',
                      phone: user?.phone || '',
                      address: user?.address || '',
                      pincode: user?.pincode || ''
                    });
                  }}
                  className="flex-1 py-3 bg-slate-800 border border-slate-700 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="w-full py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-lg"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
