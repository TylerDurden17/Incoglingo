import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import {ToastContainer, toast } from 'react-toastify';
// import useRazorpay from "react-razorpay";

const SelectPartners = (props) => {
  const [learnerId, setLearnerId] = useState('learner-123');
  const [teacherId, setTeacherId] = useState('teacher-456');
  const [teachers, setTeachers] = useState([]);
  // const [Razorpay, isLoaded] = useRazorpay();

  // const handlePayment = useCallback(() => {

  //   const options = {
  //     key: "rzp_live_zVNgag0wyghXm0",
  //     amount: "8000", // Amount in paise (100 = ₹1)
  //     currency: "INR",
  //     // subscription_id: 'sub_NjlOoQMBW3DUsx',
  //     name: "Incoglingo",
  //     description: "Test Transaction",
  //     handler: (res) => {
  //       console.log(res);
  //     }
  //   };

  //   const rzpay = new Razorpay(options);
  //   rzpay.open();
  // }, [Razorpay]);

  const subscribe = async (learnerId, teacherId) => {

    try {
      const response = await fetch('http://localhost:8080/subscribeToTeacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ learnerId, teacherId }),
      });

      if (response.ok) {
        console.log('Subscription created successfully');
        toast.success('Subscription created successfully!');
      } else {
        console.error('Error creating subscription:', response.statusText);
        toast.error('Error creating subscription: ' + response.statusText);
      }
    } catch (error) {
      console.error('Subscription Creation Failed', error);
      toast.error('Error creating subscription: ' + error.message);
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
      {/* {teachers.map((teacher) => (
        <div className="teacher-card">
          <img src={teacher.photo} style={{height:"100px", borderRadius:"50%"}} alt={`${teacher.name}'s photo`} />
          <h2>{teacher.name}</h2>
          <p>{teacher.bio}</p>
          <Button onClick={subscribe}>Subscribe</Button>
          <button onClick={handlePayment}>pay</button> 
        </div>
      ))} */}
      {teachers.map((user) => (
        <div key={user.uid}>
          <div>{user.bio} ({user.level})</div>
          <Button onClick={()=>subscribe(user.uid)}>Subscribe</Button>
        </div>
      ))}

      <ToastContainer />
    </div>
      
    </>
  );
};

export default SelectPartners;