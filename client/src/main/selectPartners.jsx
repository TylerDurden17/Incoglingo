import React, { useState, useEffect, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import useRazorpay from "react-razorpay";

const SelectPartners = () => {
  const [teachers, setTeachers] = useState([]);
  const [Razorpay, isLoaded] = useRazorpay();

  const handlePayment = useCallback(() => {

    const options = {
      key: "rzp_live_zVNgag0wyghXm0",
      amount: "8000", // Amount in paise (100 = ₹1)
      currency: "INR",
      // subscription_id: 'sub_NjlOoQMBW3DUsx',
      name: "Incoglingo",
      description: "Test Transaction",
      handler: (res) => {
        console.log(res);
      }
    };

    const rzpay = new Razorpay(options);
    rzpay.open();
  }, [Razorpay]);

  const subscribe = async (planId) => {

    try {
      const response = await fetch('http://localhost:8080/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: 'plan_Nh4EpaOiIIK9rF'
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Subscription Created', data);
      // Handle success (e.g., show a success message, redirect to a thank you page, etc.)
      handlePayment();
    } catch (error) {
      console.error('Subscription Creation Failed', error);
      // Handle error (e.g., show error message to the user)
    }
  };

  useEffect(() => {
    // Replace this URL with your backend endpoint
    const fetchTeachers = async () => {
      try {
        const response = await fetch('http://localhost:8080/teachers');
        const data = await response.json();
        setTeachers(data);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, []);


  return (
    <>
    <div>
      {teachers.map((teacher) => (
        <div key={teacher.id} className="teacher-card">
          <img src={teacher.photo} style={{height:"100px", borderRadius:"50%"}} alt={`${teacher.name}'s photo`} />
          <h2>{teacher.name}</h2>
          <p>{teacher.bio}</p>
          <Button onClick={subscribe}>Subscribe</Button>
          <button onClick={handlePayment}>pay</button>
          <br></br>
          <br></br>
        </div>
      ))}
    </div>
      
    </>
  );
};

export default SelectPartners;