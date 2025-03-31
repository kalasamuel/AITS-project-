import React from 'react';
import './LecturerNotifications.css';
const LecturerNotifications = () => {
  const notifications=[
    {type:'New Issue Assignment',message:'You have been assigned a new issue',date:'2025-02-15'},
    {type:"New Issue Assigned",message:"You have been assigned 2 pending issues",date:"2025-02-15"},
    {type:"New Issue Assigned",message:"You have been assigned a new issue",date:"2025-02-15"},
  ];
  const studentsUpdates=[
    {title:'Student Prod Update',message:'Tyrone has uploaded a new document'},
    {title:'New Issue Assigned',message:'You have been assigned a new issue'},
  ];
  return (
    <div className="main-content">
      <section className="lecturer-section">
        <h2>Lecturer's Dashboard</h2>
        <div className="notifications-table">
          <h3>Notifications</h3>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((note,index)=>(
                <tr key={index}>
                  <td>{note.type}</td>
                  <td>{note.message}</td>
                </tr>
              ))}
            </tbody>
          </table>

    </div>
    </section>
    <section className="student-updates">
      <h2>Student Prod Update</h2>
      <div className="updates-list">
          {studentsUpdates.map((update,index)=>(
            <div key={index} className="update-item">
              <strong>{update.title}</strong>
              <p>{update.message}</p>
      </div>
          ))}
      </div>
    </section>
  </div>
  );
};
export default LecturerNotifications;
    
  

