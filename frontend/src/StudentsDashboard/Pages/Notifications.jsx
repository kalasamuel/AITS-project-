import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Notifications.css';

const Notifications = () => {
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      title: 'System Update', 
      message: 'The system will be down for maintenance at midnight. Please save your work and log out before 11:45 PM to avoid any data loss.',
      type: 'warning',
    },
    { 
      id: 2, 
      title: 'New Feature', 
      message: 'We have added a new dashboard feature to help you track your progress more effectively. Click here to explore the new analytics tools and custom reports.',
      type: 'info',
    },
    { 
      id: 3, 
      title: 'Reminder', 
      message: 'Don’t forget to submit your assignments by the end of the week. Late submissions may affect your grade. Check the syllabus for specific requirements.',
      type: 'alert',
    },
    { 
      id: 4, 
      title: 'Resolved Issue', 
      message: 'The issue with the login system has been resolved. You can now log in without any problems. Thank you for your patience.',
      type: 'resolved',
    },
    
  ]);

  const [expandedNotification, setExpandedNotification] = useState(null);
  const [filter, setFilter] = useState('all');

  const handleNotificationClick = (notification) => {
    setExpandedNotification(expandedNotification?.id === notification.id ? null : notification);
  };

  const dismissNotification = (id, e) => {
    e.stopPropagation();
    setNotifications(notifications.filter(notif => notif.id !== id));
    if (expandedNotification && expandedNotification.id === id) {
      setExpandedNotification(null); 
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    return notif.type === filter;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'alert':
        return '🔔';
      case 'resolved':
        return '✅';
      default:
        return '📌';
    }
  };

  return (
    <div className="notifications-container">
      <h1 className="notifications-title">Notifications</h1>
      
      <div className="filter-controls">
        <button 
          className={`filter-button ${filter === 'all' ? 'filter-button-active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-button ${filter === 'warning' ? 'filter-button-active' : ''}`}
          onClick={() => setFilter('warning')}
        >
          Warnings
        </button>
        <button 
          className={`filter-button ${filter === 'info' ? 'filter-button-active' : ''}`}
          onClick={() => setFilter('info')}
        >
          Info
        </button>
        <button 
          className={`filter-button ${filter === 'alert' ? 'filter-button-active' : ''}`}
          onClick={() => setFilter('alert')}
        >
          Alerts
        </button>
        <button
          className={`filter-button ${filter === 'resolved' ? 'filter-button-active' : ''}`}
          onClick={() => setFilter('resolved')}   
        >
          Resolved
        </button>
      </div>
      
      <div className="notifications-list">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`notification-item ${notification.type} ${expandedNotification?.id === notification.id ? "expanded" : ""}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="notification-header">
                <div className="notification-icon">
                  {getTypeIcon(notification.type)}
                </div>
                <div className="notification-title-area">
                  <div className="notification-title">{notification.title}</div>
                </div>
                <button 
                  className="dismiss-button" 
                  onClick={(e) => dismissNotification(notification.id, e)}
                >
                  ×
                </button>
              </div>

              {expandedNotification?.id === notification.id && (
                <div className="notification-details">
                  <p>{notification.message}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-notifications">
            <p>No notifications found.</p>
          </div>
        )}
      </div>

      <div className="notifications-footer">
        <button className="new-notification-button" onClick={() => navigate('/student/issuesubmission')}>
          New Issue
        </button>
      </div>
    </div>
  );
};

export default Notifications;