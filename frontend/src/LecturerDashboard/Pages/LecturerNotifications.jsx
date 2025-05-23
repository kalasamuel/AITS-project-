import React, { useEffect, useState } from 'react';
import { apiClient } from '../../api';
import './LecturerNotifications.css';

const NOTIFICATION_TYPES = [
  { key: "all", label: "All" },
  { key: "issue", label: "Issues" },
  { key: "announcement", label: "Announcements" },
  { key: "reminder", label: "Reminders" },
  { key: "comment", label: "Comments" },
  { key: "event", label: "Events" },
  { key: "general", label: "General" },
];

function formatDate(date) {
  return new Date(date).toLocaleString();
}

const LecturerNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [studentsUpdates, setStudentsUpdates] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expandedNotification, setExpandedNotification] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const notifRes = await apiClient.get('/issues/lecturer/notifications/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(notifRes.data.notifications || []);
        const updatesRes = await apiClient.get('/issues/lecturer/student-updates/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudentsUpdates(updatesRes.data.updates || []);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        setError('Failed to load notifications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const filteredNotifications = filter === "all"
    ? notifications
    : notifications.filter(n => n.type === filter);

  const handleNotificationClick = (notification) => {
    setExpandedNotification(
      expandedNotification?.notification_id === notification.notification_id ? null : notification
    );
  };

  return (
    <div className="main-content lecturer-notifications-container">
      <section className="lecturer-section">
        <h1 className="notifications-title">Lecturer Notifications</h1>
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
        <div className="notifications-table">
          {error && <p className="error-message">{error}</p>}
          {loading ? (
            <p>Loading notifications...</p>
          ) : filteredNotifications.length > 0 ? (
            <div className="notifications-list">
              {filteredNotifications.map(note => (
                <div
                  key={note.notification_id}
                  className={`notification-item ${expandedNotification?.notification_id === note.notification_id ? "expanded" : ""} notification-type-${note.type}`}
                  onClick={() => handleNotificationClick(note)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={expandedNotification?.notification_id === note.notification_id}
                  onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") handleNotificationClick(note);
                  }}
                >
                  <div className="notification-header">
                    <div className="notification-title-area">
                      <div className="notification-type-label">
                        {note.type ? note.type.charAt(0).toUpperCase() + note.type.slice(1) : "Notification"}
                      </div>
                      <div className="notification-title">
                        {note.title || note.message}
                      </div>
                      <small className="notification-timestamp">
                        {formatDate(note.created_at)}
                      </small>
                    </div>
                  </div>
                  {expandedNotification?.notification_id === note.notification_id && (
                    <div className="notification-details">
                      <p><strong>Message:</strong> {note.message}</p>
                      {note.link && <a href={note.link} target="_blank" rel="noopener noreferrer">Read more</a>}
                      {note.due_date && <p><strong>Due:</strong> {formatDate(note.due_date)}</p>}
                      {note.event_date && <p><strong>Event Date:</strong> {formatDate(note.event_date)}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No notifications found.</p>
          )}
        </div>
      </section>
      <section className="student-updates">
        <h2>Student Updates</h2>
        <div className="updates-list">
          {studentsUpdates.length === 0 ? (
            <p>No student updates found.</p>
          ) : (
            studentsUpdates.map((update) => (
              <div key={update.institutional_email + update.issue_type} className="update-item">
                <strong>
                  {update.issue_type
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')
                  }
                </strong>
                <p>{update.message}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default LecturerNotifications;