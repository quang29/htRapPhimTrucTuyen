import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';

const emptyPlan = {
  name: '',
  subtitle: '',
  description: '',
  monthlyPrice: 0,
  yearlyPrice: 0,
  features: [],
  currency: 'VND',
  badge: '',
  buttonText: '',
  popular: false,
  darkTheme: false,
};

const PlansManager = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form, setForm] = useState(emptyPlan);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    const plansSnapshot = await getDocs(collection(db, 'plans'));
    const planList = plansSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPlans(planList);
    setLoading(false);
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan.id);
    setForm({ ...plan, features: plan.features || [] });
  };

  const handleDelete = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this plan? This action cannot be undone.')) return;
    await deleteDoc(doc(db, 'plans', planId));
    setMessage('Plan deleted!');
    fetchPlans();
    setTimeout(() => setMessage(''), 2000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleFeaturesChange = (e) => {
    setForm({ ...form, features: e.target.value.split('\n').filter(Boolean) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setMessage('Plan name is required!');
      return;
    }
    if (form.monthlyPrice <= 0 && form.yearlyPrice <= 0) {
      setMessage('At least one price must be greater than 0!');
      return;
    }
    // ...các validate khác...
    if (editingPlan) {
      await updateDoc(doc(db, 'plans', editingPlan), form);
      setMessage('Plan updated!');
    } else {
      await addDoc(collection(db, 'plans'), form);
      setMessage('Plan added!');
    }
    setEditingPlan(null);
    setForm(emptyPlan);
    fetchPlans();
    setTimeout(() => setMessage(''), 2000);
  };

  const handleCancel = () => {
    setEditingPlan(null);
    setForm(emptyPlan);
  };

  return (
    <div className="text-white">
      <h2 className="text-2xl font-extrabold mb-6 text-yellow-400">Subscription Plans Management</h2>
      {message && <div className="mb-4 p-2 rounded bg-zinc-800 text-green-400">{message}</div>}
      <div className="mb-8">
        <form onSubmit={handleSubmit} className="bg-zinc-800 rounded-xl p-6 mb-4 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Plan Name" className="p-2 rounded bg-zinc-700" required />
            <input name="subtitle" value={form.subtitle} onChange={handleChange} placeholder="Subtitle" className="p-2 rounded bg-zinc-700" />
            <input name="badge" value={form.badge} onChange={handleChange} placeholder="Badge" className="p-2 rounded bg-zinc-700" />
            <input name="buttonText" value={form.buttonText} onChange={handleChange} placeholder="Button Text" className="p-2 rounded bg-zinc-700" />
            <input name="monthlyPrice" type="number" value={form.monthlyPrice} onChange={handleChange} placeholder="Monthly Price" className="p-2 rounded bg-zinc-700" required />
            <input name="yearlyPrice" type="number" value={form.yearlyPrice} onChange={handleChange} placeholder="Yearly Price" className="p-2 rounded bg-zinc-700" required />
            <input name="currency" value={form.currency} onChange={handleChange} placeholder="Currency" className="p-2 rounded bg-zinc-700" />
            <label className="flex items-center gap-2">
              <input type="checkbox" name="popular" checked={form.popular} onChange={handleChange} />
              Popular
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="darkTheme" checked={form.darkTheme} onChange={handleChange} />
              Dark Theme
            </label>
          </div>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="p-2 rounded bg-zinc-700 w-full mt-2"
          />
          <textarea
            name="features"
            value={form.features.join('\n')}
            onChange={handleFeaturesChange}
            placeholder="Features (one per line)"
            className="p-2 rounded bg-zinc-700 w-full mt-2"
            rows={4}
          />
          <div className="mt-4 flex gap-2 flex-wrap">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-bold shadow">
              {editingPlan ? 'Update Plan' : 'Add Plan'}
            </button>
            {editingPlan && (
              <button type="button" onClick={handleCancel} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-white">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">All Plans</h3>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></span>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-lg bg-zinc-900">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="bg-zinc-800">
                  <th className="py-3 px-2">Name</th>
                  <th className="py-3 px-2">Subtitle</th>
                  <th className="py-3 px-2">Monthly</th>
                  <th className="py-3 px-2">Yearly</th>
                  <th className="py-3 px-2">Popular</th>
                  <th className="py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map(plan => (
                  <tr key={plan.id} className="border-b border-zinc-700 hover:bg-zinc-800 transition">
                    <td className="py-2 px-2">{plan.name}</td>
                    <td className="py-2 px-2">{plan.subtitle}</td>
                    <td className="py-2 px-2">{plan.monthlyPrice?.toLocaleString()} {plan.currency}</td>
                    <td className="py-2 px-2">{plan.yearlyPrice?.toLocaleString()} {plan.currency}</td>
                    <td className="py-2 px-2">{plan.popular ? 'Yes' : 'No'}</td>
                    <td className="py-2 px-2 flex gap-2">
                      <button onClick={() => handleEdit(plan)} className="px-3 py-1 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-bold shadow">Edit</button>
                      <button onClick={() => handleDelete(plan.id)} className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold shadow">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlansManager;