import React, { useEffect, useState } from "react";
import CountryList from "react-select-country-list";
import {Button} from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';
import {ToastContainer, toast, Bounce} from '../toast'

function UserForm() {
    const user = useOutletContext();
    const [formData, setFormData] = useState({
        level: '',
        country: '',
        birthday: '',
        bio: '',
      });
    
    const options = CountryList().getData();
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const changeHandler = event => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
      };
    
    const handleSubmit = async e => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const formDataArray = Array.from(formData.entries());
        const profileData = {
            // using the UID directly ties the Firestore data to the corresponding
            // Firebase Auth user
            uid: user.uid,
            formData: Object.fromEntries(formDataArray)
        };

        try {
            const response = await fetch('http://localhost:8080/sendProfileData', {
                method: 'POST',
                body: JSON.stringify(profileData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.ok) {
                const result = await response.json();
                console.log('Data added to Firestore:', result);
                const notify = () => toast.success('Profile data added', {
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
            } 
            else {
                const notify = () => toast.error('Profile data not added', {
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
                console.error('Failed to add data to Firestore:', response.statusText);
            }
        } catch (error) {
            const notify = () => toast.error('Profile data not added', {
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
            console.error('Error while adding data to Firestore:', error);
        }

    };
    //fetch data in the fields
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`http://localhost:8080/getProfileData/${user.uid}`, {
                method: 'GET'
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Data fetched from Firestore:', result);
                setFormData({
                    level: result.level || '',
                    country: result.country || '',
                    birthday: result.birthday || '',
                    bio: result.bio || ''
                });
            } else {
                console.error('Failed to fetch data from Firestore:', response.statusText);
            }
        };

        fetchData();
    }, []); 

    //don't enable submit until atleast one field is filled
    useEffect(() => {
        const anyFieldChanged = Object.values(formData).some(
            (value) => value.trim() !== ''
          );
        setIsButtonDisabled(!anyFieldChanged);
    }, [formData]);

    return(
    <> 
    <ToastContainer/>
        <form name="userForm" method="post" onSubmit={handleSubmit} style={{border: "1px solid", borderColor: "#6666665e", borderRadius: "21px", padding: '20px', maxWidth: '500px', margin: '1rem auto' }}> 
            <strong style={{ display: 'block', marginBottom: '10px' }}>Complete your profile:</strong>
            <div style={{ marginBottom: '10px' }}>
                <label htmlFor="level" style={{ display: 'block' }}>Level:
                    <select required name="level" id="level" style={{ background: "#0000000a", width: '100%', padding: '8px', margin: '5px 0' }}
                    value={formData.level} onChange={changeHandler}>
                        <option value="a1">A1</option>
                        <option value="a2">A2</option>
                        <option value="b1">B1</option>
                        <option value="b2">B2</option>
                        <option value="c1">C1</option>
                        <option value="c2">C2</option>
                    </select>
                </label>
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label htmlFor="country" style={{ display: 'block' }}>Country:
                    <select required name="country" style={{ background: "#0000000a",  width: '100%', padding: '8px', margin: '5px 0' }} 
                            value={formData.country} onChange={changeHandler}>
                        {options.map(option => (
                            <option key={option.value} value={option.value}>
                            {option.label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label htmlFor="birthday" style={{ display: 'block' }}>Birthday:
                    <input
                        type="date"
                        id="birthday"
                        name="birthday"
                        style={{ background: "#0000000a", borderWidth: "thin", width: '100%', padding: '8px', margin: '5px 0' }}
                        value={formData.birthday} onChange={changeHandler}
                    />
                </label>
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label htmlFor="bio" style={{ display: 'block' }}>Bio:
                    <textarea
                        id="bio"
                        name="bio"
                        style={{ background: "#0000000a",  width: '100%', padding: '8px', margin: '5px 0' }}
                        value={formData.bio} onChange={changeHandler}
                    />
                </label>
            </div>

            <Button disabled={isButtonDisabled} variant="secondary" type="submit" >Save</Button>
            <div id="LevelsForReference"><br/>
                <div>
                    <p>English Proficiency Levels:</p>
                    <ul>
                        <li><strong>A1:</strong> Beginner</li>
                        <li><strong>A2:</strong> Pre-Intermediate</li>
                        <li><strong>B1:</strong> Intermediate</li>
                        <li><strong>B2:</strong> Upper-Intermediate</li>
                        <li><strong>C1:</strong> Advanced</li>
                        <li><strong>C2:</strong> Proficient</li>
                    </ul>
                </div>
            </div>
        </form>
    </>
    )
}

export default UserForm;