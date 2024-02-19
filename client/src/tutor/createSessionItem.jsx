import React, { useState, useEffect } from 'react';
import {ToastContainer, toast, Bounce} from '../toast'
import { useOutletContext } from 'react-router-dom';

function CreateSessionItem() {
  const user = useOutletContext();

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
    setFormData({topic: '', timing: '', description: ''})
    e.preventDefault();

    formData.id = user.uid;
    formData.organizer = user.displayName;

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
            const notify = () => toast.success('Session data posted', {
              position: "bottom-center",
              autoClose: 2500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
              transition: Bounce
            });
            notify();
        } else if (response.status ===  403) {
            // Display a message to the user
            const notify = () => toast.error('You are not a Partner', {
              position: "bottom-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
              transition: Bounce
            });
            notify();
        } else {
          const notify = () => toast.error('Failed to add data', {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce
          });
          notify();
          console.error('Failed to add data to Firestore:', response.statusText);
        }
    } catch (error) {
      const notify = () => toast.error('Failed to add data', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce
      });
      notify();
        console.error('Error while sending data to backend:', error);
    }
  };

  useEffect(() => {
    const anyFieldChanged = Object.values(formData).some(
        (value) => value.trim() !== ''
      );
    setIsButtonDisabled(!anyFieldChanged);
}, [formData]);

  return (
    <>
      <ToastContainer/>
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
    </>
  );
}

export default CreateSessionItem;
