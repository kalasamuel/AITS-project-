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
  const [filter, setFilter] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const courseCodes = [
    "BSCS", "BIT", "BSE", "BBA", "LLB", "BME", "BEE", "BCE", "BFA", "BEd", "BSc", "BPH", "BVM", "BAG", "BNS", "BPHARM",
    "BDS", "BSTAT", "BPS", "BHRM", "BPA", "BDEV", "BPSY", "BAS", "BAE", "BMC", "BIS", "BENV", "BLS", "BAGRIC", "BFOOD",
    "BFORE", "BTOUR", "BHM", "BARCH", "BPLAN"
  ];

  const DEPARTMENT_COURSECODE = {
    "cocis": ["BSCS", "BIT", "BSE", "BIS"],
    "cedat": ["BME", "BEE", "BCE", "BARCH", "BPLAN", "BAGRIC"],
    "chuss": ["BAS", "BAE", "BMC", "BLS"],
    "conas": ["BSc", "BSTAT", "BENV"],
    "law": ["LLB"],
    "cobams": ["BBA", "BPS", "BHRM", "BPA", "BDEV"],
    "cees": ["BEd"],
    "cahs": ["BAG", "BFOOD", "BFORE", "BTOUR"],
    "chs": ["BPH", "BNS", "BPHARM", "BDS"],
    "vet": ["BVM"]
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (department && !DEPARTMENT_COURSECODE[department].includes(courseCode)) {
      setError(`Invalid! Course code ${courseCode} does not belong to ${department.toUpperCase()}`);
      setLoading(false);
      return;
    }

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
      setFilter('');
      setDescription('');
      setDepartment('');
      setFile(null);

      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);  
        
    } catch (error) {
      console.error('Error submitting issue:', error);
      setMessage('Error submitting issue. Please try again.');
    }

    setLoading(false);
  };

  const filteredCourseCodes = courseCodes.filter((code) =>
    code.toLowerCase().includes(filter.toLowerCase())
  );

  const handleInputClick = () => {
    setShowDropdown(true);
  };

  const handleOptionClick = (code) => {
    setCourseCode(code);
    setFilter(code);
    setShowDropdown(false);
  };

  return (
    <div className="issue-submission-container">
      <h1>Issue Submission Form</h1>
      {showPopup && <div className="notification-popup">{message}</div>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="issueType"><h2>Issue Type</h2></label>
          <input
            type="text"
            id="issueType"
            list="issueTypeOptions"
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            placeholder="Type or choose an issue type"
            required
          />
          <datalist id="issueTypeOptions">
            <option value="Missing Marks" />
            <option value="Wrong Registration Number" />
            <option value="Wrong Marks" />
            <option value="Wrong Course Code" />
            <option value="Wrong Course Name" />
            <option value="Missing Course Work marks" />
          </datalist>
        </div>

        <div className="form-group">
          <label htmlFor="courseCode"><h2>Course Code</h2></label>
          <input
            id="courseCodeFilter"
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Enter course code (e.g., BSCS)"
            onClick={handleInputClick}
          />
          {showDropdown && (
          <select
            id="courseCode"
            size="4"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            required
          >
            {filteredCourseCodes.map((code) => (
              <option key={code} value={code} onClick={() => handleOptionClick(code)}>
                {code}
              </option>
            ))}
          </select>
          )}
          {error && <p className="error-message">{error}</p>}
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
            <option value="cocis">College of Computing and Information Sciences (COCIS)</option>
            <option value="cedat">College of Engineering, Design, Art and Technology (CEDAT)</option>
            <option value="chuss">College of Humanities and Social Sciences (CHUSS)</option>
            <option value="conas">College of Natural Sciences (CONAS)</option>
            <option value="law">School of Law</option>
            <option value="cobams">College of Business and Management Sciences (COBAMS)</option>
            <option value="cees">College of Education and External Studies (CEES)</option>
            <option value="cahs">College of Agricultural and Environmental Sciences (CAES)</option>
            <option value="chs">College of Health Sciences (CHS)</option>
            <option value="vet">College of Veterinary Medicine, Animal Resources and Biosecurity (COVAB)</option>
          </select>
          {error && <p className="error-message">{error}</p>}
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
