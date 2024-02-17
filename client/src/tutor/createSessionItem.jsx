import React, { useState, useEffect } from 'react';

function CreateSessionItem(props) {
  const [formData, setFormData] = useState({
    topic: '',
    timing: '',
    description: ''
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    formData.id = props.user.uid;
    formData.organizer = props.user.displayName;

    // Handle form submission, e.g., send data to backend
    try {
      const response = await fetch('http://localhost:8080/sendSessionData', {
          method: 'POST',
          body: JSON.stringify(formData),
          headers: {
              'Content-Type': 'application/json'
          }
      });

      if (response.ok) {
          const result = await response.json();
          console.log('Data added to Firestore:', result);
      } else {
          console.error('Failed to add data to Firestore:', response.statusText);
      }
    } catch (error) {
        console.error('Error while adding data to Firestore:', error);
    }
  };

  useEffect(() => {
    const anyFieldChanged = Object.values(formData).some(
        (value) => value.trim() !== ''
      );
    setIsButtonDisabled(!anyFieldChanged);
}, [formData]);

  return (
    <form onSubmit={handleSubmit} style={{border: "1px solid", borderColor: "#6666665e", padding: '20px', maxWidth: '500px', margin: '1rem auto' }}>
      <div>
        <label htmlFor="topic">topic:</label>
        <input
          type="text"
          id="topic"
          name="topic"
          value={formData.topic}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="timing">Timing:</label>
        <input
          type="text"
          id="timing"
          name="timing"
          value={formData.timing}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <button disabled={isButtonDisabled} type="submit">Submit</button>
    </form>
  );
}

export default CreateSessionItem;
