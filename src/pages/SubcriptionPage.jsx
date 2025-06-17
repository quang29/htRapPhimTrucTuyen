import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const SubscriptionPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState('standard'); // Default selected plan
  const navigate = useNavigate();
  

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      badge: 'Starter',
      subtitle: 'For Individual Viewers',
      monthlyPrice: '$9.99',
      yearlyPrice: '$99.99',
      description: 'Per user / Month, Billed Annually',
      buttonText: 'Start with Basic plan',
      features: [
        'HD streaming quality',
        'Watch on 1 device at a time',
        'Unlimited movies & TV shows',
        'Ad-supported content',
        'Mobile & tablet access',
        'Standard customer support',
        'Download on 1 device',
        'Basic recommendation engine'
      ],
      popular: false,
      darkTheme: true
    },
    {
      id: 'standard',
      name: 'Standard',
      badge: 'Popular',
      subtitle: 'For Families & Small Groups',
      monthlyPrice: '$15.99',
      yearlyPrice: '$159.99',
      description: 'Per user / Month, Billed Annually',
      buttonText: 'Start with Standard plan',
      features: [
        'Full HD streaming quality',
        'Watch on 2 devices simultaneously',
        'Unlimited movies & TV shows',
        'Ad-free experience',
        'All devices supported',
        'Priority customer support',
        'Download on 2 devices',
        'Advanced recommendation engine',
        'Early access to new releases',
        'Exclusive behind-the-scenes content'
      ],
      popular: true,
      darkTheme: false
    },
    {
      id: 'premium',
      name: 'Premium',
      badge: 'Ultimate',
      subtitle: 'For Movie Enthusiasts & Large Families',
      monthlyPrice: '$23.99',
      yearlyPrice: '$239.99',
      description: 'Per user / Month, Billed Annually',
      buttonText: 'Start with Premium plan',
      features: [
        '4K Ultra HD streaming quality',
        'Watch on 4 devices simultaneously',
        'Unlimited movies & TV shows',
        'Ad-free premium experience',
        'All devices + Smart TV support',
        'VIP customer support 24/7',
        'Download on 4 devices',
        'AI-powered personalized recommendations',
        'Exclusive premium content library',
        'Director cuts & bonus features',
        'Virtual cinema experiences',
        'Priority access to premieres'
      ],
      popular: false,
      darkTheme: true
    }
  ];

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handleNext = () => {
    // Dispatch to Redux store
    // dispatch(setSelectedPlan({ planId: selectedPlan, billingCycle }));
    console.log('Selected plan:', selectedPlan, 'Billing cycle:', billingCycle);
    // Navigate to payment method page
    navigate('/payment-methods');
  };

  return (
    <div className="min-h-screen bg-black text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {/* Step 1 */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-black font-bold text-sm">
                1
              </div>
              <span className="ml-2 text-white font-medium">Choose Plan</span>
            </div>
            
            {/* Connector */}
            <div className="w-12 h-0.5 bg-gray-700"></div>
            
            {/* Step 2 */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 font-bold text-sm">
                2
              </div>
              <span className="ml-2 text-gray-400">Payment Method</span>
            </div>
            
            {/* Connector */}
            <div className="w-12 h-0.5 bg-gray-700"></div>
            
            {/* Step 3 */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 font-bold text-sm">
                3
              </div>
              <span className="ml-2 text-gray-400">Confirm</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-gray-400 text-sm">Step 1 of 3</p>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block border border-gray-600 rounded-full px-6 py-2 mb-8">
            <span className="text-gray-400 text-sm">Pricing</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Flexible Pricing For{' '}
            <span className="inline-flex items-center">
              <span className="bg-gradient-to-r from-yellow-500 to-orange-600 w-10 h-10 rounded-full flex items-center justify-center text-black font-bold mr-2">
                🎬
              </span>
              <span className="bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">
                Movie Streaming
              </span>
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Choose the perfect plan that aligns with your viewing needs, whether you're a casual viewer, 
            movie buff, or managing entertainment for the whole family.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`${billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-14 h-7 bg-gray-700 rounded-full transition-colors duration-300 focus:outline-none"
            >
              <div
                className={`absolute top-1 left-1 w-5 h-5 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full transition-transform duration-300 ${
                  billingCycle === 'yearly' ? 'transform translate-x-7' : ''
                }`}
              />
            </button>
            <span className={`${billingCycle === 'yearly' ? 'text-white' : 'text-gray-400'}`}>
              Yearly
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => handlePlanSelect(plan.id)}
              className={`relative rounded-2xl p-8 transition-all duration-300 hover:scale-105 cursor-pointer ${
                plan.id === 'standard'
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-black'
                  : plan.darkTheme
                  ? 'bg-gray-900 border border-gray-800'
                  : 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white'
              } ${
                selectedPlan === plan.id 
                  ? 'ring-4 ring-yellow-500 shadow-2xl shadow-yellow-500/25' 
                  : plan.popular 
                  ? 'ring-2 ring-emerald-500' 
                  : ''
              }`}
            >
              {/* Selection Indicator */}
              {selectedPlan === plan.id && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Badge */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                  <p className={`text-sm ${
                    plan.id === 'standard' 
                      ? 'text-black/70' 
                      : plan.darkTheme 
                      ? 'text-gray-400' 
                      : 'text-emerald-100'
                  }`}>
                    {plan.subtitle}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    plan.popular
                      ? plan.id === 'standard'
                        ? 'bg-black/20 text-black'
                        : 'bg-emerald-500 text-white'
                      : plan.darkTheme
                      ? 'bg-gray-800 text-gray-300'
                      : 'bg-white/20 text-white'
                  }`}
                >
                  {plan.badge}
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">
                    {billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                  </span>
                  <span className={`ml-1 ${
                    plan.id === 'standard' 
                      ? 'text-black/70' 
                      : plan.darkTheme 
                      ? 'text-gray-400' 
                      : 'text-emerald-100'
                  }`}>
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${
                  plan.id === 'standard' 
                    ? 'text-black/70' 
                    : plan.darkTheme 
                    ? 'text-gray-400' 
                    : 'text-emerald-100'
                }`}>
                  {plan.description}
                </p>
              </div>

              {/* CTA Button */}
              <button
                className={`w-full py-3 px-6 rounded-lg font-medium mb-8 transition-all duration-300 ${
                  plan.id === 'standard'
                    ? 'bg-black text-white hover:bg-gray-800'
                    : plan.darkTheme
                    ? 'bg-white text-gray-900 hover:bg-gray-100'
                    : 'bg-white text-emerald-700 hover:bg-gray-100'
                }`}
              >
                {plan.buttonText}
              </button>

              {/* Features Header */}
              <div className="border-t border-gray-700 pt-6">
                <h4 className={`font-semibold mb-4 text-center ${
                  plan.id === 'standard' 
                    ? 'text-black/80' 
                    : plan.darkTheme 
                    ? 'text-gray-300' 
                    : 'text-emerald-100'
                }`}>
                  FEATURES
                </h4>

                {/* Features List */}
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <svg
                        className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${
                          plan.id === 'standard'
                            ? 'text-black/80'
                            : plan.darkTheme 
                            ? 'text-green-400' 
                            : 'text-emerald-200'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className={`text-sm ${
                        plan.id === 'standard' 
                          ? 'text-black/80' 
                          : plan.darkTheme 
                          ? 'text-gray-300' 
                          : 'text-emerald-100'
                      }`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-gray-400 mb-4">
            Only people who live with you may use your account. Watch on 4 different devices at the same time with Premium, 2 with Standard, and 1 with Basic.
          </p>
          <button 
            onClick={handleNext}
            className="bg-gradient-to-r from-yellow-500 to-orange-600 text-black px-8 py-3 rounded-lg font-semibold hover:from-yellow-400 hover:to-orange-500 transition-all duration-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;