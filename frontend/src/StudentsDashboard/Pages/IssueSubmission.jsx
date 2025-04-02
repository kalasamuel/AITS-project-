import React, { useState } from 'react';
import './IssueSubmission.css';

const IssueSubmission = ({ addIssue }) => {
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');
  const [file, setFile] = useState(null);
  const [courseCode, setCourseCode] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newIssue = {
      id: Date.now(),
      issueType: issueType,
      courseCode: courseCode,
      description: description,
      status: 'Pending',
      department: department,
      file: file,
    };
    addIssue(newIssue);
    setIssueType('');
    setCourseCode('');
    setDescription('');
    setDepartment('');
    setFile(null);
  };

  return (
    <div className="issue-submission-container">
      <h1>Issue Submission Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <h2>Issue Type</h2>
          <input
            type="text"
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            placeholder="Enter issue type"
          />
          <select onChange={(e) => setIssueType(e.target.value)}>
            <option value="">Select issue type</option>
            <option value="Missing Marks">Missing Marks</option>
            <option value="Wrong Registration Number">Wrong Registration Number</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <h2>Course Code</h2>
          <input
            type="text"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            placeholder="Enter course code (e.g., CS101)"
          />
        </div>
        <div className="form-group">
          <h2>Issue Description</h2>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue"
          />
        </div>
        <div className="form-group">
          <h2>Department/Course</h2>
          <select value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="">Select department</option>
            <option value="COCIS">COCIS</option>
            <option value="CEDAT">CEDAT</option>
            <option value="CHUSS">CHUSS</option>
          </select>
        </div>
        <div className="form-group">
          <h2>Attach File</h2>
          <input type="file" onChange={handleFileChange} />
        </div>
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default IssueSubmission;
