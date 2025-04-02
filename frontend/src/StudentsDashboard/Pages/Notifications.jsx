import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Notifications.css';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications] = useState([
    { id: 1, title: 'System Update', message: 'The system will be down for maintenance at midnight.' },
    { id: 2, title: 'New Feature', message: 'We have added a new feature to the dashboard.' },
    { id: 3, title: 'Reminder', message: 'Don’t forget to submit your assignments by the end of the week.' },
  ]);

  const [expandedNotification, setExpandedNotification] = useState(null)
  

  const handleNotificationClick = (notification) => {
    if (expandedNotification && expandedNotification.id === notification.id) {
      setExpandedNotification(null); 
    } else {
      setExpandedNotification(notification); 
    } 
  };

  return (
    <div className="notifications-container">
      <h1>Notifications</h1>
      
      <div className="notifications-list">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${
                expandedNotification?.id === notification.id ? "expanded" : ""}`} 
              onClick={() => handleNotificationClick(notification)}>
              <div className="notification-title">{notification.title}</div>
              {expandedNotification?.id === notification.id && (
                <div className="notification-details">
                  <p>{notification.message}</p>
                </div>)}
            </div>
          )))
           : (
          <p className="no-notifications">No notifications found.</p>
        )}
      </div>

      

      <button className="new-issue-button" onClick={() => navigate('/student/issuesubmission')}>
        New Issue
      </button>
    </div>
  );
};

export default Notifications;