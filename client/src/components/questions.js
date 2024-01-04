import React from 'react';

const Questions = () => {
  // Ice breaker questions
  const iceBreakerQuestions = [
    "What is the strongest emotional connection you've ever felt with a person? (It doesn't have to be romantic.)",
    "How do you think the process of cooking and sharing food can strengthen relationships and foster a sense of community?",
    "Do you believe we are born with innate characteristics, or are we shaped by our experiences?",
    "What was the last problem you solved and how did you do it?",
    "What is the best smartphone on the market?",
    "When does time go too fast for you?",
    "What's the biggest health scare you've had?",
    "What's the best book you've ever read, and what did you love about it?"
  ];

  // Main topic questions
  const mainTopicQuestions = [
    "Would you rather be a jack-of-all-trades or master one?",
    "What weird skill do you have?",
    "If you could be an expert at one thing, what would it be?",
    "What is more important: natural talent or hard work?",
    "Do you consider yourself a creative person? Why?",
    "How does self-confidence affect a person's creativity?",
    "Who are history's most talented people?",
    "Who is the most impressive person you know?"
  ];

  return (
    <div className="questions-container">
      <div className="ice-breaker-questions">
        <h5>Ice Breaker Questions</h5>
        <ol type='a'>
          {iceBreakerQuestions.map((question, index) => (
            <li key={index}>{question}</li>
          ))}
        </ol>
      </div>
      <div className="main-topic-questions">
        <h5>Main Topic Questions</h5>
        <ol>
          {mainTopicQuestions.map((question, index) => (
            <li key={index}>{question}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Questions;
