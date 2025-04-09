import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useForm } from 'react-hook-form';

const fadeIn = keyframes`
 from { opacity: 0; transform: translateY(-10px); }
 to { opacity: 1; transform: translateY(0); }
`;

const Overlay = styled.div`
 position: fixed;
 top: 0;
 left: 0;
 right: 0;
 bottom: 0;
 background-color: rgba(0, 0, 0, 0.4);
 display: flex;
 align-items: center;
 justify-content: center;
 z-index: 1000;
`;

const JobFormContainer = styled.div`
 background-color: #fff;
 padding: 24px;
 border-radius: 12px;
 box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
 width: 100%;
 max-width: 500px;
 animation: ${fadeIn} 0.3s ease-out;
 max-height: 90vh;
 overflow-y: auto;

  &::-webkit-scrollbar {
  width: 8px;
 }
 &::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
 }
 &::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
 }
 &::-webkit-scrollbar-thumb:hover {
  background: #aaa;
 }
`;

const FormGroup = styled.div`
 margin-bottom: 16px;
`;

const Label = styled.label`
 font-weight: 600;
 display: block;
 margin-bottom: 6px;
 font-size: 14px;
`;

const Input = styled.input`
 width: 100%;
 padding: 8px 10px;
 border-radius: 8px;
 border: 1px solid #ccc;
 font-size: 14px;
 box-sizing: border-box;
`;

const Select = styled.select`
 width: 100%;
 padding: 8px 10px;
 border-radius: 8px;
 border: 1px solid #ccc;
 font-size: 14px;
 box-sizing: border-box;
`;

const Textarea = styled.textarea`
 width: 100%;
 padding: 8px 10px;
 border-radius: 8px;
 border: 1px solid #ccc;
 font-size: 14px;
 min-height: 70px;
 box-sizing: border-box;
`;

const Button = styled.button`
 padding: 10px 18px;
 background-color: #007bff;
 color: #fff;
 border: none;
 border-radius: 8px;
 font-size: 14px;
 cursor: pointer;
 transition: background-color 0.2s ease;

 &:hover {
  background-color: #0056b3;
 }

 &:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
 }
`;

const CloseButton = styled(Button)`
 background-color: #6c757d;
 margin-right: 10px;
 &:hover {
  background-color: #5a6268;
 }
`;

const ButtonRow = styled.div`
 display: flex;
 justify-content: flex-end;
 margin-top: 20px;
`;

const ErrorMessage = styled.p`
 color: red;
 font-size: 12px;
 margin-top: 4px;
 margin-bottom: 0;
`;

const SalaryGroup = styled.div`
 display: flex;
 gap: 10px;
 align-items: center;

 & > div {
  flex: 1;
 }
`;


const JobPostingForm = ({ onClose, onSubmit }) => {
 const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
 } = useForm();

 const submitHandler = (data) => {
  const processedData = {
   ...data,
   salary_min: data.salary_min ? Number(data.salary_min) : null,
   salary_max: data.salary_max ? Number(data.salary_max) : null,
  };
  delete processedData.salaryRange;
  onSubmit(processedData);
 };


 return (
  <Overlay onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
   <JobFormContainer>
    <form onSubmit={handleSubmit(submitHandler)}>
     <h2>Create New Job Posting</h2>
     <FormGroup>
      <Label htmlFor="job_title">Job Title *</Label>
      <Input id="job_title" {...register("job_title", { required: "Job Title is required" })} />
      {errors.job_title && <ErrorMessage>{errors.job_title.message}</ErrorMessage>}
     </FormGroup>
     <FormGroup>
      <Label htmlFor="company_name">Company Name *</Label>
      <Input id="company_name" {...register("company_name", { required: "Company Name is required" })} />
      {errors.company_name && <ErrorMessage>{errors.company_name.message}</ErrorMessage>}
     </FormGroup>
     <FormGroup>
      <Label htmlFor="location">Location *</Label>
      <Input id="location" {...register("location", { required: "Location is required" })} />
      {errors.location && <ErrorMessage>{errors.location.message}</ErrorMessage>}
     </FormGroup>
     <Label>Salary Range (Monthly, Optional)</Label>
     <SalaryGroup>
      <FormGroup>
       <Label htmlFor="salary_min" style={{fontSize: '12px', fontWeight: 'normal'}}>Minimum (e.g., 50000)</Label>
       <Input
        id="salary_min"
        type="number"
        placeholder="Min Salary"
        {...register("salary_min", {
         min: { value: 0, message: "Salary cannot be negative" },
         valueAsNumber: true,
        })}
       />
       {errors.salary_min && <ErrorMessage>{errors.salary_min.message}</ErrorMessage>}
      </FormGroup>
      <span style={{alignSelf: 'flex-end', paddingBottom: '10px'}}>-</span>
      <FormGroup>
       <Label htmlFor="salary_max" style={{fontSize: '12px', fontWeight: 'normal'}}>Maximum (e.g., 80000)</Label>
       <Input
        id="salary_max"
        type="number"
        placeholder="Max Salary"
        {...register("salary_max", {
         min: { value: 0, message: "Salary cannot be negative" },
         valueAsNumber: true,
        })}
       />
       {errors.salary_max && <ErrorMessage>{errors.salary_max.message}</ErrorMessage>}
      </FormGroup>
     </SalaryGroup>
     <FormGroup>
      <Label htmlFor="experience">Experience (Optional)</Label>
      <Input id="experience" type="text" {...register("experience")} />
     </FormGroup>
     <FormGroup>
      <Label htmlFor="applicationDeadline">Application Deadline (Optional)</Label>
      <Input id="applicationDeadline" type="date" {...register("application_deadline")} />
      {errors.application_deadline && <ErrorMessage>{errors.application_deadline.message}</ErrorMessage>}
     </FormGroup>
     <FormGroup>
      <Label htmlFor="jobType">Job Type *</Label>
      <Select id="jobType" defaultValue="" {...register("job_type", { required: "Job Type is required" })}>
       <option value="" disabled>Select Job Type</option>
       <option value="Full-time">Full-time</option>
       <option value="Part-time">Part-time</option>
       <option value="Contract">Contract</option>
       <option value="Internship">Internship</option>
      </Select>
      {errors.job_type && <ErrorMessage>{errors.job_type.message}</ErrorMessage>}
     </FormGroup>
     <FormGroup>
      <Label htmlFor="jobDescription">Job Description *</Label>
      <Textarea id="jobDescription" {...register("job_description", { required: "Job Description is required" })} />
      {errors.job_description && <ErrorMessage>{errors.job_description.message}</ErrorMessage>}
     </FormGroup>
     <FormGroup>
      <Label htmlFor="requirements">Requirements *</Label>
      <Textarea id="requirements" {...register("requirements", { required: "Requirements are required" })} />
      {errors.requirements && <ErrorMessage>{errors.requirements.message}</ErrorMessage>}
     </FormGroup>
     <FormGroup>
      <Label htmlFor="responsibilities">Responsibilities *</Label>
      <Textarea id="responsibilities" {...register("responsibilities", { required: "Responsibilities are required" })} />
      {errors.responsibilities && <ErrorMessage>{errors.responsibilities.message}</ErrorMessage>}
     </FormGroup>
     <ButtonRow>
      <CloseButton type="button" onClick={onClose} disabled={isSubmitting}>Cancel</CloseButton>
      <Button type="submit" disabled={isSubmitting}>
       {isSubmitting ? 'Publishing...' : 'Publish Job'}
      </Button>
     </ButtonRow>
    </form>
   </JobFormContainer>
  </Overlay>
 );
};

export default JobPostingForm;