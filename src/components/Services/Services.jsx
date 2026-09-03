import React from 'react';
import './Services.css';

// Detailed Medical Line-Art SVG Icons for Centres of Excellence
const BoneJointIcon = () => (
  <svg width="84" height="84" viewBox="0 0 100 100" fill="none" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 43 8 L 43 24 C 43 30 35 32 35 40 C 35 46 43 47 47 45 C 49 44 51 44 53 45 C 57 47 65 46 65 40 C 65 32 57 30 57 24 L 57 8" />
    <path d="M 43 92 L 43 76 C 43 70 35 68 35 60 C 35 54 43 53 47 55 C 49 56 51 56 53 55 C 57 53 65 54 65 60 C 65 68 57 70 57 76 L 57 92" />
    <path d="M 26 36 C 18 46 18 54 26 64" strokeWidth="3.2" />
    <path d="M 74 36 C 82 46 82 54 74 64" strokeWidth="3.2" />
  </svg>
);

const CancerIcon = () => (
  <svg width="84" height="84" viewBox="0 0 100 100" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 37 84 L 62 38 C 69 27 63 12 50 12 C 37 12 31 27 38 38 L 63 84" />
    <path d="M 49 84 L 69 47 C 79 31 70 8 50 8 C 30 8 21 31 31 47 L 51 84" />
    <line x1="37" y1="84" x2="49" y2="84" />
    <line x1="51" y1="84" x2="63" y2="84" />
    <path d="M 38 38 L 63 84" strokeWidth="3.2" />
    <path d="M 31 47 L 51 84" strokeWidth="3.2" />
  </svg>
);

const EyeCareIcon = () => (
  <svg width="88" height="88" viewBox="0 0 100 100" fill="none" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="50" y1="22" x2="50" y2="12" />
    <line x1="30" y1="27" x2="21" y2="18" />
    <line x1="70" y1="27" x2="79" y2="18" />
    <path d="M 12 52 C 24 32 76 32 88 52 C 76 72 24 72 12 52 Z" />
    <circle cx="50" cy="52" r="14" />
    <circle cx="50" cy="52" r="6" fill="#ea580c" />
  </svg>
);

const HeartIcon = () => (
  <svg width="84" height="84" viewBox="0 0 100 100" fill="none" stroke="#2563eb" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 32 18 L 32 30" />
    <path d="M 38 14 L 38 28" />
    <path d="M 44 26 C 44 18 52 14 62 14 C 74 14 80 22 80 32 C 80 36 78 40 74 44" />
    <path d="M 52 14 L 50 6" />
    <path d="M 55 14 L 54 6" />
    <path d="M 60 14 L 61 6" />
    <path d="M 64 14 L 65 6" />
    <path d="M 70 16 L 73 8" />
    <path d="M 73 18 L 76 10" />
    <path d="M 32 30 C 24 34 20 44 22 56 C 26 70 42 84 54 90 C 60 92 64 90 68 84 C 78 74 86 60 84 46 C 82 36 74 30 68 30 C 60 30 52 34 46 38 C 42 34 36 30 32 30 Z" />
    <path d="M 46 38 C 44 50 48 64 54 90" />
  </svg>
);

const RadiologyIcon = () => (
  <svg width="88" height="88" viewBox="0 0 100 100" fill="none" stroke="#2563eb" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 38 24 C 40 18 46 14 50 14 C 54 14 60 18 64 24 Z" />
    <path d="M 38 24 C 38 34 44 38 50 38 C 56 38 62 34 62 24" />
    <line x1="46" y1="38" x2="46" y2="44" />
    <line x1="54" y1="38" x2="54" y2="44" />
    <path d="M 46 44 C 36 46 26 50 20 56" />
    <path d="M 54 44 C 64 46 74 50 80 56" />
    <rect x="18" y="52" width="64" height="42" rx="4" strokeWidth="2.8" />
    <line x1="50" y1="56" x2="50" y2="88" strokeWidth="2.8" />
    <path d="M 50 60 L 36 60 L 32 63" />
    <path d="M 50 60 L 64 60 L 68 63" />
    <path d="M 50 66 L 34 66 L 30 69" />
    <path d="M 50 66 L 66 66 L 70 69" />
    <path d="M 50 72 L 34 72 L 30 75" />
    <path d="M 50 72 L 66 72 L 70 75" />
  </svg>
);

const NeuroscienceIcon = () => (
  <svg width="88" height="88" viewBox="0 0 100 100" fill="none" stroke="#2563eb" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 48 70 C 50 78 54 84 56 90" strokeWidth="2.8" />
    <path d="M 56 68 C 60 76 64 82 64 88" strokeWidth="2.8" />
    <path d="M 54 68 C 64 62 76 62 82 68 C 82 72 74 76 64 76 Z" strokeWidth="2.6" />
    <path d="M 32 66 C 20 66 14 56 14 44 C 14 34 22 24 34 20 C 44 16 56 14 68 18 C 78 22 86 32 86 44 C 86 54 80 62 70 66" strokeWidth="2.8" />
    <path d="M 22 46 C 36 40 50 46 66 40 C 76 36 82 30 86 28" strokeWidth="2.8" />
  </svg>
);

const coeList = [
  {
    id: 'bone-joint',
    title: 'Bone & Joint Centre',
    icon: <BoneJointIcon />,
    color: '#fff7ed'
  },
  {
    id: 'cancer',
    title: 'Cancer Centre',
    icon: <CancerIcon />,
    color: '#eff6ff'
  },
  {
    id: 'eye-care',
    title: 'Eye Care Centre',
    icon: <EyeCareIcon />,
    color: '#fff7ed'
  },
  {
    id: 'heart',
    title: 'Heart Centre',
    icon: <HeartIcon />,
    color: '#eff6ff'
  },
  {
    id: 'radiology',
    title: 'Interventional Radiology',
    icon: <RadiologyIcon />,
    color: '#eff6ff'
  },
  {
    id: 'neuroscience',
    title: 'Neuroscience',
    icon: <NeuroscienceIcon />,
    color: '#eff6ff'
  }
];

const Services = () => {
  return (
    <section id="services" className="services-section">
      <div className="container">
        <div className="section-header">
          <p className="section-label">CENTRES OF EXCELLENCE</p>
          <h2>Centres of <span>Excellence</span></h2>
        </div>

        <div className="coe-static-grid">
          {coeList.map((item) => (
            <div key={item.id} className="coe-static-card">
              <div className="icon-wrapper" style={{ backgroundColor: item.color }}>
                {item.icon}
              </div>
              <h3>{item.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
