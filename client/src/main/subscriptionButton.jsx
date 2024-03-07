// import React, { useEffect } from 'react';

// const RazorpaySubscriptionButton = () => {
//  useEffect(() => {
//     const form = document.getElementById('razorpay-subscription-form');
//     if (!form) return;

//     const script = document.createElement('script');
//     script.src = 'https://cdn.razorpay.com/static/widget/subscription-button.js';
//     script.async = true;
//     script.setAttribute('data-subscription_button_id', 'pl_Nj52aw0taTMTBj');
//     script.setAttribute('data-button_theme', 'rzp-dark-standard');
//     // Add a unique identifier to the script tag to force re-execution
//     script.id = `razorpay-script-${Date.now()}`;

//     form.appendChild(script);

//     return () => {
//       if (document.getElementById(script.id)) {
//         form.removeChild(script);
//       }
//     };
//  }, []); // Empty dependency array ensures this runs only once on mount

//  return (
//     <form id="razorpay-subscription-form"></form>
//  );
// };

// export default RazorpaySubscriptionButton;
