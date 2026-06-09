import React from 'react';

export default function EducationSection({ id, title, kicker }) {
  // Static career entries as per user request
  const careerItems = [
    {
      id: 'c1',
      title: 'Laravel Developer',
      company: 'Sundew',
      period: 'Jan 2026 - Present · 6 mos',
      location: 'Kolkata, West Bengal, India · On-site',
      description: '',
    },
    {
      id: 'c2',
      title: 'Senior Web Developer',
      company: 'Inforoot Solution',
      period: 'Apr 2025 - Sep 2025 · 6 mos',
      location: 'Remote',
      description: '',
    },
    {
      id: 'c3',
      title: 'Project Associate',
      company: 'Notebrains',
      period: 'Apr 2024 - Mar 2025 · 1 yr',
      location: 'Kolkata, West Bengal, India',
      description: 'Node.js, Express.js and +5 skills',
    },
    {
      id: 'c4',
      title: 'Web Developer',
      company: '',
      period: 'Apr 2022 - Mar 2024 · 2 yrs',
      location: 'On-site',
      description: 'Laravel and MySQL',
    },
    {
      id: 'c5',
      title: 'Junior Web Developer',
      company: '',
      period: 'Feb 2022 - Mar 2022 · 2 mos',
      location: '',
      description: '',
    },
    {
      id: 'c6',
      title: 'Trainee Php Developer',
      company: 'AGPAYTECH LTD.',
      period: 'Apr 2021 - Aug 2021 · 5 mos',
      location: 'Kolkata, West Bengal, India',
      description: '',
    },
  ];

  // Education entry (BCA) as provided
  const educationItem = {
    id: 'e1',
    degree: 'BCA, Computer Application',
    institution: 'Techno India (Hooghly Campus) 152',
    period: '2017 – 2020',
    description:
      'Bachelor of Computer Application (BCA)\nTechno India (Hooghly Campus)\nAcquired base computer science knowledge, relational databases, web scripting languages, and application development fundamentals.',
  };

  return (
    <section id={id} className="section alt">
      <div className="section-header reveal">
        <div>
          <h2>{title}</h2>
          <p>{kicker}</p>
        </div>
      </div>
      <div className="timeline-container">
        <div className="timeline-line" />
        <div className="timeline-items">
          {/* Education */}
          <div className="timeline-item reveal" key={educationItem.id}>
            <div className="timeline-dot-wrapper">
              <div className="timeline-dot edu" />
            </div>
            <div className="timeline-content">
              <div
                className="timeline-header"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                  gap: 8,
                }}
              >
                <span className="timeline-tag edu">Education</span>
                <span className="timeline-duration" style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>
                  {educationItem.period}
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 4 }}>{educationItem.degree}</h3>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 8 }}>
                {educationItem.institution}
              </h4>
              <p className="timeline-desc" style={{ marginBottom: 0 }}>
                {educationItem.description}
              </p>
            </div>
          </div>
          {/* Career / Experience */}
          {careerItems.map((item) => (
            <div className="timeline-item reveal" key={item.id}>
              <div className="timeline-dot-wrapper">
                <div className="timeline-dot exp" />
              </div>
              <div className="timeline-content">
                <div
                  className="timeline-header"
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
                    gap: 8,
                  }}
                >
                  <span className="timeline-tag exp">Experience</span>
                  <span className="timeline-duration" style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>
                    {item.period}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 4 }}>
                  {item.title}{item.company ? ` – ${item.company}` : ''}
                </h3>
                {item.location && (
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 8 }}>
                    {item.location}
                  </h4>
                )}
                {item.description && <p className="timeline-desc" style={{ marginBottom: 0 }}>{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
