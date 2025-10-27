import { useState, useEffect } from "react";
import { pageContent } from "@/data/pageContent";
import type { SkillCategory } from "@/types";

const SkillsPage = () => {
  const skillsData = pageContent.skills.data as SkillCategory[];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in on mount
    setIsVisible(true);
  }, []);

  const handleCategoryClick = (index: number) => {
    setIsVisible(false);
    setTimeout(() => {
      setActiveIndex(index);
      setIsVisible(true);
    }, 200);
  };

  const activeCategory = skillsData[activeIndex];

  return (
    <div className="md-content max-w-4xl mx-auto">
      <h1>Skills</h1>
      <div className="skills-container">
        <div className="skills-list">
          {skillsData.map((category, index) => (
            <button key={category.id} className={`skills-list-item w-full text-left ${index === activeIndex ? "active" : ""}`} onClick={() => handleCategoryClick(index)}>
              {category.category}
            </button>
          ))}
        </div>
        <div className={`skills-detail-content ${isVisible ? "content-visible" : ""}`}>
          <ul>
            {activeCategory.skills.map((skill, idx) => (
              <li key={idx}>{skill}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SkillsPage;
