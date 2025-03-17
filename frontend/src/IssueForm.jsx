import { useState } from 'react'
import myImage from "./icons8-empty-box-50.png";
import "./IssueForm.css";
const IssueForm=()=>{
  const [files,setFiles]=useState([]);
  const issueTypes=["Missing Marks","Appeals","Corrections"];
  const handleFileChange=(e)=>{setFiles([...files,...e.target.files]);
  };
    const removeFile=(index)=>{setFiles(files.filter((_,i)=>i!== index));

    };
    const handleSubmit=(e)=>{e.preventDefault();
      alert("Issue Submitted Successfully!");
    };
    return(
      <div
      className="issue-form-container">
        <h2>Submit an Issue</h2>
        <form
        onSubmit={handleSubmit}>
          <label>Issue Subject:</label>
          <input type="text" required/>
          <label>Description:</label>
          <textarea rows="3" required></textarea>
          <label>Category/Type of issue:</label>
          <select required>{issueTypes.map((type,index)=>(
            <option key={index} value={type}>{type}</option>))}
            </select>
            <label>Course Code:</label>
            <input type="text" placeholder='Example: CSC 1202' required/>
            <label>Attach your file:</label>
            <div className='file-upload-container'>
              <img src={myImage} alt="file-upload"/>
              <input type="file" multiple onChange={handleFileChange}/> 
            </div>
            <input type="file" multiple onChange={handleFileChange}/>
            {files.length>0 && (
              <ul>
                {files.map((file,index)=>(
                  <li key={index}>
                    {file.name}<button
                    type="button" onClick={()=>
                      removeFile(index)}>Remove</button>
                  </li>
                ))}
              </ul>
            )}
            <button
            type="submit">Submit</button>
        </form>
      </div>
    );
};
export default IssueForm;
