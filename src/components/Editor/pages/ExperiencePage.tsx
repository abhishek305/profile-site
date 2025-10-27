import { useState, useEffect } from "react";
import { pageContent } from "@/data/pageContent";
import type { ExperienceData } from "@/types";

const ExperiencePage = () => {
  const experienceData = pageContent.experience.data as ExperienceData[];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in on mount
    setIsVisible(true);
  }, []);

  const handleJobClick = (index: number) => {
    setIsVisible(false);
    setTimeout(() => {
      setActiveIndex(index);
      setIsVisible(true);
    }, 200);
  };

  const activeJob = experienceData[activeIndex];

  return (
    <div className="md-content max-w-4xl mx-auto">
      <h1>Experience</h1>
      <div className="experience-container">
        <div className="experience-list">
          {experienceData.map((job, index) => (
            <button key={index} className={`experience-list-item w-full text-left ${index === activeIndex ? "active" : ""}`} onClick={() => handleJobClick(index)}>
              <h3>{job.role}</h3>
              <p>{job.company}</p>
            </button>
          ))}
        </div>
        <div className={`experience-detail-content ${isVisible ? "content-visible" : ""}`}>
          <h3>{activeJob.role}</h3>
          <span>{activeJob.date}</span>
          <ul className="mt-4">
            {activeJob.highlights.map((highlight, idx) => (
              <li key={idx}>{highlight}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExperiencePage;
