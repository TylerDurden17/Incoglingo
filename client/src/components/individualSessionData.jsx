import { useQuery } from '@tanstack/react-query';

function IndividualSessionData(props) {

  async function fetchData() {
    const response = await fetch(`http://localhost:8080/individualsessiondata/${props.roomId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return response.json();
  }

  const { data: myData, error: err, isLoading: loading } = useQuery({
      queryKey: ['myData'], queryFn: fetchData
  });
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (err) {
    return <div>Error: {err.message}</div>;
  }

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

export default IndividualSessionData;