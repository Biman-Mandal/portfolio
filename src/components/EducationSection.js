import React from 'react';

export default function EducationSection({ id, title, kicker }) {
  // Dynamically calculate present experience (Sundew starting Jan 2026)
  const today = new Date();
  const startYear = 2026;
  const startMonth = 0; // Jan is 0
  const currentRoleMonths = (today.getFullYear() - startYear) * 12 + (today.getMonth() - startMonth) + 1;

  const currentPeriodYears = Math.floor(currentRoleMonths / 12);
  const currentPeriodRemainingMonths = currentRoleMonths % 12;
  const currentRolePeriodFormatted = currentPeriodYears > 0 
    ? `${currentPeriodYears} yr${currentPeriodYears > 1 ? 's' : ''}${currentPeriodRemainingMonths > 0 ? ` ${currentPeriodRemainingMonths} mo${currentPeriodRemainingMonths > 1 ? 's' : ''}` : ''}`
    : `${currentRoleMonths} mo${currentRoleMonths > 1 ? 's' : ''}`;

  const presentPeriodString = `Jan 2026 - Present · ${currentRolePeriodFormatted}`;

  // Sum of other jobs (Trainee PHP: 5 mos, Junior Web Dev: 2 mos, Web Dev: 24 mos, Project Associate: 12 mos, Senior Web Dev: 6 mos) = 49 mos
  const otherExperienceMonths = 5 + 2 + 24 + 12 + 6;
  const totalExperienceMonths = otherExperienceMonths + currentRoleMonths;
  const totalYears = Math.floor(totalExperienceMonths / 12);
  const totalMonths = totalExperienceMonths % 12;
  
  const totalExperienceText = `${totalYears} Yr${totalYears > 1 ? 's' : ''}${totalMonths > 0 ? ` ${totalMonths} Mo${totalMonths > 1 ? 's' : ''}` : ''}`;

  const careerItems = [
    {
      id: 'c1',
      title: 'A2 Associate',
      company: 'Sundew',
      companyUrl: 'https://www.linkedin.com/company/sun-dew-solution/',
      period: presentPeriodString,
      location: 'Kolkata, West Bengal, India · On-site',
      description: '',
    },
    {
      id: 'c2',
      title: 'Senior Web Developer',
      company: 'Inforoot Solution',
      companyUrl: 'https://www.linkedin.com/company/inforoot-solution/',
      period: 'Apr 2025 - Sep 2025 · 6 mos',
      location: 'Remote',
      description: 'Laravel and MySQL',
    },
    {
      id: 'c3',
      title: 'Project Associate',
      company: 'Notebrains',
      companyUrl: 'https://www.linkedin.com/company/notebrains/',
      period: 'Apr 2024 - Mar 2025 · 1 yr',
      location: 'Kolkata, West Bengal, India',
      description: 'Node.js, Express.js and +5 skills',
    },
    {
      id: 'c4',
      title: 'Web Developer',
      company: 'Notebrains',
      companyUrl: 'https://www.linkedin.com/company/notebrains/',
      period: 'Apr 2022 - Mar 2024 · 2 yrs',
      location: 'On-site',
      description: 'Laravel and MySQL',
    },
    {
      id: 'c5',
      title: 'Junior Web Developer',
      company: 'Notebrains',
      companyUrl: 'https://www.linkedin.com/company/notebrains/',
      period: 'Feb 2022 - Mar 2022 · 2 mos',
      location: '',
      description: '',
    },
    {
      id: 'c6',
      title: 'Trainee Developer',
      company: 'AGPAYTECH LTD.',
      companyUrl: 'https://www.linkedin.com/company/agpaytech-ltd-/',
      period: 'Apr 2021 - Aug 2021 · 5 mos',
      location: 'Kolkata, West Bengal, India',
      description: '',
    },
  ];

  return (
    <section id={id} className="section alt">
      <div className="section-header reveal">
        <div>
          <h2>{title}</h2>
          <p>{kicker}</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(139, 92, 246, 0.08)', border: '0.5px solid var(--line)', padding: '6px 12px', borderRadius: '20px', marginTop: '12px', fontSize: '13.5px', color: 'var(--muted)', fontWeight: 600 }}>
            <span style={{ color: 'var(--accent-2)', fontSize: '10px' }}>●</span> Total Professional Experience: <span style={{ color: '#ffffff', marginLeft: '4px' }}>{totalExperienceText}</span>
          </div>
        </div>
      </div>
      <div className="timeline-container">
        <div className="timeline-line" />
        <div className="timeline-items">
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
                  {item.title}
                  {item.company && (
                    <>
                      {" – "}
                      {item.companyUrl ? (
                        <a 
                          href={item.companyUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="company-link"
                          style={{ 
                            color: "#c4b5fd", 
                            textDecoration: "underline",
                            textUnderlineOffset: "4px"
                          }}
                        >
                          {item.company}
                        </a>
                      ) : (
                        item.company
                      )}
                    </>
                  )}
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
