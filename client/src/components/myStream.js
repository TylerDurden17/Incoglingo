import React, { useRef, useEffect } from "react";

function MyStream(props) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = props.myStream;
    }
  }, [props.myStream]);

  return (
    <>
          <video className="video-item" ref={videoRef} autoPlay></video>
          <p>You</p>
    </>
  );
}

export default MyStream;
