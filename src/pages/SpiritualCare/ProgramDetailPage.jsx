import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FlexibleDetailPage from '../../components/FlexibleDetailPage/FlexibleDetailPage';
import { getSpiritualCareState } from '../../utils/api';
import { defaultSpiritualCareState } from '../../data/defaultSpiritualCare';

export default function ProgramDetailPage() {
  const { slug, id } = useParams();
  const routeParam = slug || id;
  const navigate = useNavigate();
  const [programmes, setProgrammes] = useState(defaultSpiritualCareState.programmes);

  const fetchState = () => {
    getSpiritualCareState(defaultSpiritualCareState).then(res => {
      if (res && res.programmes) {
        setProgrammes(res.programmes);
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

  const prog = programmes.find(p => p.slug === routeParam || p.id === routeParam) ||
    defaultSpiritualCareState.programmes.find(p => p.slug === routeParam || p.id === routeParam);

  const detailPage = prog?.detailPage || {
    title: prog?.title || 'Educational Programme',
    subtitle: prog?.description || 'Value-based educational and spiritual health initiative.',
    category: 'Educational Programmes',
    bannerImage: prog?.image,
    blocks: [
      {
        type: 'paragraph',
        title: 'Programme Information',
        content: `<p>${prog?.description || 'Detailed curriculum and schedules for this programme will be updated soon.'}</p>`
      }
    ]
  };

  const breadcrumbs = [
    { label: 'Spiritual Care', to: '/spiritual-care/spiritual-care-services' },
    { label: 'Educational Programmes', to: '/spiritual-care/educational-programmes' },
    { label: prog?.title || slug }
  ];

  return (
    <FlexibleDetailPage
      title={detailPage.title || prog?.title}
      subtitle={detailPage.subtitle || prog?.description}
      category={detailPage.category || 'Educational Programmes'}
      bannerImage={detailPage.bannerImage || prog?.image}
      breadcrumbs={breadcrumbs}
      blocks={detailPage.blocks || []}
      onBack={() => navigate('/spiritual-care/educational-programmes')}
    />
  );
}
