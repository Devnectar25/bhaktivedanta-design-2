import React, { useState, useEffect } from 'react';
import PublicationCard from '../../components/PublicationCard/PublicationCard';
import ContactInfoBlock from '../../components/ContactInfoBlock/ContactInfoBlock';
import { getSpiritualCareState } from '../../utils/api';
import { defaultSpiritualCareState } from '../../data/defaultSpiritualCare';
import { BookOpen, Search } from 'lucide-react';
import './SpiritualCare.css';

export default function PublicationsPapers() {
  const [publications, setPublications] = useState(defaultSpiritualCareState.publications);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchState = () => {
    getSpiritualCareState(defaultSpiritualCareState).then(res => {
      if (res && res.publications) {
        setPublications(res.publications);
      }
    });
  };

  useEffect(() => {
    fetchState();
    window.addEventListener('storage', fetchState);
    window.addEventListener('admin_data_updated', fetchState);
    return () => {
      window.removeEventListener('storage', fetchState);
      window.removeEventListener('admin_data_updated', fetchState);
    };
  }, []);

  const filteredPubs = publications.filter(p =>
    (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (Array.isArray(p.authors) ? p.authors.join(' ') : p.authors || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.journal || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="spiritual-page-container">
      {/* Hero Header */}
      <div className="spiritual-hero-banner">
        <div className="spiritual-hero-badge">
          <BookOpen size={16} />
          <span>Academic & Clinical Research</span>
        </div>
        <h1 className="spiritual-hero-title">Publications & Paper Presentations</h1>
        <p className="spiritual-hero-subtitle">
          Demonstrating the therapeutic power of spiritual care through rigorous scientific research, randomized controlled trials, and peer-reviewed clinical literature.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 28, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search publications by title, author, or journal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 42px',
              borderRadius: 12,
              border: '1px solid #E2E8F0',
              fontFamily: "'Work Sans', sans-serif",
              fontSize: '0.95rem',
              outline: 'none',
              background: '#FFFFFF',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}
          />
        </div>
      </div>

      {/* Vertical Publications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {filteredPubs.length > 0 ? (
          filteredPubs.map((pub) => (
            <PublicationCard
              key={pub.id}
              thumbnail={pub.thumbnail}
              title={pub.title}
              url={pub.url}
              authors={pub.authors}
              journal={pub.journal}
              year={pub.year}
              volume={pub.volume}
              doi={pub.doi}
              abstract={pub.abstract}
            />
          ))
        ) : (
          <div style={{ padding: '36px', textAlign: 'center', background: '#FFFFFF', borderRadius: 14, border: '1px solid #E2E8F0' }}>
            <p style={{ color: '#64748B', fontFamily: "'Work Sans', sans-serif" }}>No publications found matching your search.</p>
          </div>
        )}
      </div>

      {/* Research Department Contact */}
      <div style={{ marginTop: 44 }}>
        <ContactInfoBlock
          title="Medical Research & Academic Collaboration Desk"
          phones={['+91 22 2845 6000', '+91 22 6188 2345']}
          days="Monday – Friday"
          timings="9:00 AM – 5:00 PM"
          location="Bhaktivedanta Medical Research Center, 4th Floor"
          email="research@bhaktivedantahospital.com"
          note="Institutions and researchers interested in collaborating on integrative medicine or spiritual care clinical studies are invited to contact our research secretariat."
          variant="card"
        />
      </div>
    </div>
  );
}
