import React from 'react';

const SKILL_GROUPS = [
  {
    category: "Languages",
    skills: ["C", "C++", "Python", "Java"]
  },
  {
    category: "Frontend",
    skills: ["HTML", "CSS", "JavaScript", "React.js", "Bootstrap", "Tailwind CSS"]
  },
  {
    category: "Backend & Databases",
    skills: ["Node.js", "Express.js", "REST APIs", "JWT", "MongoDB", "MySQL"]
  },
  {
    category: "AI",
    skills: ["Prompt Engineering", "ChatGPT", "OpenAI APIs", "Google Gemini"]
  },
  {
    category: "Tools",
    skills: ["Git", "GitHub", "Linux CLI", "Vercel", "Render", "Flutter"]
  }
];

const SKILL_ICONS = {
  HTML: '/icons/html.svg',
  CSS: '/icons/css.svg',
  JavaScript: '/icons/js.svg',
  'React.js': '/icons/react.svg',
  'Node.js': '/icons/node.svg',
  Git: '/icons/git.svg',
  GitHub: '/icons/github.svg'
};

export default function Skills() {
  return (
    <section id="skills">
      <div className="c">
        <h2 className="st s3d" data-s3d="title">
          My <span>Skills</span>
        </h2>

        {/* Technical Skills Grid matching Original .sg / .sr.tilt Structure */}
        <div className="sg">
          {SKILL_GROUPS.map((group, idx) => (
            <div
              key={group.category}
              className="sr s3d tilt"
              data-s3d="wave-row"
              data-idx={idx}
            >
              <h3>{group.category}</h3>
              <div className="sl">
                {group.skills.map((skill, sIdx) => (
                  <span
                    key={skill}
                    className="sk"
                    style={{ '--sk-i': sIdx }}
                  >
                    {SKILL_ICONS[skill] && (
                      <img src={SKILL_ICONS[skill]} alt="" loading="lazy" />
                    )}
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
