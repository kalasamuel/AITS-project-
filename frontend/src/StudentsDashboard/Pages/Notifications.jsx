import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../api";
import './Notifications.css';

const NOTIFICATION_TYPES = [
  { key: 'all', label: 'All' },
  { key: 'issue', label: 'Issues' },
  { key: 'announcement', label: 'Announcements' },
  { key: 'reminder', label: 'Reminders' },
  { key: 'comment', label: 'Comments' },
  { key: 'event', label: 'Events' },
  { key: 'finance', label: 'Finance' },
  { key: 'rejected', label: 'Rejected' },
];

const getTypeIcon = (type, status) => {
  switch (type) {
    case 'issue':
      switch (status) {
        case 'open': return <span style={{color:'#f7b731'}}>🟡</span>;
        case 'in_progress': return <span style={{color:'#3867d6'}}>🔵</span>;
        case 'resolved': return <span style={{color:'#20bf6b'}}>✅</span>;
        case 'rejected': return <span style={{color:'#eb3b5a'}}>⛔</span>;
        default: return <span style={{color:'#a5b1c2'}}>📌</span>;
      }
    case 'announcement': return <span style={{color:'#2563eb'}}>📢</span>;
    case 'reminder': return <span style={{color:'#ffb347'}}>⏰</span>;
    case 'comment': return <span style={{color:'#4f8cff'}}>💬</span>;
    case 'event': return <span style={{color:'#20bf6b'}}>🎉</span>;
    case 'finance': return <span style={{color:'#e53e3e'}}>💰</span>;
    default: return <span>🔔</span>;
  }
};

const getTypeLabel = (type, status) => {
  if (type === "issue" && status === "rejected") return "Issue Rejected";
  if (type === "issue" && status === "resolved") return "Issue Resolved";
  if (type === "issue" && status === "in_progress") return "Issue In Progress";
  if (type === "issue" && status === "open") return "Issue Opened";
  switch (type) {
    case "announcement": return "Announcement";
    case "reminder": return "Reminder";
    case "comment": return "Staff Comment";
    case "event": return "Event";
    case "finance": return "Finance";
    default: return "Notification";
  }
};

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [expandedNotification, setExpandedNotification] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await apiClient.get('/issues/notifications/student/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setNotifications(response.data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setError("Failed to load notifications. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleNotificationClick = (notification) => {
    setExpandedNotification(expandedNotification?.notification_id === notification.notification_id ? null : notification);
  };

const dismissNotification = async (id, e) => {
  e.stopPropagation();
  setNotifications(prev => prev.filter(notif => notif.notification_id !== id));
  if (expandedNotification?.notification_id === id) setExpandedNotification(null);

  try {
    await apiClient.post('/issues/notifications/${id}/dismiss/', {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });}catch (err) {
      console.error('Error dismissing notification:', err);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'rejected') return notif.type === 'issue' && notif.issue?.status === 'rejected';
    return notif.type === filter;
  });

 return (
    <div className="notifications-container">
      <h1 className="notifications-title">Notifications</h1>

      <div className="filter-controls">
        {NOTIFICATION_TYPES.map(({ key, label }) => (
          <button
            key={key}
            className={`filter-button ${filter === key ? 'filter-button-active' : ''}`}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading notifications...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : filteredNotifications.length === 0 ? (
        <div className="no-notifications">
          <p>No notifications found.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {filteredNotifications.map(notification => (
            <div
              key={notification.notification_id}
              className={`notification-item ${expandedNotification?.notification_id === notification.notification_id ? "expanded" : ""} notification-type-${notification.type}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="notification-header">
                <div className="notification-icon">
                  {getTypeIcon(notification.type, notification.issue?.status)}
                </div>
                <div className="notification-title-area">
                  <div className="notification-type-label">
                    {getTypeLabel(notification.type, notification.issue?.status)}
                  </div>
                  <div className="notification-title">
                    {notification.title || notification.message}
                  </div>
                  <small className="notification-timestamp">
                    {new Date(notification.created_at).toLocaleString()}
                  </small>
                </div>
                <button
                  className="dismiss-button"
                  onClick={(e) => dismissNotification(notification.notification_id, e)}
                  aria-label="Dismiss notification"
                >
                  ×
                </button>
              </div>
              {expandedNotification?.notification_id === notification.notification_id && (
                <div className="notification-details">
                  {notification.type === "issue" && (
                    <>
                      <p><strong>Issue Type:</strong> {notification.issue?.issue_type?.replace(/_/g, " ")}</p>
                      <p><strong>Status:</strong> {notification.issue?.status?.replace(/_/g, " ")}</p>
                      <p><strong>Full Message:</strong> {notification.message}</p>
                    </>
                  )}
                  {notification.type === "announcement" && (
                    <>
                      <p><strong>Announcement:</strong> {notification.message}</p>
                      {notification.link && <a href={notification.link} target="_blank" rel="noopener noreferrer">Read more</a>}
                    </>
                  )}
                  {notification.type === "reminder" && (
                    <>
                      <p><strong>Reminder:</strong> {notification.message}</p>
                      {notification.due_date && <p><strong>Due:</strong> {new Date(notification.due_date).toLocaleString()}</p>}
                    </>
                  )}
                  {notification.type === "comment" && (
                    <>
                      <p><strong>Staff Comment:</strong> {notification.message}</p>
                      {notification.issue && (
                        <p><strong>Related Issue:</strong> {notification.issue.issue_type?.replace(/_/g, " ")}</p>
                      )}
                    </>
                  )}
                  {notification.type === "event" && (
                    <>
                      <p><strong>Event:</strong> {notification.message}</p>
                      {notification.event_date && <p><strong>Date:</strong> {new Date(notification.event_date).toLocaleString()}</p>}
                    </>
                  )}
                  {notification.type === "finance" && (
                    <>
                      <p><strong>Finance Notice:</strong> {notification.message}</p>
                      {notification.amount && <p><strong>Amount:</strong> UGX {notification.amount}</p>}
                      {notification.due_date && <p><strong>Due:</strong> {new Date(notification.due_date).toLocaleDateString()}</p>}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="notifications-footer">
        <button className="new-notification-button" onClick={() => navigate('/student/issuesubmission')}>
          New Issue
        </button>
      </div>
    </div>
  );
};

export default Notifications;