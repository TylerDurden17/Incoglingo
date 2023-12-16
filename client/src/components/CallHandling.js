import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdMic, MdMicOff, MdCallEnd } from "react-icons/md";
import Spinner from 'react-bootstrap/Spinner';

function CallHandling(props) {
    const navigate = useNavigate();
    const videoRefs = useRef([]);
    const [call, setCall] = useState(null);
    const [answerCall, setAnswerCall] = useState(null);
    const [streams, setStreams] = useState({});
    const [users, setUsers] = useState({});
    const [isMuted, setIsMuted] = useState(false);
    const [myStream, setMyStream] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Set the srcObject property of each video element
        Object.values(streams).forEach((stream, index) => {
            videoRefs.current[index].srcObject = stream.stream;
        });
            
    }, [streams]); 

    useEffect(() => {
        
        navigator.mediaDevices.getUserMedia({ video: false, audio: true })
        .then(stream => {
            setMyStream(stream);
            // localStorage.setItem('microphonePermission', true);
            // setModalIsOpen(false);
        })
        .catch(error => {
            console.error('Error answering call.', error);
            // setModalIsOpen(true);
            // localStorage.setItem('microphonePermission', false);
        });

        props.socket.on('user-connected', (userId, name) => {
            // The square brackets around userId indicate that its value is a dynamic property name.
            // This syntax is called computed property names and it allows you to dynamically set object property names based on the value of a variable.
            // the purpose of status is to remove the call button when a call has been made
            setUsers(prevUsers => ({ ...prevUsers, [userId]: {name: name, status: false } }));
        });

        props.socket.on('user-disconnected', (userId) => {
            setUsers((prevUsers) => {
                const newUsers = { ...prevUsers };
                delete newUsers[userId];
                return newUsers;
            });
        });

        return () => {
            props.socket.off('user-connected');
            props.socket.off('user-disconnected');
            props.newPeer.destroy();
            // Disconnect the peer connection and clean up media streams
            props.newPeer.disconnect();
        };

    }, []);

    useEffect(() => {
            // set up listener to answer call
            props.newPeer.on('call', call => {
                setAnswerCall(call); //necessary line without it video element wouldn't disappear 
                call.answer(myStream);
                call.on('stream', incomingStream => {
                    // Add the incoming stream to the streams state
                    setStreams(prevStreams => ({...prevStreams, [call.peer]: {name: call.options.metadata, stream:incomingStream}}));
                });

                props.socket.on('user-disconnected', (userId) => {
                    if(call.peer===userId){
                        call.close();
                    }
                });
                props.socket.on('disconnect', () => {
                    call.close();
                    setStreams({});
                    setUsers({});
                    navigate(`/`);
                    
                });
                // Return a cleanup function to stop all tracks and release resources used by the stream
                return () => {
                    call.close();
                };

            });
    }, [myStream])
    
    
    function handleClick(userId) {
        setLoading(true);
        // Check if a call is already in progress with the selected user
        if (call !== null && call.peer === userId) {
            alert('Call with user already in progress');
            return;
        }

        const options = {metadata: props.name}
        
        setCall(props.newPeer.call(userId, myStream, options));
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
        props.socket.disconnect();
        props.newPeer.destroy();
    }

    useEffect(() => {
        if (call) {
            call.on('stream', userVideoStream => {
                // Check if the stream is already in the state before adding it. If not it
                // will cause multiple audio elements to be rendered on the page for each subsequent call to the same user.
                if (!streams[call.peer]) {
                    setStreams(prevStreams => ({...prevStreams, [call.peer]: {name: users[call.peer].name, stream:userVideoStream}}));
                    setLoading(false);

                    //  setStreams(prevStreams => ({ ...prevStreams, [call.peer]: userVideoStream }));
                    //setUsers(prevUsers => ({ ...prevUsers, [call.peer]: { ...prevUsers[call.peer], name: prevUsers[call.peer].name || 'Anonymous' } }));
                    
                }
                else{console.log('error');}
            });

            props.socket.on('user-disconnected', (userId) => {
                if (call.peer === userId ) {
                    call.close();
                }
            });
            props.socket.on('disconnect', () => {
                call.close();
                setStreams({});
                setUsers({});
                navigate(`/`);
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
            {Object.keys(users).length === 0 && Object.keys(streams).length === 0 ? (
                <p>Please wait for people to join the room or them to add you</p>
            ) : (
                <>
                    <div id={"call-handling"}>

                    <ul className="video-list">
                        {Object.values(streams).map((stream, index) => (
                            <React.Fragment key={index}>
                                <li className="video-item" key={`li-${stream.stream.id}`}>
                                    <audio ref={el => videoRefs.current[index] = el} autoPlay key={`audio-${stream.stream.id}`}></audio>
                                    <p>{stream.name} 🔊</p>
                                </li>
                            </React.Fragment>
                        ))}
                    </ul>
                        {loading ? 
                            <Spinner style={{marginLeft:'30px'}} animation="border" role="status" size="sm">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        :<></>}
                        
                        <div className="button-container">

                            {Object.keys(streams).length !== 0 && (
                                <>
                                    <button id={"muteButton"} onClick={() => handleMuteClick()} style={{
                                        backgroundColor: isMuted ? '#ea4335' : '#6495ED'
                                    }}>
                                        {isMuted ? <MdMicOff /> : <MdMic />}
                                    </button>
                                    <button id={"endCall"} onClick={() => handleEndClick()}><MdCallEnd/></button>
                                </>
                            )}

                        </div>
                    </div>

                    <div style={{marginTop:"20px"}} id={"buttonsThatAddPeers"}>
                        {Object.keys(users).map((userId) => (
                            users[userId].status === false && (
                                <div className={"parent-call-button"} key={userId}>
                                    <label style={{ margin: "5px" }}> Add <b>{users[userId].name}</b> for audio chat</label>
                                    <button style={{ margin: "5px" }} id={"child-call-button"} onClick={() => handleClick(userId)}>Add</button>
                                </div>
                            )
                        ))}
                    </div>

                </>
            )}
        </>
      );
      
}

export default CallHandling;