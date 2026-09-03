import React from 'react';
import './CentresOfExcellence.css';

// Detailed Medical Line-Art Illustrations matching the Reference Screenshot

// 1. Bone & Joint Centre (Detailed knee/bone joint with collateral ligament brackets)
const BoneJointIcon = () => (
  <svg width="78" height="78" viewBox="0 0 100 100" fill="none" stroke="#e66c24" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    {/* Upper Femur Bone */}
    <path d="M 43 8 L 43 24 C 43 30 35 32 35 40 C 35 46 43 47 47 45 C 49 44 51 44 53 45 C 57 47 65 46 65 40 C 65 32 57 30 57 24 L 57 8" />
    {/* Lower Tibia Bone */}
    <path d="M 43 92 L 43 76 C 43 70 35 68 35 60 C 35 54 43 53 47 55 C 49 56 51 56 53 55 C 57 53 65 54 65 60 C 65 68 57 70 57 76 L 57 92" />
    {/* Left collateral ligament bracket */}
    <path d="M 26 36 C 18 46 18 54 26 64" strokeWidth="3" />
    {/* Right collateral ligament bracket */}
    <path d="M 74 36 C 82 46 82 54 74 64" strokeWidth="3" />
  </svg>
);

// 2. Cancer Centre (Detailed 3D folded cancer awareness ribbon)
const CancerIcon = () => (
  <svg width="78" height="78" viewBox="0 0 100 100" fill="none" stroke="#2563eb" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    {/* Outer Ribbon Boundary */}
    <path d="M 37 84 L 62 38 C 69 27 63 12 50 12 C 37 12 31 27 38 38 L 63 84" />
    {/* Inner Ribbon Boundary / Fold Lines */}
    <path d="M 49 84 L 69 47 C 79 31 70 8 50 8 C 30 8 21 31 31 47 L 51 84" />
    {/* Tail Bottom End Cuts */}
    <line x1="37" y1="84" x2="49" y2="84" />
    <line x1="51" y1="84" x2="63" y2="84" />
    {/* Crossover Front Strand Lines */}
    <path d="M 38 38 L 63 84" strokeWidth="3" />
    <path d="M 31 47 L 51 84" strokeWidth="3" />
  </svg>
);

// 3. Eye Care Centre (Detailed eye illustration with inner iris/pupil detail & top eyelash rays)
const EyeCareIcon = () => (
  <svg width="82" height="82" viewBox="0 0 100 100" fill="none" stroke="#e66c24" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    {/* Top Eyelash / Eyebrow Rays */}
    <line x1="50" y1="22" x2="50" y2="12" />
    <line x1="30" y1="27" x2="21" y2="18" />
    <line x1="70" y1="27" x2="79" y2="18" />
    {/* Outer Eye Contour */}
    <path d="M 12 52 C 24 32 76 32 88 52 C 76 72 24 72 12 52 Z" />
    {/* Outer Iris Circle */}
    <circle cx="50" cy="52" r="14" />
    {/* Inner Pupil Circle with solid fill */}
    <circle cx="50" cy="52" r="6" fill="#e66c24" />
  </svg>
);

// 4. Heart Centre (Detailed anatomical heart with aorta arch, carotid arteries & coronary sulcus)
const HeartIcon = () => (
  <svg width="78" height="78" viewBox="0 0 100 100" fill="none" stroke="#2563eb" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    {/* Superior Vena Cava (Top Left Tube) */}
    <path d="M 32 18 L 32 30" />
    <path d="M 38 14 L 38 28" />
    {/* Aortic Arch */}
    <path d="M 44 26 C 44 18 52 14 62 14 C 74 14 80 22 80 32 C 80 36 78 40 74 44" />
    {/* 3 Artery Branches on Top of Arch */}
    <path d="M 52 14 L 50 6" />
    <path d="M 55 14 L 54 6" />
    <path d="M 60 14 L 61 6" />
    <path d="M 64 14 L 65 6" />
    <path d="M 70 16 L 73 8" />
    <path d="M 73 18 L 76 10" />
    {/* Main Heart Muscle Body */}
    <path d="M 32 30 C 24 34 20 44 22 56 C 26 70 42 84 54 90 C 60 92 64 90 68 84 C 78 74 86 60 84 46 C 82 36 74 30 68 30 C 60 30 52 34 46 38 C 42 34 36 30 32 30 Z" />
    {/* Coronary Artery / Sulcus Lines */}
    <path d="M 46 38 C 44 50 48 64 54 90" />
    <path d="M 50 54 L 56 50" />
    <path d="M 48 64 L 54 60" />
  </svg>
);

// 5. Interventional Radiology (Recreated exact match to Reference Screenshot 1)
const RadiologyIcon = () => (
  <svg width="84" height="84" viewBox="0 0 100 100" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {/* Hair Contour */}
    <path d="M 38 24 C 40 18 46 14 50 14 C 54 14 60 18 64 24 C 62 20 56 16 50 17 C 44 17 40 20 38 24 Z" />
    {/* Head Contour */}
    <path d="M 38 24 C 38 34 44 38 50 38 C 56 38 62 34 62 24" />
    {/* Neck */}
    <line x1="46" y1="38" x2="46" y2="44" />
    <line x1="54" y1="38" x2="54" y2="44" />
    {/* Shoulders */}
    <path d="M 46 44 C 36 46 26 50 20 56" />
    <path d="M 54 44 C 64 46 74 50 80 56" />
    {/* X-Ray Screen Frame */}
    <rect x="18" y="52" width="64" height="42" rx="4" strokeWidth="2.6" />
    {/* Central Spine Column */}
    <line x1="50" y1="56" x2="50" y2="88" strokeWidth="2.6" />
    {/* Rib 1 (Top) */}
    <path d="M 50 60 L 36 60 L 32 63" />
    <path d="M 50 60 L 64 60 L 68 63" />
    {/* Rib 2 */}
    <path d="M 50 66 L 34 66 L 30 69" />
    <path d="M 50 66 L 66 66 L 70 69" />
    {/* Rib 3 */}
    <path d="M 50 72 L 34 72 L 30 75" />
    <path d="M 50 72 L 66 72 L 70 75" />
    {/* Rib 4 */}
    <path d="M 50 78 L 36 78 L 32 81" />
    <path d="M 50 78 L 64 78 L 68 81" />
    {/* Rib 5 (Bottom) */}
    <path d="M 50 84 L 40 84 L 36 87" />
    <path d="M 50 84 L 60 84 L 64 87" />
    {/* Bottom Stand Knobs / Pelvic loops */}
    <circle cx="45" cy="90" r="2.2" fill="#2563eb" />
    <circle cx="55" cy="90" r="2.2" fill="#2563eb" />
  </svg>
);

// 6. Neuroscience (Recreated exact match to Reference Screenshot 1)
const NeuroscienceIcon = () => (
  <svg width="84" height="84" viewBox="0 0 100 100" fill="none" stroke="#2563eb" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    {/* Brainstem (Lower Right extending downwards) */}
    <path d="M 48 70 C 50 78 54 84 56 90" strokeWidth="2.8" />
    <path d="M 56 68 C 60 76 64 82 64 88" strokeWidth="2.8" />
    <line x1="56" y1="90" x2="64" y2="88" strokeWidth="2.8" />
    <line x1="50" y1="78" x2="59" y2="75" />
    <line x1="52" y1="84" x2="61" y2="81" />
    {/* Cerebellum Stacked Bands (Lower Right under Cerebrum) */}
    <path d="M 54 68 C 64 62 76 62 82 68 C 82 72 74 76 64 76 C 56 76 52 72 54 68 Z" strokeWidth="2.6" />
    <path d="M 56 76 C 64 74 74 74 80 78 C 78 82 70 84 60 84 C 54 84 52 80 56 76 Z" strokeWidth="2.6" />
    {/* Cerebrum Outer Contour */}
    <path d="M 32 66 C 20 66 14 56 14 44 C 14 34 22 24 34 20 C 44 16 56 14 68 18 C 78 22 86 32 86 44 C 86 54 80 62 70 66" strokeWidth="2.8" />
    {/* Primary Sylvian Fissure */}
    <path d="M 22 46 C 36 40 50 46 66 40 C 76 36 82 30 86 28" strokeWidth="2.8" />
    {/* Upper Cerebrum Gyri Folds */}
    <path d="M 32 26 C 40 30 46 24 54 30" />
    <path d="M 24 34 C 32 30 42 36 50 32" />
    <path d="M 42 18 C 50 24 56 18 64 22" />
    <path d="M 60 20 C 68 24 74 20 80 28" />
    <path d="M 62 30 C 70 32 78 28 84 36" />
    <path d="M 68 40 C 74 42 80 38 86 44" />
    {/* Lower Cerebrum Gyri Folds */}
    <path d="M 20 54 C 30 48 40 54 50 50" />
    <path d="M 28 62 C 36 58 44 62 52 60" />
  </svg>
);

// 7. Pediatrics (Detailed baby/child with stethoscope illustration)
const PediatricsIcon = () => (
  <svg width="82" height="82" viewBox="0 0 100 100" fill="none" stroke="#e66c24" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    {/* Baby Head */}
    <circle cx="34" cy="28" r="16" />
    {/* Hair Swirl */}
    <path d="M 34 12 C 34 8 38 6 41 9" />
    {/* Smiling Eyes */}
    <path d="M 26 26 C 28 23 31 23 32 26" />
    <path d="M 36 26 C 38 23 41 23 42 26" />
    {/* Smile Mouth */}
    <path d="M 30 33 C 33 36 36 36 38 33" />
    {/* Baby Body */}
    <path d="M 20 40 C 16 46 14 56 16 68 C 18 80 26 86 38 86 C 46 86 52 82 52 72 C 52 62 48 50 44 40" />
    {/* Baby Arm holding chestpiece */}
    <path d="M 34 52 C 42 52 48 56 52 60" />
    {/* Stethoscope Earpieces (Top Right) */}
    <path d="M 70 12 L 70 24 C 70 30 76 34 82 30 L 82 12" />
    <circle cx="70" cy="12" r="2.5" fill="#e66c24" />
    <circle cx="82" cy="12" r="2.5" fill="#e66c24" />
    {/* Stethoscope Tubing S-Curve */}
    <path d="M 76 33 C 76 45 84 50 84 60 C 84 68 76 72 64 72 L 56 72" />
    {/* Stethoscope Chestpiece Disk */}
    <circle cx="56" cy="72" r="7" fill="#fff8ed" strokeWidth="2.8" />
    <circle cx="56" cy="72" r="3" fill="#e66c24" />
  </svg>
);

const centresData = [
  {
    id: 'bone-joint',
    title: 'Bone & Joint Centre',
    icon: <BoneJointIcon />,
    theme: 'orange',
  },
  {
    id: 'cancer',
    title: 'Cancer Centre',
    icon: <CancerIcon />,
    theme: 'blue',
  },
  {
    id: 'eye-care',
    title: 'Eye Care Centre',
    icon: <EyeCareIcon />,
    theme: 'orange',
  },
  {
    id: 'heart',
    title: 'Heart Centre',
    icon: <HeartIcon />,
    theme: 'blue',
  },
  {
    id: 'radiology',
    title: 'Interventional Radiology',
    icon: <RadiologyIcon />,
    theme: 'blue',
  },
  {
    id: 'neuroscience',
    title: 'Neuroscience',
    icon: <NeuroscienceIcon />,
    theme: 'blue',
  },
  {
    id: 'pediatrics',
    title: 'Pediatrics',
    icon: <PediatricsIcon />,
    theme: 'orange',
  },
];

const CentresOfExcellence = () => {
  return (
    <section id="centres-of-excellence" className="coe-section">
      <div className="container coe-container">
        {/* Left Side Header Content */}
        <div className="coe-header-col">
          <h2 className="coe-title">Centres Of Excellence</h2>
          <p className="coe-description">
            Providing world class medical care with state-of-the-art facilities for various specialties.
          </p>
        </div>

        {/* Right Side Cards Grid */}
        <div className="coe-cards-grid">
          {centresData.map((centre) => (
            <div key={centre.id} className="coe-card">
              <div className={`coe-icon-box theme-${centre.theme}`}>
                {centre.icon}
              </div>
              <h3 className="coe-card-title">{centre.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CentresOfExcellence;
