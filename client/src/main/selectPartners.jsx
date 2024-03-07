import React, { useState, useEffect, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import useRazorpay from "react-razorpay";

const SelectPartners = () => {
  const [teachers, setTeachers] = useState([]);
  const [Razorpay, isLoaded] = useRazorpay();

  const handlePayment = useCallback(() => {

    const options = {
      key: "rzp_live_zVNgag0wyghXm0",
      amount: "3000",
      currency: "INR",
      // subscription_id: subscriptionId,
      name: "Incoglingo",
      description: "Test Transaction",
      handler: (res) => {
        console.log(res);
      }
    };

    const rzpay = new Razorpay(options);
    rzpay.open();
  }, [Razorpay]);

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
          <Button onClick={handlePayment}>Subscribe</Button>
          <br></br>
          <br></br>
        </div>
      ))}
    </div>
      
    </>
  );
};

export default SelectPartners;