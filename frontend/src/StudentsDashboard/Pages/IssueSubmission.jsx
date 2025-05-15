import React, { useState } from 'react';
import { apiClient } from "../../api";
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
  const [fieldErrors, setFieldErrors] = useState({});
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
    {value: "missing_marks", label: "Missing Marks"},
    {value: "wrong_registration_number", label: "Wrong Registration Number"},
    {value: "wrong_marks", label: "Wrong Marks"},
    {value: "other", label: "Other"},
  ];

  const filteredIssueTypes = issueTypes.filter((type) =>
    type.label.toLowerCase().includes(issueTypeFilter.toLowerCase())
  );

  const filteredCourseCodes = courseCodes.filter((code) =>
    code.toLowerCase().includes(courseCodeFilter.toLowerCase())
  );

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
      setFieldErrors((prev) => ({ ...prev, file: 'File size must be less than 5MB.' }));
      return;
    }
    setFile(selectedFile || null);
    setFieldErrors((prev) => ({ ...prev, file: '' })); // Clear file error
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});
    setBackendError('');
    setMessage('');

    const errors = {};

    if (!issueType) {
      errors.issueType = 'Please select an issue type.';
    }
    if (!courseCode) {
      errors.courseCode = 'Please enter a valid course code.';
    }
    if (!description) {
      errors.description = 'Please provide a description of the issue.';
    }
    if (!department) {
      errors.department = 'Please select a department.';
    }
    if (department && !DEPARTMENT_COURSECODE[department].includes(courseCode)) {
      errors.department = `Invalid! Course code ${courseCode} does not belong to ${department.toUpperCase()}`;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
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
      await apiClient.post('/issues/submit-issue/', formData, {
        headers: {
          //'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
      if (error.response && error.response.data) {
        setBackendError(error.response.data.error || 'Error submitting issue. Please try again.');
      } else {
        setBackendError('Error submitting issue. Please try again.');
      }
    }

    setLoading(false);
  };

  const handleIssueTypeOptionClick = (type) => {
    setIssueType(type.value);
    setIssueTypeFilter(type.label);
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
        {fieldErrors.issueType && <p className="field-error">{fieldErrors.issueType}</p>}
        {showIssueTypeDropdown && (
        <select
          id="issueType"
          size="4"
          value={issueType}
          onChange={e => {
            const selected = issueTypes.find(type => type.value === e.target.value);
            if (selected) handleIssueTypeOptionClick(selected);
          }}
          required
        >
          {filteredIssueTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
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
        {fieldErrors.courseCode && <p className="field-error">{fieldErrors.courseCode}</p>}
        {showCourseCodeDropdown && (
        <select
          id="courseCode"
          size="4"
          value={courseCode}
          onChange={e => {
            handleCourseCodeOptionClick(e.target.value);
          }}
          required
        >
          {filteredCourseCodes.map((code) => (
            <option key={code} value={code}>
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
        {fieldErrors.description && <p className="field-error">{fieldErrors.description}</p>}
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
        {fieldErrors.department && <p className="field-error">{fieldErrors.department}</p>}
      </div>

      <div className="form-group">
        <label><h2>Attach File (Optional)</h2></label>
        <div
          className="file-drop-zone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile && droppedFile.size > 5 * 1024 * 1024) {
              setFieldErrors((prev) => ({ ...prev, file: 'File size must be less than 5MB.' }));
              return;
            }
            setFile(droppedFile);
            setFieldErrors((prev) => ({ ...prev, file: '' })); // Clear file error
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
            {fieldErrors.file && <p className="field-error">{fieldErrors.file}</p>}
          </div>
    
          <button type="submit" className="submit-button" disabled={loading} onClick={handleSubmit}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      );
    };
    
    export default IssueSubmission;