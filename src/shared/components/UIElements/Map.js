import React, { useRef, useEffect } from 'react';

import './Map.css';

const Map = props => {
  const mapRef = useRef();
  
  const { center, zoom } = props;

  useEffect(() => {
    var platform = new window.H.service.Platform({
      'apikey': 'MnbP1YI-LPPbjyLWVXxXkPejjlirjme__UvoPeMQXeU'
    });
    var defaultLayers = platform.createDefaultLayers();
    
    new window.H.Map(
        document.getElementById('map'),
        defaultLayers.vector.normal.map,
        {
          zoom,
          center
        });

      }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
      id="map"
    ></div>
  );
};

export default Map;