import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import JobPostingForm from './components/JobPostingForm';
import Navbar from './components/Navbar';
import moment from 'moment';

const API_BASE_URL = 'https://job-portal-backend-2-n1nc.onrender.com/jobs';

const AppContainer = styled.div`
  font-family: sans-serif;
`;

const NavbarContainer = styled.div`
  background-color: #f8f9fa;
  padding: 15px 40px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    padding: 15px 20px;
  }
`;

const NavbarTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin: 0;
`;

const CreateJobButton = styled.button`
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
`;

const ContentContainer = styled.div`
  margin-top: 20px;
  padding: 20px 40px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Heading = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 12px;
`;

const Paragraph = styled.p`
  font-size: 16px;
  color: #555;
  max-width: 600px;
  margin: 0 auto 30px;
  line-height: 1.6;
`;

const JobsSectionTitle = styled.h2`
  font-size: 24px;
  color: #333;
  margin-top: 40px;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
`;

const CreatedJobContainer = styled.div`
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 30px;
  justify-content: center;

  @media (min-width: 992px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const CreatedJobCard = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  text-align: left;
`;

const JobDetail = styled.p`
  margin: 8px 0;
  font-size: 16px;
  line-height: 1.5;
  color: #444;

  span {
    font-weight: 600;
    color: #111;
    margin-right: 10px;
  }
`;

const JobDescriptionDetail = styled(JobDetail)`
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const NoJobsMessage = styled.p`
  color: #777;
  font-style: italic;
  margin-top: 30px;
`;

const ApplyNowButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 15px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #1e7e34;
  }
`;

const Timestamp = styled.p`
  font-size: 12px;
  color: #777;
  margin-top: 10px;
  text-align: right;
`;

function App() {
  const [showForm, setShowForm] = useState(false);
  const [createdJobs, setCreatedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companyExistsError, setCompanyExistsError] = useState(null);

  const handleCreateJobClick = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCreatedJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load job postings. Please try again later.');
      setCreatedJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSubmitJob = async (formData) => {
    setError(null);
    setCompanyExistsError(null);

    const newJobWithTimestamp = { ...formData, id: Date.now(), created_at: new Date() };
    setCreatedJobs(prevJobs => [newJobWithTimestamp, ...prevJobs]);
    setShowForm(false);

    try {
      console.log("Submitting job data to backend:", formData);

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log("Response from backend:", response);

      if (response.status === 409) {
        const errorData = await response.json();
        setCompanyExistsError(errorData.message || 'Company details already exist.');
        return;
      }

      if (!response.ok) {
        let errorMsg = `Failed to create job in backend. Status: ${response.status}`;
        try {
          const errorData = await response.json();
          console.log("Error data from backend:", errorData);
          errorMsg = errorData.message || errorMsg;
        } catch (parseError) {
          console.error("Could not parse error response:", parseError);
        }
        throw new Error(errorMsg);
      }

      const responseData = await response.json();
      console.log("Received response from backend:", responseData);

      setCreatedJobs(prevJobs =>
        prevJobs.map(job =>
          job.id === newJobWithTimestamp.id ? { ...job, id: responseData.id } : job
        )
      );

    } catch (err) {
      console.error('Error posting job to backend:', err);
      setError(err.message || 'An unexpected error occurred while posting the job to the backend.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
      return utcDate.toLocaleDateString('en-CA');
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  const formatSalary = (min, max) => {
    if (min && max) {
      return `₹${Number(min).toLocaleString()} - ₹${Number(max).toLocaleString()}`;
    } else if (min) {
      return `From ₹${Number(min).toLocaleString()}`;
    } else if (max) {
      return `Up to ₹${Number(max).toLocaleString()}`;
    } else {
      return 'Not specified';
    }
  };

  const getTimeAgo = (date) => {
    return moment(date).fromNow();
  };

  return (
    <AppContainer>
      <NavbarContainer>
        <Navbar onCreateJobClick={handleCreateJobClick} />
      </NavbarContainer>

      <ContentContainer>
        <Heading>Welcome to the Job Portal</Heading>
        <Paragraph>
          Find your next career opportunity or post a job opening for talented individuals.
          Click the button below to post a new job.
        </Paragraph>
        {error && <p style={{ color: 'red', fontWeight: 'bold' }}>Error: {error}</p>}
        {companyExistsError && <p style={{ color: 'orange', fontWeight: 'bold' }}>{companyExistsError}</p>}
        <JobsSectionTitle>Job Openings</JobsSectionTitle>
        {isLoading ? (
          <p>Loading job postings...</p>
        ) : !createdJobs || createdJobs.length === 0 ? (
          <NoJobsMessage>No job postings available at the moment.</NoJobsMessage>
        ) : (
          <CreatedJobContainer>
            {createdJobs.map((job) => (
              <CreatedJobCard key={job.id}>
                <JobDetail><span>Title:</span> {job.job_title}</JobDetail>
                <JobDetail><span>Location:</span> {job.location}</JobDetail>
                <JobDetail><span style={{ verticalAlign: 'top' }}>Description:</span> {job.job_description}</JobDetail>
                <JobDetail><span style={{ verticalAlign: 'top' }}>Responsibilities:</span> {job.responsibilities}</JobDetail>
                {job.salary_min !== null || job.salary_max !== null ? (
                  <JobDetail><span>Salary Range:</span> {formatSalary(job.salary_min, job.salary_max)}</JobDetail>
                ) : null}
                {job.experience && <JobDetail><span>Experience:</span> {job.experience}</JobDetail>}
                <ApplyNowButton>Apply Now</ApplyNowButton>
                <Timestamp>{getTimeAgo(job.created_at)}</Timestamp>
              </CreatedJobCard>
            ))}
          </CreatedJobContainer>
        )}
      </ContentContainer>

      {showForm && (
        <JobPostingForm
          onClose={handleCloseForm}
          onSubmit={handleSubmitJob}
        />
      )}
    </AppContainer>
  );
}

export default App;