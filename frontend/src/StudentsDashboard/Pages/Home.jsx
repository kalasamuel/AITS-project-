import React, { useEffect, useState } from "react";
import { apiClient } from "../../api";
import IssuesList from "../Components/IssuesList";
import './Home.css';

const Home = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const token = localStorage.getItem("access_token")
        const response = await apiClient.get("/issues/student/", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const filteredIssues = response.data.filter(issue => {
          const isPending = issue.status === "pending";
          const isRecentResolved =
            issue.status === "resolved" &&
            new Date(issue.created_at) >= new Date(Date.now() - 5 * 24 * 60 * 60 * 1000); // clears the content it shows within 5 days

          return isPending || isRecentResolved;
        });

        setIssues(filteredIssues);
      } catch (error) {
        console.error("Failed to fetch student issues:", error);
        setError("Failed to load issues. Please try again later.")
      } finally {
        setLoading(false);
      }
    };
        fetchIssues();
        }, []);

        return (
        <div className="student-home-container">
            <div className="header-row">
            <h1>Student Dashboard</h1>
            <span className="recent-updates">Recent issues updates</span>
            </div>

            {error && <p className="error-message">{error}</p>}

            {loading ? (
            <div className="loading-container" aria-live="polite">
                <p className="loading-message">Loading issues...</p>
            </div>
            ) : (
            <IssuesList issues={issues} />
            )}
        </div>
        );
    };

export default Home;