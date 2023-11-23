import React from 'react';

const Questions = () => {
  // Ice breaker questions
  const iceBreakerQuestions = [
    "What product would you stockpile if you found out it wasn't going to be sold anymore?",
    "Do you like to make jokes? What kind?",
    "What is something that always makes you feel nostalgic?",
    "What sorts of food do you like eating most? [Why?]",
    "What are some of the turning points in your life?",
    "What is your favorite type of hat?",
    "What's the nicest thing someone has done for you?",
    "What is something you wish you knew more about?"
    // Add more ice breaker questions here
  ];

  // Main topic questions
  const mainTopicQuestions = [
    "Name a difficult but important lesson you have learned.",
  "Can we learn more from success or failure?",
  "What is easy for you but hard for others?",
  "What is hard for you but easy for others?",
  "What new habit do you wish to develop?",
  "What bad habit do you wish to give up?",
  "What do you like most about yourself?",
  "When do you feel the most like your true self?"
    // Add more main topic questions here
  ];

  return (
    <div className="questions-container">
      <div className="ice-breaker-questions">
        <h5>Ice Breaker Questions</h5>
        <ul>
          {iceBreakerQuestions.map((question, index) => (
            <li key={index}>{question}</li>
          ))}
        </ul>
      </div>
      <div className="main-topic-questions">
        <h5>Main Topic Questions</h5>
        <ul>
          {mainTopicQuestions.map((question, index) => (
            <li key={index}>{question}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Questions;
