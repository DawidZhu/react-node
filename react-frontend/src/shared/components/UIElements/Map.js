import React, { useRef, useEffect } from 'react';

import './Map.css';
// MaP 组件
const Map = props => {
  // useRef 作用？
  const mapRef = useRef();

  
  const { center, zoom } = props;
// useEffect 作用？
  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoom
    });
  
    new window.google.maps.Marker({ position: center, map: map });
  }, [center, zoom]);  

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;
