import React, { useState } from "react";

function PlanSelection(props) {
  const [selectedPlanId, setSelectedPlanId] = useState('');

  const plans = [
    { id: 'plan_Nh4EpaOiIIK9rF', name: 'Basic', price: '₹ 800.00/month' }
    // Add more plans as needed
  ];
  
  const subscribe = async (planId) => {

    try {
      const response = await fetch('http://localhost:8080/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Subscription Created', data);
      // Handle success (e.g., show a success message, redirect to a thank you page, etc.)
      window.open(data.short_url, '_blank');
    } catch (error) {
      console.error('Subscription Creation Failed', error);
      // Handle error (e.g., show error message to the user)
    }
  };

  return (
    <>
      <div>
        <div>
          <h2>Select a Plan</h2>
        <ul>
          {plans.map((plan) => (
            <li key={plan.id}>
              <input
                type="radio"
                id={plan.id}
                name="plan"
                value={plan.id}
                onChange={(e) => setSelectedPlanId(e.target.value)}
              />
              <label htmlFor={plan.id}>{plan.name} - {plan.price}</label>
            </li>
          ))}
        </ul>
        <button onClick={() => subscribe(selectedPlanId)}>Subscribe</button>
        </div>
      </div>
    </>
  );
}

export default PlanSelection;
