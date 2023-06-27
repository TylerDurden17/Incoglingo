import CallHandling from "./CallHandling";
import React, {useEffect} from 'react';
import { useLocation } from 'react-router-dom';

function VideoGrid(props){
  const location = useLocation();

  useEffect(() => {
    // Track page view when the component is mounted or when the location changes
    window.gtag('event', 'page_view', { page_path: location.pathname });

  }, [location]);
  
    return (
      <>
        <CallHandling name={props.name}/>
      </>
    );
}


export default VideoGrid;