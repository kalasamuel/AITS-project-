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
  const [issueTypeFilter, setIssueTypeFilter] = useState('');
  const [showIssueTypeDropdown, setShowIssueTypeDropdown] = useState(false);
  const [courseCodeFilter, setCourseCodeFilter] = useState('');
  const [showCourseCodeDropdown, setShowCourseCodeDropdown] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [backendError, setBackendError] = useState('');
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

  const issueTypes = [
    "Missing Marks",
    "Wrong Registration Number",
    "Wrong Marks",
    "Other",
  ];

  const filteredIssueTypes = issueTypes.filter((type) =>
    type.toLowerCase().includes(issueTypeFilter.toLowerCase())
  );

  const filteredCourseCodes = courseCodes.filter((code) =>
    code.toLowerCase().includes(courseCodeFilter.toLowerCase())
  );

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
      setValidationError('File size must be less than 5MB.');
      return;
    }
    setFile(selectedFile || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setValidationError('');
    setBackendError('');
    setMessage('');

    if (department && !DEPARTMENT_COURSECODE[department].includes(courseCode)) {
      setValidationError(`Invalid! Course code ${courseCode} does not belong to ${department.toUpperCase()}`);
      setLoading(false);
      return;
    }

    if (!issueType || !courseCode || !description || !department) {
      setValidationError('Please fill in all required fields.');
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
    
    console.log([...formData.entries()]);

    try {
      await axios.post('http://127.0.0.1:8000/api/issues/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Resolved conflict by keeping 'access_token'
        },
      });

      setMessage('Issue submitted successfully!');
      setIssueType('');
      setCourseCode('');
      setCourseCodeFilter('');
      setIssueTypeFilter('');
      setDescription('');
      setDepartment('');
      setFile(null);

      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (error) {
      console.error('Error submitting issue:', error);
      setBackendError('Error submitting issue. Please try again.');
    }

    setLoading(false);
  };

  const handleIssueTypeOptionClick = (type) => {
    setIssueType(type);
    setIssueTypeFilter(type);
    setShowIssueTypeDropdown(false);
  };

  const handleCourseCodeOptionClick = (code) => {
    setCourseCode(code);
    setCourseCodeFilter(code);
    setShowCourseCodeDropdown(false);
  };

  return (
    <div className="issue-submission-container">
      <h1>Issue Submission Form</h1>
      {showPopup && <div className="notification-popup">{message}</div>}
      {validationError && <p className="error-message">{validationError}</p>}
      {backendError && <p className="error-message">{backendError}</p>}

      <div className="form-group">
        <label htmlFor="issueType"><h2>Issue Type</h2></label>
        <input
          id="issueTypeFilter"
          type="text"
          value={issueTypeFilter}
          onChange={(e) => setIssueTypeFilter(e.target.value)}
          placeholder="Type or choose an issue type"
          onClick={() => setShowIssueTypeDropdown(true)}
        />
        {showIssueTypeDropdown && (
          <select
            id="issueType"
            size="4"
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            required
          >
            {filteredIssueTypes.map((type) => (
              <option key={type} value={type} onClick={() => handleIssueTypeOptionClick(type)}>
                {type}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="courseCode"><h2>Course Code</h2></label>
        <input
          id="courseCodeFilter"
          type="text"
          value={courseCodeFilter}
          onChange={(e) => setCourseCodeFilter(e.target.value)}
          placeholder="Enter course code (e.g., BSCS)"
          onClick={() => setShowCourseCodeDropdown(true)}
        />
        {showCourseCodeDropdown && (
          <select
            id="courseCode"
            size="4"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            required
          >
            {filteredCourseCodes.map((code) => (
              <option key={code} value={code} onClick={() => handleCourseCodeOptionClick(code)}>
                {code}
              </option>
            ))}
          </select>
        )}
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
      </div>

      <div className="form-group">
        <label><h2>Attach File (Optional)</h2></label>
        <div
          className="file-drop-zone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile) {
              setFile(droppedFile);
            }
          }}
          onClick={() => document.getElementById('file').click()}
        >
          {file ? (
            <p>{file.name}</p>
          ) : (
            <p>Drag & drop a file here or click to select</p>
          )}
          <input
            type="file"
            id="file"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
      </div>

      <button type="submit" className="submit-button" disabled={loading} onClick={handleSubmit}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  );
};

export default IssueSubmission;