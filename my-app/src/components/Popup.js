import React from 'react';
import './Popup.css'; 
import profileData from '../assets/profile.json';

const Popup = ({ onClose }) => {
    const { firstName, lastName, age, sex } = profileData;
  
    return (
      <div className="popup-overlay">
          <div className="popup">
            <h2>Health Report Approved</h2>
            <p>Report for {firstName} {lastName.charAt(0)}. Age: {age} Sex: {sex} has been approved. Health insurer will receive this information promptly.</p>
          </div>
        </div>
    );
  };

export default Popup;