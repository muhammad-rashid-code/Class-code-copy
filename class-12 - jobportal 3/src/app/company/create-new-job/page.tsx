"use client";

import { auth, db } from "@/firebase/firebaseconfig";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

type NewJobType = {
  jobTitle: string;
  jobDescription: string;
  qualification: string;
  skillSet: string;
  otherRequirements: string;
  jobType: string;
  salaryRange: string;
  address: string;
  uid: string;
};

export default function CreateNewJob() {
  const [jobTitle, setJobTitle] = useState("");
  const [jd, setJD] = useState("");
  const [qualification, setQualification] = useState("");
  const [skillSet, setSkillSet] = useState("");
  const [otherReq, setOtherReq] = useState("");
  const [jobType, setJobType] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [address, setAddress] = useState("");
  const [readJob, setReadJob] = useState<NewJobType[]>([]);
  const [loading, setLoading] = useState(false); // Loading state for fetching jobs
  const [error, setError] = useState<string | null>(null); // Error state for better error handling

  // Function to create a new job posting
  const createNewJob = async () => {
    if (
      !jobTitle ||
      !jd ||
      !qualification ||
      !skillSet ||
      !salaryRange ||
      !address
    ) {
      setError("Please fill out all fields before submitting.");
      return;
    }
    try {
      const newJob = {
        jobTitle,
        jobDescription: jd,
        qualification,
        skillSet,
        otherRequirements: otherReq,
        jobType,
        salaryRange,
        address,
        uid: auth.currentUser?.uid,
      };

      let newJobsRef = collection(db, "jobs");
      await addDoc(newJobsRef, newJob);

      // Reset the form after submission
      setJobTitle("");
      setJD("");
      setQualification("");
      setSkillSet("");
      setOtherReq("");
      setJobType("");
      setSalaryRange("");
      setAddress("");
      setError(null); // Clear the error
    } catch (e) {
      console.log(e);
      setError("Error creating the job. Please try again.");
    }
  };

  // Function to read existing job postings
  const readNewJobs = async () => {
    setLoading(true);
    try {
      let newJobsRef = collection(db, "jobs");
      const querySnapShot = await getDocs(newJobsRef);
      const jobs: NewJobType[] = [];
      querySnapShot.forEach((item) => {
        jobs.push({
          jobTitle: item.data().jobTitle,
          jobDescription: item.data().jobDescription,
          qualification: item.data().qualification,
          skillSet: item.data().skillSet,
          otherRequirements: item.data().otherRequirements,
          jobType: item.data().jobType,
          salaryRange: item.data().salaryRange,
          address: item.data().address,
          uid: item.data().uid,
        });
      });
      setReadJob(jobs);
    } catch (e) {
      console.log(e);
      setError("Error fetching the jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs when the component mounts
  useEffect(() => {
    readNewJobs();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center mt-20">
      <h1 className="text-xl font-bold">Job Requirements</h1>
      <p>Please enter job requirements.</p>

      {/* Display error messages if any */}
      {error && <p className="text-red-500">{error}</p>}

      <div className="card bg-base-100 w-96 shadow-xl gap-2">
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Job Title"
            value={jobTitle}
            onChange={(e) => {
              setJobTitle(e.target.value);
            }}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Job Description"
            value={jd}
            onChange={(e) => {
              setJD(e.target.value);
            }}
          />
        </label>

        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Qualification"
            value={qualification}
            onChange={(e) => {
              setQualification(e.target.value);
            }}
          />
        </label>

        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Skill Set"
            value={skillSet}
            onChange={(e) => {
              setSkillSet(e.target.value);
            }}
          />
        </label>

        <textarea
          className="textarea"
          placeholder="Other Requirements"
          value={otherReq}
          onChange={(e) => {
            setOtherReq(e.target.value);
          }}
        ></textarea>

        <select
          className="select select-bordered w-full"
          value={jobType}
          defaultValue={"Job Type"}
          onChange={(e) => {
            setJobType(e.target.value);
          }}
        >
          <option disabled>Job Type</option>
          <option value={"internship"}>Internship</option>
          <option value={"contract"}>Contract</option>
          <option value={"part time"}>Part Time</option>
          <option value={"full time"}>Full Time</option>
        </select>

        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Salary Range"
            value={salaryRange}
            onChange={(e) => {
              setSalaryRange(e.target.value);
            }}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Address"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
          />
        </label>
        <button className="btn btn-primary" onClick={createNewJob}>
          Create New Job
        </button>
      </div>

      {/* Display loading or jobs */}
      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <div>
          <h2 className="text-xl mt-10">Existing Job Listings</h2>
          <ul className="list-disc pl-5">
            {readJob.map((job, index) => (
              <li key={index} className="mt-2">
                <h3 className="text-lg font-semibold">{job.jobTitle}</h3>
                <p>{job.jobDescription}</p>
                <p>Qualification: {job.qualification}</p>
                <p>Salary: {job.salaryRange}</p>
                <p>Location: {job.address}</p>
                <p>Job Type: {job.jobType}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
