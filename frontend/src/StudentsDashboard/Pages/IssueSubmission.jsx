import React, { useState } from 'react';
import axios from 'axios';
import './IssueSubmission.css';

const IssueSubmission = () => {
  const [issueType, setIssueType] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!issueType || !courseCode || !description || !department) {
      setMessage('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('issue_type', issueType);
    formData.append('course_code', courseCode);
    formData.append('description', description);
    formData.append('department', department);
    if (file) {
      formData.append('support_file', file);
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/issues/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`, 
        },
      });

      setMessage('Issue submitted successfully!');
      setIssueType('');
      setCourseCode('');
      setDescription('');
      setDepartment('');
      setFile(null);
    } catch (error) {
      console.error('Error submitting issue:', error);
      setMessage('Error submitting issue. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="issue-submission-container">
      <h1>Issue Submission Form</h1>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="issueType"><h2>Issue Type</h2></label>
          <select
            id="issueType"
            onChange={(e) => setIssueType(e.target.value)}
            value={issueType}
            required
          >
            <option value="" disabled>Select issue type</option>
            <option value="missing_marks">Missing Marks</option>
            <option value="wrong_registration_number">Wrong Registration Number</option>
            <option value="wrong_marks">Wrong Marks</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="courseCode"><h2>Course Code</h2></label>
          <input
            id="courseCode"
            type="text"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            placeholder="Enter course code (e.g., BSCS)"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description"><h2>Issue Description</h2></label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="department"><h2>Department</h2></label>
          <select
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          >
            <option value="" disabled>Select department</option>
            <option value="cocis">COCIS</option>
            <option value="cedat">CEDAT</option>
            <option value="chuss">CHUSS</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="file"><h2>Attach File (Optional)</h2></label>
          <input id="file" type="file" onChange={handleFileChange} />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default IssueSubmission;
