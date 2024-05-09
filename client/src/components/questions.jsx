import React, { useEffect, useState } from 'react';

const Questions = (props) => {
  const [IceBreakerQuestions, setIceBreakerQuestions] = useState([]);
  const [MainQuestions, setMainQuestions] = useState([]);

  useEffect(()=>{
    if(props.sessionData) {
      setIceBreakerQuestions(props.sessionData.iceBreakerQuestions);
      setMainQuestions(props.sessionData.mainQuestions);
    }
  }, []);

  return (
    <div className="questions-container">
      <h3>Ice Breaker Questions</h3>
      <ol>
      {IceBreakerQuestions.map((question, index) => (
        <li key={index}>{question}</li>
      ))}
    </ol>
      <h3>Main Questions</h3>
    <ol>
      {MainQuestions.map((question, index) => (
        <li key={index}>{question}</li>
      ))}
    </ol>
    </div>
  );
};

export default Questions;
