import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from "react";

function IndividualSessionData({roomId, handleQuestionsfromChild}) {

  async function fetchData() {
    const response = await fetch(`https://incoglingo.onrender.com/individualsessiondata/${roomId}`);
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }
    return response.json();
  }

  const { data: myData, error: err, isLoading: loading, isSuccess: success } = useQuery({
      queryKey: ['myData'], queryFn: fetchData
  });

  useEffect(()=>{
    handleQuestionsfromChild(myData)
  }, [myData])
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if(success) {
    const dataArray = Object.entries(myData);
    return (
      <>
        <div className="data-list">
          {dataArray.map(([key, value]) => {
            switch (key) {
              case 'topic':
              case 'description':
              case 'timing':
              case 'bookedSeats':
                return (
                  <div key={key} style={{ marginBottom: '10px' }}>
                    <strong style={{ marginRight: '5px' }}>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                  </div>
                );
              case 'createdAt':
                const timestamp = {"_seconds": value._seconds, "_nanoseconds": value._nanoseconds};
                const date = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1e6);
                const formattedDate = date.toLocaleString();
                return (
                  <div key={key} style={{ marginBottom: '10px' }}>
                    <strong style={{ marginRight: '5px' }}>Created At:</strong> {formattedDate}
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>
        
      </>
    );
  }

  if (err) {
    if (err.message.includes('Document not found with roomId')) {
      return <div>This session doesn't exist.</div>;
    } else {
      return <div>Error: {err.message}</div>;
    }
  }
}

export default IndividualSessionData;