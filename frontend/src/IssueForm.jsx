import { useEffect, useState } from 'react'
import "./IssueForm.css";
const IssueForm=()=>{
  const [formData,setFormData]=useState({
    title:"",
    description:"",
    category:"",
    courseCode:"",

  });
  useEffect(()=>{console.log('Form Data:',formData);},[formData]);
  const[errors,setErrors]=useState({});
  const categories=["Missing Marks","Appeals","Corrections"];
  const validateField=(name,value)=>{
    let error="";
    switch (name){
      case'title':
      error=value.trim()?"":'Title is required';
      break;
      case'description':
      error=value.trim().length>=10?"":'Description must be atleast 10 characters';
      break;
      case'category':
      error=value?"":'Please select a category';
      break;
      case'courseCode':
      error=value.match(/^[A-Za-z]{2,4}\d{3,4}$/)?"":'Invalid course code format (e.g.CS1201)';
      break;
      default:
        break;
    }
    return error
  };
  const handleSubmit=(e)=>{
    e.preventDefault();
    const newErrors={};
    Object.keys(formData).forEach(key=>{
      const error=validateField(key,formData[key]);
      if (error) newErrors[key]=error;
    });
    if (Object.keys(newErrors).length===0){
      console.log('Form submitted:',formData);
      alert('Issue submitted successfully!');
      setFormData({title:"",description:"",category:"",courseCode:""});
    }else{
      setErrors(newErrors);
    }
  };
  const handleChange=(e)=>{
    const {name,value}=e.target;
    setFormData(prev=>({...prev,[name]:value}));
    if (errors[name]){
      setErrors(prev=>({...prev,[name]:""}));
    }
  };
  return(
    <div className="form-container">
      <h2 className='form-heading'>Academic Issue Submission</h2>
      <form onSubmit={handleSubmit} className='issue-form'>
        <div className='form-group'>
          <label htmlFor="title" className="form-label">Issue Title*</label>
          <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter issue title"
          className='form-input'
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="category" className="form-label">Issue Type*</label>
            <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className='form-select'>
              <option value="">Select an issue type</option>
              {categories.map((cat,index)=>(
                <opton key={index} value={cat}>{cat}</opton>
              ))}
            </select>
            {errors.category && <span className="error-message">{errors.category}</span>}

        </div>
        <div className="form-group">
          <label htmlFor="courseCode" className="form-label">Course Code*</label>
          <input
          type="text"
          id="courseCode"
          name="courseCode"
          value={formData.courseCode}
          onChange={handleChange}
          placeholder="Enter course code (eg CS1201)"
          className='form-input'
          />
          {errors.courseCode && <span className="error-message">{errors.courseCode}</span>}
        </div>
        <button type="submit" className="submit-button">Submit Issue</button>
      </form>
    </div>
  );
};
export default IssueForm;
