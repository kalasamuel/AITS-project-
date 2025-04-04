import { useEffect, useState } from "react"
const Dashboard = () => { 
  const [issues, setIssues] = useState([]); 
  const [stats, setStats] = useState({ total: 0, inProgress: 0, resolved: 0 });

useEffect(() => { 
  fetch("https://api.example.com/issues") // Replace with your API endpoint 
  // .then((response) => response.json()) 
  // .then((data) => { 
  // setIssues(data); 
  // calculateStats(data);
  //  }); }, []);

const calculateStats = (data) => { 
  const total = data.length; 
  const resolved = data.filter((issue) => issue.status === "Resolved").length; 
  const inProgress = data.filter((issue) => issue.status === "In progress").length;
   setStats({ total, inProgress, resolved });
   };

return ( 
<div className="p-6 bg-gray-900 min-h-screen text-white">
   <h1 className="text-2xl font-bold">Academic Issue Tracking System</h1> 
   <p className="mb-4">Welcome &lt<registrar>&t, here is an overview of your activities</p>

<div className="grid grid-cols-3 gap-4 mb-6">
    <div className="bg-gray-700 p-4 rounded-lg">Total Issues Submitted: {stats.total}</div>
    <div className="bg-gray-700 p-4 rounded-lg">Issues In Progress: {stats.inProgress}</div>
    <div className="bg-gray-700 p-4 rounded-lg">Resolved Issues: {stats.resolved}</div>
  </div>

  <table className="w-full bg-gray-800 rounded-lg">
    <thead>
      <tr className="bg-gray-700">
        <th className="p-3">Issue ID</th>
        <th className="p-3">Department</th>
        <th className="p-3">Issue Type</th>
        <th className="p-3">Date Submitted</th>
        <th className="p-3">Status</th>
      </tr>
    </thead>
    <tbody>
      {issues.map((issue) => (
        <tr key={issue.id} className="border-t border-gray-600">
          <td className="p-3">#{issue.id}</td>
          <td className="p-3">{issue.department}</td>
          <td className="p-3">{issue.type}</td>
          <td className="p-3">{issue.dateSubmitted}</td>
          <td className="p-3">{issue.status}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

); 
}; 