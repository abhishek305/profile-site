import { useState, useEffect } from "react";
import { experienceData } from "@/data/content";

const ExperiencePage = () => {
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
        <div className="experience-list" role="tablist" aria-label="Roles">
          {experienceData.map((job, index) => (
            <button key={`${job.company}-${job.date}`} role="tab" aria-selected={index === activeIndex} className={`experience-list-item w-full text-left ${index === activeIndex ? "active" : ""}`} onClick={() => handleJobClick(index)}>
              <h3>
                {job.role}
                {job.current && <span className="current-dot" title="Current role" aria-label="Current role" />}
              </h3>
              <p>{job.company}</p>
            </button>
          ))}
        </div>
        <div className={`experience-detail-content ${isVisible ? "content-visible" : ""}`} role="tabpanel">
          <h3>{activeJob.role}</h3>
          <span>{activeJob.date}</span>
          {activeJob.tech && (
            <ul className="tech-chips">
              {activeJob.tech.map((tech) => (
                <li key={tech} className="tech-chip font-mono">
                  {tech}
                </li>
              ))}
            </ul>
          )}
          <ul className="mt-4">
            {activeJob.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExperiencePage;
