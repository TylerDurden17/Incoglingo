import React, { useState, useEffect } from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useOutletContext } from 'react-router-dom';
import './CreateSessionItem.css'

function CreateSessionItem() {
  const user = useOutletContext();

  const [formData, setFormData] = useState({
    topic: '',
    timing: '',
    description: ''
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // new state variable
  const [hasError, setHasError] = useState(false); // new state variable

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
     ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // set loading state to true
    setIsButtonDisabled(true); // disable button while loading

    // formData.organizer = user.uid;
    formData.organizer = {organizerId:user.uid, organizerName:user.displayName};

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

        const { sessionId, roomId } = await response.json();
        console.log('Session created with ID:', sessionId);
        console.log('Room ID:', roomId);
      } else if (response.status === 403) {
        setHasError(true); // set error state to true
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
        setHasError(true); // set error state to true
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
      setHasError(true); // set error state to true
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
    } finally {
      setIsLoading(false); // set loading state to false
      setIsButtonDisabled(false); // enable button again
      setFormData({topic: '', timing: '', description: ''})
    }
  };

  useEffect(() => {
    const anyFieldChanged = Object.values(formData).some(
      (value) => value.trim()!== ''
    );
    setIsButtonDisabled(!anyFieldChanged);
  }, [formData]);

  return (
    <>
      <ToastContainer/>
      <form onSubmit={handleSubmit} className="form">
  <div className="form-group">
    <label htmlFor="topic">Topic:</label>
    <input
      type="text"
      id="topic"
      name="topic"
      value={formData.topic}
      onChange={handleChange}
      required
      className="form-control"
    />
  </div>
  <div className="form-group">
    <label htmlFor="timing">Timing:</label>
    <input
      type="text"
      id="timing"
      name="timing"
      value={formData.timing}
      onChange={handleChange}
      required
      className="form-control"
    />
  </div>
  <div className="form-group">
    <label htmlFor="description">Description:</label>
    <textarea
      id="description"
      name="description"
      value={formData.description}
      onChange={handleChange}
      required
      className="form-control"
    />
  </div>
  {isLoading ? (
    <button disabled type="submit" className="btn btn-loading">
      <span>Loading...</span>
    </button>
  ) : (
    <button disabled={isButtonDisabled} type="submit" className="btn btn-submit">
      Submit
    </button>
  )}
</form>
      {hasError && (
        <div style={{ color:'red' }}>
          Error: Unable to create session. Please try again.
        </div>
      )}
    </>
  );
}

export default CreateSessionItem;