import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';

const MeetingTime = () => {
  const [meetingTime, setMeetingTime] = useState('');
  const [zone, setZone] = useState('');
  
  useEffect(() => {
    //explicitly specify the time zone when creating the initial moment object
    const meetingTimeUTC = moment.tz('2023-12-07T18:30:00', 'Asia/Kolkata')

    const userTimezone = moment.tz.guess();
    setZone(userTimezone)

    const meetingTimeUserTz = meetingTimeUTC.clone().tz(userTimezone);

    setMeetingTime(meetingTimeUserTz.format('hh:mm a'));
  }, []);

  return (
    <>
      <p> Talk at: <b>{meetingTime}</b> ({zone} timezone)</p>
    </>
  );
};

export default MeetingTime;
  