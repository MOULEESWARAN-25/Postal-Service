import React, { useRef, useEffect, useState } from 'react';

const CameraCaptureWithAddress = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [address, setAddress] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(false);

  const GOOGLE_MAPS_API_KEY = '[REDACTED_GOOGLE_MAPS_KEY]'; // Replace with your actual API key

  useEffect(() => {
    const getCameraStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing the camera:', error);
      }
    };

    const getLocationAndAddress = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setLoadingAddress(true);
            try {
              // Fetch address using Google Maps Geocoding API
              const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
              );
              const data = await response.json();
              if (data.results && data.results[0]) {
                setAddress(data.results[0].formatted_address);
              } else {
                setAddress('Address not found');
              }
            } catch (error) {
              console.error('Error fetching address:', error);
              setAddress('Error fetching address');
            } finally {
              setLoadingAddress(false);
            }
          },
          (error) => {
            console.error('Error getting location:', error);
            setAddress('Location access denied');
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        setAddress('Geolocation not supported');
      }
    };

    getCameraStream();
    getLocationAndAddress();
  }, []);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const context = canvas.getContext('2d');
      // Set the canvas size to match the video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the current video frame onto the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Add address text on the canvas
      if (address) {
        context.font = '20px Arial';
        context.fillStyle = 'red';
        context.fillText(address, 10, canvas.height - 20);
      }

      // Convert the canvas content to a Base64-encoded image
      const dataURL = canvas.toDataURL('image/png');
      setPhoto(dataURL);
    }
  };

  const savePhoto = () => {
    if (photo) {
      const link = document.createElement('a');
      link.href = photo;
      link.download = 'photo_with_address.png';
      link.click();
    }
  };

  return (
    <div>
      <h2>Camera Capture with Address</h2>
      {/* Live video feed */}
      <video ref={videoRef} autoPlay style={{ width: '100%', height: 'auto', border: '1px solid black' }} />

      {/* Hidden canvas used for capturing frames */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Show loading state or address */}
      {loadingAddress ? (
        <p>Loading address...</p>
      ) : (
        <p><strong>Address:</strong> {address || 'Fetching address...'}</p>
      )}

      {/* Controls for capturing and saving photos */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={capturePhoto}>Capture Photo</button>
        <button onClick={savePhoto} disabled={!photo}>Save Photo</button>
      </div>

      {/* Display captured photo */}
      {photo && (
        <div style={{ marginTop: '20px' }}>
          <h3>Captured Photo with Address:</h3>
          <img src={photo} alt="Captured" style={{ width: '100%', height: 'auto', border: '1px solid black' }} />
        </div>
      )}
    </div>
  );
};

export default CameraCaptureWithAddress;
