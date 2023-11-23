import React, { useState, useEffect } from 'react';
import Questions from './questions';

const Topic = () => {
  // State to store the fetched topic and details
  const [topic, setTopic] = useState('');
  const [topicDetail, setTopicDetail] = useState('');

  // Function to fetch the topic and details from the database (you'll need to implement this)
  const fetchTopicFromDatabase = async () => {
    try {
      // Replace this with your actual API call to fetch the topic and details
      // const response = await fetch('YOUR_API_ENDPOINT');
      // const data = await response.json();

      // Update the state with the fetched topic and details
      setTopic('What fictional character do you relate the most to? Why?');
      setTopicDetail('25 November 07:30 PM (1 hour)');
    } catch (error) {
      console.error('Error fetching topic:', error);
      // You can set some default or fallback values for the topic and details in case of an error
      setTopic('Topic: English Language Tips');
      setTopicDetail('Learn and share English speaking tips!');
    }
  };

  // useEffect hook to fetch the topic and details when the component mounts
  useEffect(() => {
    fetchTopicFromDatabase();
  }, []);

  return (
    <div className="topic-container">
      <h3 className="topic">Today's topic: {topic}</h3>
      <small className="topic-detail">{topicDetail}</small>
      <br></br>
      <br></br>
      <Questions/>
    </div>
  );
};

export default Topic;
