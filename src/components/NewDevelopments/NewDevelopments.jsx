import React, { useState } from 'react';
import './NewDevelopments.css';
import { X, Calendar, ArrowRight, Tag } from 'lucide-react';

const developmentsData = {
  featured: [
    {
      id: 'dev-1',
      title: 'Oncology Updates – Bridging Science and Practice',
      category: 'Medical CME',
      date: 'October 2024',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      excerpt: 'The Department of Oncology conducted a CME titled "Oncology Updates – Bridging Science and Practice", aimed at integrating the latest clinical research with practical patient care strategies.',
      fullContent: `The Department of Oncology at Bhaktivedanta Hospital & Research Institute hosted a landmark Continuing Medical Education (CME) program titled "Oncology Updates – Bridging Science and Practice". 

The event gathered leading oncologists, radiation specialists, and clinical researchers from across the region to deliberate on modern therapeutic modalities, precision medicine, and integrative cancer care protocols. 

Key topics included targeted immunotherapy advancements, early detection screening protocols, and the hospital's holistic supportive care framework that combines clinical treatment with emotional and spiritual support for patients and caregivers.`
    },
    {
      id: 'dev-2',
      title: 'Urology for Everyone: Innovation & Care" - Exhibition Cum CME',
      category: 'Exhibition & CME',
      date: 'November 2024',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=800&q=80',
      excerpt: 'We had announced the exhibition cum CME "Urology for Everyone: Innovation & Care," which explored the latest advancements in urology, minimally invasive procedures, and preventive health.',
      fullContent: `Bhaktivedanta Hospital & Research Institute successfully conducted a mega Exhibition cum CME themed "Urology for Everyone: Innovation & Care".

The initiative served as an educational platform for medical practitioners, medical students, and the general public, highlighting state-of-the-art diagnostic technologies, laser stone treatments, and minimally invasive urological surgery techniques.

Interactive stalls, live equipment demonstrations, and expert panel discussions empowered attendees with actionable knowledge on urological health, kidney disease prevention, and cutting-edge surgical options.`
    }
  ],
  sidebar: [
    {
      id: 'dev-3',
      title: 'Celebrating World Hospice and Palliative Care Day – 2024',
      category: 'Community Care',
      date: 'October 2024',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=300&q=80',
      excerpt: 'In observance of World Hospice and Palliative Care Day 2024, Bhaktivedanta Hospital organized awareness sessions highlighting holistic, spiritual, and compassionate end-of-life care.',
      fullContent: `In observance of World Hospice and Palliative Care Day 2024, Bhaktivedanta Hospital & Research Institute reaffirmed its commitment to compassionate, dignified care for patients with chronic and terminal illnesses.

The department organized specialized workshops focusing on symptom management, pain relief protocols, psychological counseling, and spiritual care support for families navigating end-of-life care.`
    },
    {
      id: 'dev-4',
      title: "Lighting Up Lives: Bhaktivedanta Hospital's Unique Diwali Celebration",
      category: 'Hospital Events',
      date: 'November 2024',
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=300&q=80',
      excerpt: 'Patients, staff, and doctors came together to celebrate Diwali with traditional lamps, devotional songs, and festive gift distributions across all hospital wards.',
      fullContent: `Bringing joy and warmth to those recovering in wards, Bhaktivedanta Hospital organized a heartwarming Diwali celebration under the banner "Lighting Up Lives".

Hospital leadership, doctors, and volunteers visited inpatient units to distribute nutritious sweets, handmade greeting cards, and devotional gifts while conducting live acoustic kirtan sessions to elevate the mood of patients and healthcare heroes alike.`
    },
    {
      id: 'dev-5',
      title: 'Breast Reconstruction and Cancer Awareness Event, 2024',
      category: 'Awareness Campaign',
      date: 'October 2024',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=300&q=80',
      excerpt: 'Our Pink Ribbon initiative hosted an expert panel discussion on post-mastectomy breast reconstruction, empowering cancer survivors with clinical knowledge and emotional support.',
      fullContent: `As part of Breast Cancer Awareness Month, our Department of Plastic Surgery and Surgical Oncology conducted a specialized seminar titled "Restoring Hope: Breast Reconstruction & Comprehensive Care".

Surgeons provided in-depth guidance on advanced reconstructive techniques following mastectomy, emphasizing physical recovery, self-image restoration, and long-term wellness for cancer survivors.`
    },
    {
      id: 'dev-6',
      title: 'Advanced Robotic Knee Replacement Surgery Unit Launched',
      category: 'Surgical Innovation',
      date: 'December 2024',
      image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=300&q=80',
      excerpt: 'Bhaktivedanta Hospital inaugurated a state-of-the-art Robotic Joint Replacement Unit, offering sub-millimeter precision and faster recovery for knee surgery patients.',
      fullContent: `Bhaktivedanta Hospital & Research Institute has officially inaugurated its next-generation Robotic Knee & Joint Replacement Surgery Unit.

The robotic-arm assisted surgical system enables orthopaedic surgeons to plan and execute joint replacements with sub-millimeter precision tailored to each patient's unique anatomy.

Benefits for patients include minimal soft-tissue trauma, reduced blood loss, shorter hospital stays, and significantly faster rehabilitation and mobility recovery.`
    }
  ]
};

const NewDevelopments = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isAllModalOpen, setIsAllModalOpen] = useState(false);

  const allArticles = [...developmentsData.featured, ...developmentsData.sidebar];

  return (
    <section id="developments" className="developments-section">
      <div className="container">
        {/* Section Header matching Medical Specialties / Services */}
        <div className="section-header fade-in">
          <p className="section-label">NEW DEVELOPMENTS & UPDATES</p>
          <h2>New Development & <span>Updates</span></h2>
        </div>

        {/* Layout Grid */}
        <div className="developments-grid">
          {/* Left Column: Featured Cards (2-column layout) */}
          <div className="featured-cards-wrap">
            {developmentsData.featured.map((item) => (
              <div 
                key={item.id} 
                className="featured-card fade-in"
                onClick={() => setSelectedArticle(item)}
              >
                <div className="featured-card-image">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="featured-card-body">
                  <h3 className="featured-card-title">{item.title}</h3>
                  <p className="featured-card-excerpt">{item.excerpt}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Sidebar list */}
          <div className="sidebar-cards-wrap fade-in">
            <div className="sidebar-list">
              {developmentsData.sidebar.map((item) => (
                <div 
                  key={item.id} 
                  className="sidebar-item"
                  onClick={() => setSelectedArticle(item)}
                >
                  <div className="sidebar-item-thumb">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div className="sidebar-item-content">
                    <h4 className="sidebar-item-title">{item.title}</h4>
                  </div>
                </div>
              ))}
            </div>

            {/* Read More Button */}
            <div className="read-more-wrap">
              <button 
                className="btn-read-more"
                onClick={() => setIsAllModalOpen(true)}
              >
                Read More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="article-modal-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="article-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="article-modal-close" onClick={() => setSelectedArticle(null)}>
              <X size={20} />
            </button>
            <div className="article-modal-image">
              <img src={selectedArticle.image} alt={selectedArticle.title} />
            </div>
            <div className="article-modal-body">
              <div className="article-modal-meta">
                <span className="meta-badge"><Tag size={14} /> {selectedArticle.category}</span>
                <span className="meta-date"><Calendar size={14} /> {selectedArticle.date}</span>
              </div>
              <h2 className="article-modal-title">{selectedArticle.title}</h2>
              <div className="article-modal-text">
                {selectedArticle.fullContent.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Developments List Modal (Opened via Read More button) */}
      {isAllModalOpen && (
        <div className="article-modal-overlay" onClick={() => setIsAllModalOpen(false)}>
          <div className="article-modal-content all-updates-modal" onClick={(e) => e.stopPropagation()}>
            <button className="article-modal-close" onClick={() => setIsAllModalOpen(false)}>
              <X size={20} />
            </button>
            <div className="all-updates-header">
              <h3>All New Developments & Updates</h3>
              <p>Explore recent announcements, medical CMEs, and hospital events</p>
            </div>
            <div className="all-updates-list">
              {allArticles.map((article) => (
                <div 
                  key={article.id} 
                  className="all-updates-card"
                  onClick={() => {
                    setIsAllModalOpen(false);
                    setSelectedArticle(article);
                  }}
                >
                  <img src={article.image} alt={article.title} className="all-updates-thumb" />
                  <div className="all-updates-info">
                    <span className="all-updates-cat">{article.category} • {article.date}</span>
                    <h4>{article.title}</h4>
                    <p>{article.excerpt}</p>
                    <span className="all-updates-link">Read Full Update <ArrowRight size={14} /></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default NewDevelopments;
