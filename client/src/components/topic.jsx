import React, { useState, useEffect } from 'react';
import Questions from './questions';
import MeetingTime from './timeZone';

const Topic = (props) => {
  // State to store the fetched topic and details

  // const istTimeInput = '18:30'; // Replace with user input
  // // Get user's time zone dynamically
  // const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="topic-container">
      <Questions sessionData={props.sessionData}/>
    </div>
  );
};

export default Topic;
