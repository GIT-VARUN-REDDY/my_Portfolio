import React, { memo } from 'react';

const JOURNEY_ITEMS = [
  {
    period: "Dec 2024",
    title: "MERN Stack Developer Intern",
    description: "EY Global Delivery Services (GDS), Dec 2024 to Jan 2025. Built full-stack apps with React, Node.js, Express and MongoDB."
  },
  {
    period: "Apr 2026",
    title: "B.Tech in ECE",
    description: "Teegala Krishna Reddy Engineering College, graduated April 2026."
  },
  {
    period: "Sep 2026",
    title: "Technical Associate Intern",
    description: "Ample Semiconductors, since September 2026."
  }
];

export default memo(function Journey() {
  return (
    <section id="journey">
      <div className="c">
        <h2 className="st s3d" data-s3d="title">
          My <span>Journey</span>
        </h2>

        {/* Journey Grid matching Original .jg / .jc.tilt */}
        <div className="jg">
          {JOURNEY_ITEMS.map((item, idx) => (
            <div
              key={item.title}
              className="jc s3d tilt"
              data-s3d="step"
              data-idx={idx}
            >
              <small>{item.period}</small>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
