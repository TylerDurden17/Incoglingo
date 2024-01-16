import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import Countdown from 'react-countdown';

const MeetingTime = () => {
  const [meetingTime, setMeetingTime] = useState('');
  const [zone, setZone] = useState('');

    
  // Calculate the target time for 6:30pm UTC
  const targetDate = new Date('2024-01-16T17:00:00Z');

  const CountdownRenderer = ({ days, hours, minutes, seconds }) => {
    return (
      <span style={{ color: 'green' }}>
        session in {days} days {hours} hours {minutes} minutes {seconds} seconds
      </span>
    );
  };
  
  useEffect(() => {
    //explicitly specify the time zone when creating the initial moment object
    const meetingTimeUTC = moment.tz('2023-12-07T22:30:00', 'Asia/Kolkata')

    const userTimezone = moment.tz.guess();
    setZone(userTimezone)

    const meetingTimeUserTz = meetingTimeUTC.clone().tz(userTimezone);

    setMeetingTime(meetingTimeUserTz.format('hh:mm a'));
  }, []);

  return (
    <>
      <div> Talk at: <b>{meetingTime}</b> ({zone} timezone)</div>
      <Countdown date={targetDate} renderer={CountdownRenderer} />
    </>
  );
};

export default MeetingTime;
  