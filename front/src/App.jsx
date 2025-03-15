import React, { useState } from 'react';

const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [issueType, setIssueType] = useState('');
  const [issueDetails, setIssueDetails] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [departmentCourse, setDepartmentCourse] = useState('');

  const handleLogin = () => {
    // Implement login logic here
    console.log('Login:', email, password);
    setCurrentPage('studentDashboard');
  };

  const handleSignup = () => {
    // Implement signup logic here
    console.log('Signup:', fullName, email, role, password, verifyPassword);
    setCurrentPage('emailVerification');
  };

  const handleVerification = () => {
    // Implement verification logic here
    console.log('Verification:', verificationCode);
    setCurrentPage('studentDashboard');
  };

  const handleSubmitIssue = () => {
    // Implement issue submission logic here
    console.log('Issue Submission:', issueType, issueDetails, issueDescription, departmentCourse);
    setCurrentPage('studentDashboard');
  };

  const renderPage = () => {
  

    switch (currentPage) {
      case 'login':
        return (
          <div style={styles.container}>
            <div style={styles.formContainer}>
              <h2>Welcome to AITS!</h2>
              <div style={styles.buttonGroup}>
                <button style={styles.activeButton} onClick={() => setCurrentPage('login')}>Log in</button>
                <button style={styles.button} onClick={() => setCurrentPage('signup')}>Sign up</button>
              </div>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
              <button onClick={handleLogin} style={styles.submitButton}>Log in</button>
            </div>
          </div>
        );
      case 'signup':
        return (
          <div style={styles.container}>
            <div style={styles.formContainer}>
              <div style={styles.buttonGroup}>
                <button style={styles.button} onClick={() => setCurrentPage('login')}>Log in</button>
                <button style={styles.activeButton} onClick={() => setCurrentPage('signup')}>Sign up</button>
              </div>
              <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} style={styles.input} />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
              <input type="text" placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} style={styles.input} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
              <input type="password" placeholder="Verify Password" value={verifyPassword} onChange={(e) => setVerifyPassword(e.target.value)} style={styles.input} />
              <button onClick={handleSignup} style={styles.submitButton}>Continue</button>
            </div>
          </div>
        );
      case 'emailVerification':
        return (
          <div style={styles.container}>
            <div style={styles.formContainer}>
              <h2>Email Verification</h2>
              <p>Enter the verification sent to your email.</p>
              <input type="text" placeholder="Verification Code" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} style={styles.input} />
              <button onClick={handleVerification} style={styles.submitButton}>Continue</button>
            </div>
          </div>
        );
      case 'studentDashboard':
        return (
          <div style={styles.dashboardContainer}>
            <div style={styles.sidebar}>
              <button onClick={() => setCurrentPage('studentDashboard')} style={styles.sidebarButton}>Dashboard</button>
              <button onClick={() => setCurrentPage('issueSubmission')} style={styles.sidebarButton}>Issue Submission</button>
              <button style={styles.sidebarButton}>My Current Issues</button>
              <button style={styles.sidebarButton}>Issue Details</button>
              <button style={styles.sidebarButton}>Notifications</button>
              <button style={styles.sidebarButton}>Profile & Settings</button>
            </div>
            <div style={styles.content}>
              <h2>Student's Dashboard</h2>
              {/* Add dashboard content here */}
            </div>
          </div>
        );
      case 'issueSubmission':
        return (
          <div style={styles.dashboardContainer}>
            <div style={styles.sidebar}>
              <button onClick={() => setCurrentPage('studentDashboard')} style={styles.sidebarButton}>Dashboard</button>
              <button onClick={() => setCurrentPage('issueSubmission')} style={styles.sidebarButton}>Issue Submission</button>
              <button style={styles.sidebarButton}>My Current Issues</button>
              <button style={styles.sidebarButton}>Issue Details</button>
              <button style={styles.sidebarButton}>Notifications</button>
              <button style={styles.sidebarButton}>Profile & Settings</button>
            </div>
            <div style={styles.content}>
              <h2>Issue Submission Form</h2>
              <input type="text" placeholder="Issue Type" value={issueType} onChange={(e) => setIssueType(e.target.value)} style={styles.input} />
              <input type="text" placeholder="Issue Details" value={issueDetails} onChange={(e) => setIssueDetails(e.target.value)} style={styles.input} />
              <textarea placeholder="Issue Description" value={issueDescription} onChange={(e) => setIssueDescription(e.target.value)} style={styles.textarea} />
              <input type="text" placeholder="Department/Course" value={departmentCourse} onChange={(e) => setDepartmentCourse(e.target.value)} style={styles.input} />
              <button onClick={handleSubmitIssue} style={styles.submitButton}>Submit</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.appContainer}>
      {renderPage()}
    </div>
  );
};

const styles = {
  appContainer: {
    fontFamily: "sans-serif",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f0f0"
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh"
  },
  formContainer: {
    width: 300,
    padding: 20,
    border: "1px solid #ccc",
    borderRadius: 5,
    backgroundColor: "white"
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    border: "1px solid #ccc",
    borderRadius: 3
  },
  textarea: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    border: "1px solid #ccc",
    borderRadius: 3,
    resize: "vertical"
  },
  submitButton: {
    width: "100%",
    padding: 10,
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: 3,
    cursor: "pointer"
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20
  },
  button: {
    padding: 10,
    border: "1px solid #ccc",
    borderRadius: 3,
    backgroundColor: "transparent",
    cursor: "pointer",
    flex: 1,
    marginRight: 5
  },
  activeButton: {
    padding: 10,
    border: "1px solid #007bff",
    borderRadius: 3, // Ensure no extra comma here
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
    flex: 1,
    marginRight: 5
  }
};
