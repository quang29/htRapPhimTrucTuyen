import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setSubscriptionDetails } from '../store/subscriptionSlice';

const SubscriptionPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'plans'));
        const fetchedPlans = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPlans(fetchedPlans);
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };

    fetchPlans();
  }, []);

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handleNext = () => {
    const selected = plans.find(p => p.id === selectedPlan);
    if (!selected) {
      alert('Please select a valid plan');
      return;
    }

    const amount = billingCycle === 'monthly'
      ? selected.monthlyPrice
      : selected.yearlyPrice;

    // 🔥 Cập nhật Redux store
    dispatch(setSubscriptionDetails({
      planId: selected.id,
      billingCycle,
      amount,
    }));

    // ✅ Lưu vào localStorage để chống mất Redux khi reload
    localStorage.setItem('selectedPlanId', selected.id);
    localStorage.setItem('billingCycle', billingCycle);
    localStorage.setItem('amount', amount);

    // ✅ Điều hướng sang bước tiếp theo
    navigate('/payment-methods');
  };

  return (
    <div className="min-h-screen bg-black text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-black font-bold text-sm">1</div>
              <span className="ml-2 text-white font-medium">Choose Plan</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-700"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 border-2 border-gray-600 rounded-full flex items-center justify-center text-gray-400 font-bold text-sm">2</div>
              <span className="ml-2 text-gray-400 font-medium">Payment</span>
            </div>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-full bg-gray-800 p-1">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium ${billingCycle === 'monthly' ? 'bg-yellow-500 text-black' : 'text-white'}`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium ${billingCycle === 'yearly' ? 'bg-yellow-500 text-black' : 'text-white'}`}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(({ id, name, monthlyPrice, yearlyPrice, features }) => (
            <div
              key={id}
              className={`rounded-xl p-6 border-2 transition-all duration-300 cursor-pointer ${selectedPlan === id ? 'border-yellow-500' : 'border-gray-700'} hover:border-yellow-500`}
              onClick={() => handlePlanSelect(id)}
            >
              <h3 className="text-xl font-bold mb-4">{name}</h3>
              <p className="text-3xl font-extrabold mb-2">
                {billingCycle === 'monthly'
                  ? `${(monthlyPrice ?? 0).toLocaleString()}₫`
                  : `${(yearlyPrice ?? 0).toLocaleString()}₫`}
              </p>
              <p className="text-sm mb-4">{billingCycle === 'monthly' ? 'per month' : 'per year'}</p>
              <ul className="text-sm space-y-1 mb-4">
                {(features ?? []).map((feature, i) => (
                  <li key={i}>• {feature}</li>
                ))}
              </ul>
              <button
                className="mt-auto bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded-full w-full"
              >
                {selectedPlan === id ? 'Selected' : 'Choose'}
              </button>
            </div>
          ))}
        </div>

        {/* Next Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={handleNext}
            className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black font-bold py-3 px-6 rounded-full text-lg"
            disabled={!selectedPlan}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
