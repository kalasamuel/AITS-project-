import React, { useEffect, useState } from 'react';
import { apiClient } from '../../api';
import './LecturerNotifications.css';

const LecturerNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [studentsUpdates, setStudentsUpdates] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const notifRes = await apiClient.get('/lecturer/notifications/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(notifRes.data.notifications || []);
        const updatesRes = await apiClient.get('/lecturer/student-updates/', {
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

  return (
    <div className="main-content">
      <section className="lecturer-section">
        <h2>Lecturer's Dashboard</h2>
        <div className="notifications-table">
          <h3>Notifications</h3>
          {error && <p className="error-message">{error}</p>}
          {loading ? (
            <p>Loading notifications...</p>
          ) : notifications.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Message</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((note) => (
                  <tr key={note.notification_id}>
                    <td>{note.message}</td>
                    <td>{new Date(note.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No notifications found.</p>
          )}
        </div>
      </section>
      <section className="student-updates">
        <h2>Student Prod Update</h2>
        <div className="updates-list">
          {studentsUpdates.map((update) => (
            <div key={update.institutional_email} className="update-item">
              <strong>{update.issue_type}</strong>
              <p>{update.message}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LecturerNotifications;