import React, { useState, useEffect } from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useOutletContext } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import './CreateSessionItem.css'

function CreateSessionItem() {
  const user = useOutletContext();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    topic: '',
    timing: '',
    description: '',
    iceBreakerQuestions: [],
    mainQuestions: [],
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const { mutate: sendSessionData, isPending, isError } = useMutation({
    mutationFn: async (sessionData) => {
      const response = await fetch('https://incoglingo.onrender.com/sendSessionData', {
        method: 'POST',
        body: JSON.stringify(sessionData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('You are not a Partner');
        } else {
          throw new Error('Failed to add data');
        }
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sessions']});
      queryClient.invalidateQueries({ queryKey: ['bookedSessions']});
      const notify = () =>
        toast.success('Session data posted', {
          position: 'bottom-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
          transition: Bounce,
        });
      notify();

      const { sessionId, roomId } = data;
      console.log('Session created with ID:', sessionId);
      console.log('Room ID:', roomId);
    },
    onError: (error) => {
      const notify = () =>
        toast.error(error.message, {
          position: 'bottom-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
          transition: Bounce,
        });
      notify();
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleQuestionChange = (e, type) => {
    const { value } = e.target;
    const questions = value.split('\n');
    setFormData((prevState) => ({ ...prevState, [type]: questions }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const sessionData = {
      ...formData,
      organizer: { organizerId: user.uid, organizerName: user.displayName },
    };

    sendSessionData(sessionData);
  };

  useEffect(() => {
    const { iceBreakerQuestions, mainQuestions, ...restFormData } = formData;
    const anyFieldChanged = Object.values(restFormData).some((value) => value.trim() !== '');
    setIsButtonDisabled(!anyFieldChanged);
  }, [formData]);

  return (
    <>
      <ToastContainer/>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <input
            type="text"
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            required
            placeholder="Enter topic"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            id="timing"
            name="timing"
            value={formData.timing}
            onChange={handleChange}
            required
            placeholder="Enter timing"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Enter description"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <textarea
            id="iceBreakerQuestions"
            name="iceBreakerQuestions"
            value={formData.iceBreakerQuestions.join('\n')}
            onChange={(e) => handleQuestionChange(e, 'iceBreakerQuestions')}
            placeholder="Enter ice breaker questions here, one per line...
When does time go too fast for you?
What's the biggest health scare you've had?"
            rows="3"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <textarea
            id="mainQuestions"
            name="mainQuestions"
            value={formData.mainQuestions.join('\n')}
            onChange={(e) => handleQuestionChange(e, 'mainQuestions')}
            className="form-control"
            placeholder="Enter Main Questions here, one per line...
What weird skill do you have?
Who are history's most talented people?"
            rows="3"
          />
        </div>
        {isPending ? (
  <button disabled type="submit" className="btn btn-loading">
    <span>Loading...</span>
  </button>
) : isError ? (
  <button disabled type="submit" className="bttn bttn-submit">
    Submit
  </button>
) : (
  <button disabled={isButtonDisabled} type="submit" className="bttn bttn-submit">
    Submit
  </button>
)}
</form>
      {isError && (
        <div style={{ color:'red' }}>
          Error: Unable to create session. Please try again.
        </div>
      )}
    </>
  );
}

export default CreateSessionItem;