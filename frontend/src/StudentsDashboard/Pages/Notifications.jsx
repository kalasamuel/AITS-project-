import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Notifications.css';

const Notifications = () => {
  const [notifications] = useState([
    { id: 1, title: 'System Update', message: 'The system will be down for maintenance at midnight.' },
    { id: 2, title: 'New Feature', message: 'We have added a new feature to the dashboard.' },
    { id: 3, title: 'Reminder', message: 'Don’t forget to submit your assignments by the end of the week.' },
  ]);

  const [selectedNotification, setSelectedNotification] = useState(null);
  const navigate = useNavigate();

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
  };

  return (
    <div className="notifications-container">
      <h1>Notifications</h1>
      
      <div className="notifications-list">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${selectedNotification && selectedNotification.id === notification.id ? 'selected' : ''}`} 
              onClick={() => handleNotificationClick(notification)}
            >
              <span className="notification-title">{notification.title}</span>
            </div>
          ))
        ) : (
          <p className="no-notifications">No notifications found.</p>
        )}
      </div>

      {selectedNotification && (
        <div className="notification-details">
          <h2>{selectedNotification.title}</h2>
          <p>{selectedNotification.message}</p>
        </div>
      )}

      <button className="new-issue-button" onClick={() => navigate('/issuesubmission')}>
        New Issue
      </button>
    </div>
  );
};

export default Notifications;