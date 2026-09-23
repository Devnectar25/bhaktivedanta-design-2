import React, { useState, useEffect } from 'react';
import { Share2, X, ChevronRight, User } from 'lucide-react';
import { getAboutUsState } from '../../utils/api';
import { defaultAboutUsData } from '../../data/aboutUsData';
import './OurManagementTeamPage.css';

const OurManagementTeamPage = () => {
  const [team, setTeam] = useState(defaultAboutUsData.managementTeam || []);
  const [selectedMember, setSelectedMember] = useState(null);
  const [shareFeedback, setShareFeedback] = useState(false);

  useEffect(() => {
    loadData();
    const handleSync = () => loadData();
    window.addEventListener('storage', handleSync);
    window.addEventListener('admin_data_updated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('admin_data_updated', handleSync);
    };
  }, []);

  const loadData = async () => {
    try {
      const state = await getAboutUsState(defaultAboutUsData);
      const list = state?.managementTeam || defaultAboutUsData.managementTeam;
      if (Array.isArray(list) && list.length > 0) {
        setTeam(list);
      }
    } catch (err) {
      console.warn('Could not load management team data:', err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Our Management Team | Bhaktivedanta Hospital & Research Institute',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2500);
    }
  };

  return (
    <div className="management-page-wrapper">
      {shareFeedback && <div className="management-share-toast">Page link copied to clipboard!</div>}

      {/* Main Container */}
      <div className="management-container">
        {/* Header Bar */}
        <div className="management-header-row">
          <h1 className="management-page-title">Our Management Team</h1>
          <button 
            onClick={handleShare} 
            className="management-share-btn" 
            title="Share this page"
            aria-label="Share page"
          >
            <Share2 size={18} />
          </button>
        </div>

        {/* Team Grid */}
        <div className="management-grid">
          {team.map((member, idx) => (
            <div 
              key={member.id || idx}
              onClick={() => setSelectedMember(member)}
              className="management-card group"
            >
              {/* Arched Leaf Photo Frame */}
              <div className="management-photo-frame">
                <div className="management-photo-leaf">
                  {member.photoUrl ? (
                    <img 
                      src={member.photoUrl} 
                      alt={member.name} 
                      className="management-img"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="management-placeholder-avatar" style={{ display: member.photoUrl ? 'none' : 'flex' }}>
                    <User size={48} className="text-amber-600" />
                  </div>
                </div>
              </div>

              {/* Text Info */}
              <div className="management-card-info">
                <h3 className="management-member-name">{member.name}</h3>
                <p className="management-member-designation">{member.designation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bio Modal Popup */}
      {selectedMember && (
        <div 
          className="management-modal-overlay animate-fade-in"
          onClick={() => setSelectedMember(null)}
        >
          <div 
            className="management-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="management-modal-close"
              onClick={() => setSelectedMember(null)}
              aria-label="Close bio"
            >
              <X size={20} />
            </button>

            <div className="management-modal-body">
              {/* Left Photo */}
              <div className="management-modal-photo-col">
                <div className="management-modal-leaf">
                  {selectedMember.photoUrl ? (
                    <img 
                      src={selectedMember.photoUrl} 
                      alt={selectedMember.name} 
                      className="management-modal-img"
                    />
                  ) : (
                    <div className="management-placeholder-avatar">
                      <User size={64} className="text-amber-600" />
                    </div>
                  )}
                </div>
              </div>

              {/* Right Bio */}
              <div className="management-modal-content-col">
                <h2 className="management-modal-title">{selectedMember.name}</h2>
                <div className="management-modal-badge">- {selectedMember.designation}</div>
                <div className="management-modal-separator"></div>
                <div className="management-modal-bio">
                  {selectedMember.bio ? (
                    <p>{selectedMember.bio}</p>
                  ) : (
                    <p className="text-slate-400 italic">No biography available for this team member.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OurManagementTeamPage;
