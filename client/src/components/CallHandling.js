import React, { useState, useEffect, useRef } from 'react';
import newPeer from '../peerobj';
import {socket} from '../socket';
import Modal from "react-modal";
import { MdMic, MdMicOff, MdCallEnd } from "react-icons/md";

function CallHandling(props) {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const videoRefs = useRef([]);
    const [call, setCall] = useState(null);
    const [answerCall, setAnswerCall] = useState(null);
    const [streams, setStreams] = useState({});
    const [users, setUsers] = useState({});
    const [isMuted, setIsMuted] = useState(false);
    const [myStream, setMyStream] = useState(null);

    // useEffect(() => {
    // },[]);

    useEffect(() => {
        // Set the srcObject property of each video element
        Object.values(streams).forEach((stream, index) => {
            videoRefs.current[index].srcObject = stream.stream;
        });
            
    }, [streams]); 

    useEffect(() => {

        if(localStorage.getItem('microphonePermission') === null) {
            setModalIsOpen(true);
        }
        
        if(localStorage.getItem('microphonePermission') === 'false'){
            setModalIsOpen(true);
        }
        
        navigator.mediaDevices.getUserMedia({ video: false, audio: true })
        .then(stream => {
            setMyStream(stream);
            localStorage.setItem('microphonePermission', true);
            setModalIsOpen(false);
        })
        .catch(error => {
            console.error('Error answering call.', error);
            setModalIsOpen(true);
            localStorage.setItem('microphonePermission', false);
        });

        socket.on('user-connected', (userId, name) => {
            // The square brackets around userId indicate that its value is a dynamic property name.
            // This syntax is called computed property names and it allows you to dynamically set object property names based on the value of a variable.
            // the purpose of status is to remove the call button when a call has been made
            setUsers(prevUsers => ({ ...prevUsers, [userId]: {name: name, status: false } }));
        });

        socket.on('user-disconnected', (userId) => {
            setUsers((prevUsers) => {
                const newUsers = { ...prevUsers };
                delete newUsers[userId];
                return newUsers;
            });
        });

        return () => {
            socket.off('user-connected');
            socket.off('user-disconnected');
            newPeer.destroy();
            // Disconnect the peer connection and clean up media streams
            newPeer.disconnect();
        };

    }, []);

    useEffect(() => {
            // set up listener to answer call
            newPeer.on('call', call => {
                setAnswerCall(call); //necessary line without it video element wouldn't disappear 
                call.answer(myStream);
                call.on('stream', incomingStream => {
                    // Add the incoming stream to the streams state
                    setStreams(prevStreams => ({...prevStreams, [call.peer]: {name: call.options.metadata, stream:incomingStream}}));
                });

                socket.on('user-disconnected', (userId) => {
                    if(call.peer===userId){
                        call.close();
                    }
                });
                socket.on('disconnect', () => {
                    call.close();
                    setStreams({});
                    setUsers({});
                    window.location.href = `/`;
                });
                // Return a cleanup function to stop all tracks and release resources used by the stream
                return () => {
                    call.close();
                };

            });
    }, [myStream])
    
    
    function handleClick(userId) {
        // Check if a call is already in progress with the selected user
        if (call !== null && call.peer === userId) {
            alert('Call with user already in progress');
            return;
        }

        const options = {metadata: props.naam}
        setCall(newPeer.call(userId, myStream, options));
        // to remove the call button after call was made
        setUsers(prevUsers => ({
            ...prevUsers,
            [userId]: {
                ...prevUsers[userId], // copy the existing user object
                status: true // update the status field
            }
        }));
    }

    function handleMuteClick() {
        const newIsMuted = !isMuted; // Update isMuted first
        setIsMuted(newIsMuted);
        myStream.getAudioTracks()[0].enabled = isMuted;
    }

    function handleEndClick() {
        socket.disconnect();
    }

    useEffect(() => {
        if (call) {
            call.on('stream', userVideoStream => {
                // Check if the stream is already in the state before adding it. If not it
                // will cause multiple audio elements to be rendered on the page for each subsequent call to the same user.
                if (!streams[call.peer]) {
                    setStreams(prevStreams => ({...prevStreams, [call.peer]: {name: users[call.peer].name, stream:userVideoStream}}));
                    //  setStreams(prevStreams => ({ ...prevStreams, [call.peer]: userVideoStream }));
                    //setUsers(prevUsers => ({ ...prevUsers, [call.peer]: { ...prevUsers[call.peer], name: prevUsers[call.peer].name || 'Anonymous' } }));
                    
                }
            });

            socket.on('user-disconnected', (userId) => {
                if (call.peer === userId ) {
                    call.close();
                }
            });
            socket.on('disconnect', () => {
                call.close();
                setStreams({});
                setUsers({});
                window.location.href = `/`;
            });
            call.on('close', () => {
                setStreams((prevStreams) => {
                    const newStreams = { ...prevStreams };
                    delete newStreams[call.peer];
                    return newStreams;
                });
                setCall(null);
            });
        }
        if(answerCall){
            answerCall.on('close', ()=> {
                setStreams((prevStreams) => {
                    const newStreams = { ...prevStreams };
                    delete newStreams[answerCall.peer];
                    return newStreams;
                });
                setAnswerCall(null);
            })
        }
    }, [call, streams, answerCall]);

    return (
        <>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Microphone Access Modal"
                ariaHideApp={false}
                shouldCloseOnOverlayClick={false} // Prevent closing on click outside
                shouldCloseOnEsc={false} // Prevent closing on escape key
                >
                <div className='modalContent'>
                    <div>
                        <h1>Microphone Access Required</h1>
                        <img src='https://i.imgur.com/GncKY89.png' alt="from address bar allow microphone"
                        style={{ width: '200px'}}></img>
                        <p>You can turn off your microphone any time you want.</p>
                    </div>
                </div>
            </Modal>

            {Object.keys(users).length === 0 && Object.keys(streams).length === 0 ? (
                <p>Please wait for people to join the room or them to call you</p>
            ) : (
            <>
                <div id={"call-handling"}>
                    <ul className="video-list">
                        {Object.values(streams).map((stream, index) => (
                            
                            <li className="video-item" key={stream.stream.id}>
                                <audio key={stream.stream.id} ref={el => videoRefs.current[index] = el} autoPlay></audio>
                                <p>{stream.name} 🔊</p> 
                            </li>
                            
                        ))}
                    </ul>
                    
                    <div className="button-container">
                        {Object.keys(users).map((userId) => (
                            users[userId].status === false && (
                                <button id={"call-button"} key={userId} onClick={() => handleClick(userId)}>Click here to Call {users[userId].name}</button>
                            )
                        ))}

                        <button id={"muteButton"} onClick={() => handleMuteClick()} style={{
                            backgroundColor: isMuted ? '#ea4335' : '#6495ED'
                        }}>
                            {isMuted ? <MdMicOff /> : <MdMic />}
                        </button>
                        <button id={"endCall"} onClick={() => handleEndClick()}><MdCallEnd/></button>

                    </div>
                </div>
            </>
          )}
        </>
      );
      
}

export default CallHandling;