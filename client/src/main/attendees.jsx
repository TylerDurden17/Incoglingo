import React from 'react';
import { Link } from 'react-router-dom';

function Attendees({attendees}) {

  return (
    <div>
      {attendees.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {attendees.map((attendee) => (
              <tr key={attendee.learnerId}>
                <td style={{ paddingLeft: '10px' }}><Link to={`/${attendee.learnerId}`}>{attendee.learnerName}</Link> </td>
                <td style={{ paddingLeft: '10px' }}>{attendee.learnerEmail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No attendees yet</p>
      )}
      <style>{`
        table {
          border-collapse: collapse;
          width: 100%;
        }

        th, td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
      `}</style>
    </div>
  );
}

export default Attendees;