/**
 * Default Spiritual Care State Data
 * Structured hierarchical data layer for Spiritual Care management
 */

export const defaultSpiritualCareState = {
  // 1. Spiritual Care Services
  services: {
    hero: {
      badge: 'Department of Spiritual Care',
      title: 'Spiritual Care Services',
      subtitle: 'Nurturing the soul while treating the body — blending state-of-the-art medical science with timeless spiritual values and compassionate bedside solace.'
    },
    overview: {
      title: 'Healing Through Spiritual Warmth & Compassion',
      content: '<p>At Bhaktivedanta Hospital & Research Institute, we believe that complete wellness transcends physical treatment alone. True healing encompasses physical vitality, mental calmness, and spiritual satisfaction. Our Spiritual Care Department serves as the heartbeat of our holistic philosophy, providing round-the-clock pastoral, psychological, and spiritual guidance to patients and their loved ones.</p><p>Our spiritual counselors respect and honor all faiths, spiritual traditions, and personal beliefs. Whether offering Vedic chants, silent meditation, scripture reading, or simply a listening heart during moments of distress, our team is dedicated to bringing peace and reassurance to every bedside.</p>',
      acronymTitle: 'Our Core Guiding Values (MATCH)',
      acronymSubtitle: 'The foundational pillars that steer our clinical culture, caregiver attitude, and holistic healing environment:',
      acronymItems: [
        {
          letter: 'M',
          word: 'Mercy',
          description: 'Compassionate, empathetic bedside care treating every patient with unconditional kindness.'
        },
        {
          letter: 'A',
          word: 'Austerity',
          description: 'Selfless service, dedication, and disciplined healthcare practices without compromise.'
        },
        {
          letter: 'T',
          word: 'Truthfulness',
          description: 'Highest clinical ethics, transparent communication, and genuine caregiver integrity.'
        },
        {
          letter: 'C',
          word: 'Cleanliness',
          description: 'Strict hygiene, spotless environmental sanitation, and spiritual sanctification of mind and heart.'
        },
        {
          letter: 'H',
          word: 'Holy Name',
          description: 'Uplifting universal prayers, devotional chanting, and positive spiritual vibrations for speedy recovery.'
        }
      ]
    },
    servicesOffered: {
      patientSupport: [
        { id: 'ps-1', text: 'Daily Bedside Rounds & Personalized Prayers', note: 'Conducted every morning and evening across all inpatient wards', enabled: true },
        { id: 'ps-2', text: 'Sanctified Offerings & Diet (Prasad)', note: 'Pure vegetarian, sattvic, and nutritionally balanced meals', enabled: true },
        { id: 'ps-3', text: 'Spiritual Audio Players in Inpatient Rooms', note: 'Soothing devotional melodies and calming instrumental meditation', enabled: true },
        { id: 'ps-4', text: 'Multi-Faith Prayer Sanctuary & Meditation Hall', note: 'Serene space open 24x7 for patients, doctors, and family members', enabled: true },
        { id: 'ps-5', text: 'Palliative Care & End-of-Life Spiritual Comfort', note: 'Holistic hospice solace and dignified spiritual accompaniment', enabled: true },
        { id: 'ps-6', text: 'Auspicious Festival Celebrations in Wards', note: 'Bringing joy and festive blessings to admitted patients', enabled: true }
      ],
      counselling: [
        { id: 'cs-1', text: 'Bedside Emotional & Spiritual Solace', note: 'Helping patients cope with medical diagnosis and chronic illnesses', enabled: true },
        { id: 'cs-2', text: 'Pre-Operative Anxiety & Fear Alleviation', note: 'Guided breathing, prayers, and calming reassurance before surgeries', enabled: true },
        { id: 'cs-3', text: 'Grief, Trauma & Bereavement Counseling', note: 'Empathetic post-loss support for bereaved families', enabled: true },
        { id: 'cs-4', text: 'Caregiver Support & Stress Relief Sessions', note: 'Preventing burnout for family members managing prolonged care', enabled: true },
        { id: 'cs-5', text: 'Mindfulness & Mantra Meditation Training', note: 'Scientific techniques for stress reduction and mental peace', enabled: true },
        { id: 'cs-6', text: 'Ethical & Moral Healthcare Guidance', note: 'Helping families navigate difficult medical and life decisions', enabled: true }
      ]
    },
    contact: {
      title: 'Spiritual Care Helpline & OPD Desk',
      phones: ['+91 22 2845 6000', '+91 22 6188 2200'],
      emergencyPhone: '+91 22 2845 8000',
      days: 'Monday – Sunday (24x7 Available)',
      timings: 'Bedside rounds: 8:00 AM – 8:00 PM | Emergency Chaplaincy: 24 Hours',
      location: 'Ground Floor, Spiritual Care Central Desk',
      email: 'spiritualcare@bhaktivedantahospital.com',
      note: 'Our pastoral team is on-call 24 hours a day for ICU and emergency support.'
    }
  },

  // 2. Educational Programmes
  programmes: [
    {
      id: 'garbha-samskar',
      title: 'Garbha Samskar',
      badge: 'Prenatal Care',
      duration: 'Weekly Batches',
      description: 'Holistic prenatal therapy and Vedic spiritual education for a healthy, conscious pregnancy and joyful motherhood.',
      image: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=800&q=80',
      destinationType: 'existing',
      existingRoute: '/services/garbha-samskar',
      existingServiceId: 'srv5',
      enabled: true
    },
    {
      id: 'antenatal-care',
      slug: 'antenatal-care',
      title: 'Antenatal Care',
      badge: 'Maternal Health',
      duration: '4-Week Modular Course',
      description: 'Comprehensive clinical and holistic antenatal education covering exercise, nutrition, labour preparation, and postpartum wellness.',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      destinationType: 'detail_page',
      enabled: true,
      detailPage: {
        title: 'Antenatal Care Programme',
        subtitle: 'Holistic clinical and psychological support ensuring safety, comfort, and joyful confidence for expectant mothers.',
        category: 'Educational Programmes',
        bannerImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
        blocks: [
          {
            id: 'b1',
            type: 'paragraph',
            title: 'About the Antenatal Care Programme',
            content: '<p>Our Antenatal Care programme bridges comprehensive obstetric vigilance with Ayurvedic nourishment, gentle prenatal exercise, and mindfulness practices. Guided by senior obstetricians, physiotherapists, and spiritual counsellors, mothers receive end-to-end guidance from early pregnancy through labor and newborn transition.</p>'
          },
          {
            id: 'b2',
            type: 'topic-card-grid',
            title: 'Core Antenatal Modules & Topics',
            subtitle: 'Structured workshops tailored to guide mothers and fathers through each stage of pregnancy:',
            columns: 2,
            cards: [
              {
                id: 'top-1',
                title: 'Pregnancy & Antenatal Exercise',
                subtitle: 'Trimester-specific physical wellness',
                icon: 'fitness_center',
                headerColor: 'linear-gradient(135deg, #132A4C 0%, #1E3A8A 100%)',
                bulletPoints: [
                  'Trimester-wise gentle yoga asanas & pelvic opening stretches',
                  'Pranayama breathing techniques for enhanced oxygenation',
                  'Back pain, sciatica & posture correction therapy',
                  'Safe cardiovascular conditioning under physiotherapist supervision'
                ]
              },
              {
                id: 'top-2',
                title: 'Labour & Breastfeeding',
                subtitle: 'Preparation for childbirth & lactation',
                icon: 'child_care',
                headerColor: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
                bulletPoints: [
                  'Stages of natural labour & coping mechanisms',
                  'Non-pharmacological pain relief & massage techniques',
                  'Colostrum importance & early latching techniques',
                  'Postpartum lactation support & newborn hunger cues'
                ]
              },
              {
                id: 'top-3',
                title: 'High Risk Pregnancy',
                subtitle: 'Specialized clinical vigilance',
                icon: 'health_and_safety',
                headerColor: 'linear-gradient(135deg, #0F766E 0%, #0D9488 100%)',
                bulletPoints: [
                  'Gestational diabetes & hypertension monitoring protocols',
                  'Fetal wellbeing Doppler tracking and growth scans',
                  'Multi-disciplinary team consultations (Endocrinology, Cardiology)',
                  'Dietary modulation and customized medical nutrition therapy'
                ]
              },
              {
                id: 'top-4',
                title: 'Art of Happy Motherhood',
                subtitle: 'Emotional & spiritual harmony',
                icon: 'favorite',
                headerColor: 'linear-gradient(135deg, #C2410C 0%, #E8792B 100%)',
                bulletPoints: [
                  'Mantra meditation and classical music therapy for fetal brain development',
                  'Overcoming prenatal mood swings, anxiety & fear of labor',
                  'Husband & family alignment for supportive home environment',
                  'Vedic positive thought projection and bonding with the unborn child'
                ]
              }
            ]
          },
          {
            id: 'b3',
            type: 'bullet-list',
            title: 'Key Programme Highlights',
            subtitle: 'What every enrolled couple receives:',
            columns: 2,
            items: [
              { text: 'Interactive physical & online hybrid weekend sessions', note: 'Flexible timing for working parents' },
              { text: 'Personalized diet charts prepared by clinical nutritionists', note: 'Nutrient-rich sattvic guidance' },
              { text: 'Continuous WhatsApp support group with senior doctors', note: 'Immediate doubt resolution' },
              { text: 'Complimentary antenatal kit with exercise guides & audio recordings', note: 'Handed at orientation' }
            ]
          }
        ]
      }
    },
    {
      id: 'baal-sangopan',
      slug: 'baal-sangopan',
      title: 'Baal Sangopan',
      badge: 'Infant Nurturing',
      duration: 'Monthly Workshops',
      description: 'Traditional and pediatric guidance for infant nurturing, emotional development, and healthy milestone tracking.',
      image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80',
      destinationType: 'detail_page',
      enabled: true,
      detailPage: {
        title: 'Baal Sangopan Programme',
        subtitle: 'Nurturing infants and toddlers with traditional Indian childcare wisdom, pediatric healthcare, and positive emotional bonding.',
        category: 'Educational Programmes',
        bannerImage: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=80',
        blocks: [
          {
            id: 'b1',
            type: 'paragraph',
            title: 'Holistic Infant Care & Growth Milestones',
            content: '<p>The first 1000 days of a child’s life lay the foundation for lifelong cognitive, emotional, and physical health. The Baal Sangopan programme blends pediatric clinical knowledge with time-tested traditional nurturing practices to support new mothers and fathers.</p>'
          },
          {
            id: 'b2',
            type: 'bullet-list',
            title: 'Course Curriculum Modules',
            columns: 2,
            items: [
              { text: 'Newborn Care & Hygiene Protocols', note: 'Cord care, bathing techniques, and temperature regulation' },
              { text: 'Infant Ayurvedic Massage (Abhyanga)', note: 'Enhancing muscle tone, bone density, and peaceful sleep' },
              { text: 'Timely Weaning & Sattvic Nutrition', note: 'Introducing solid foods safely according to age' },
              { text: 'Pediatric Immunization & Developmental Milestones', note: 'Tracking motor skills, speech, and cognitive reflexes' },
              { text: 'Emotional Bonding & Soothing Techniques', note: 'Managing infant colic, teething discomfort, and sleep cycles' },
              { text: 'Vedic Samskaras for Early Childhood', note: 'Namakarana, Nishkramana, and Annaprashana ceremonies' }
            ]
          }
        ]
      }
    },
    {
      id: 'garbhadhan',
      slug: 'garbhadhan',
      title: 'Garbhadhan',
      badge: 'Pre-Conception',
      duration: '2-Day Intensive',
      description: 'Vedic science of pre-conception purification, emotional alignment, and conscious family planning for prospective parents.',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      destinationType: 'detail_page',
      enabled: true,
      detailPage: {
        title: 'Garbhadhan Samskar Programme',
        subtitle: 'The Vedic science of pre-conception purification, emotional harmony, and conscious family planning.',
        category: 'Educational Programmes',
        bannerImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        blocks: [
          {
            id: 'b1',
            type: 'paragraph',
            title: 'Conscious Conception for Future Generations',
            content: '<p>Garbhadhan is the sacred pre-conceptional Samskara described in Vedic tradition. It emphasizes comprehensive physical detoxification (Panchakarma), mental tranquility, and spiritual alignment of prospective parents to welcome an enlightened and healthy child.</p>'
          },
          {
            id: 'b2',
            type: 'bullet-list',
            title: 'Key Workshop Highlights',
            columns: 2,
            items: [
              { text: 'Pre-conceptional Medical Screening & Genetic Counseling', note: 'Evaluating metabolic and reproductive health' },
              { text: 'Ayurvedic Detoxification & Reproductive Rejuvenation', note: 'Herbal therapies and dietary balancing' },
              { text: 'Mindfulness & Psychological Cleansing for Couples', note: 'Resolving subconscious anxieties and marital stress' },
              { text: 'Auspicious Timing & Lifestyle Discipline', note: 'Creating an uplifting home atmosphere prior to conception' }
            ]
          }
        ]
      }
    },
    {
      id: 'bal-vikas',
      slug: 'bal-vikas',
      title: 'Bal Vikas',
      badge: 'Child Development',
      duration: 'Weekend Classes',
      description: 'Character building, moral value enrichment, yoga, and mindfulness programs for children aged 5 to 14 years.',
      image: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=800&q=80',
      destinationType: 'detail_page',
      enabled: true,
      detailPage: {
        title: 'Bal Vikas Value Education',
        subtitle: 'Character building, moral value enrichment, yoga, and mindfulness programs for children aged 5 to 14 years.',
        category: 'Educational Programmes',
        bannerImage: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=1200&q=80',
        blocks: [
          {
            id: 'b1',
            type: 'paragraph',
            title: 'Shaping Virtuous Leaders of Tomorrow',
            content: '<p>In today’s fast-paced digital world, children require strong moral foundations, emotional resilience, and noble character. Bal Vikas provides engaging, activity-based spiritual education through stories from the Ramayana, Mahabharata, and Panchatantra, coupled with yoga and creative arts.</p>'
          },
          {
            id: 'b2',
            type: 'bullet-list',
            title: 'Core Activities & Learning Pillars',
            columns: 2,
            items: [
              { text: 'Moral Value Stories & Drama Workshops', note: 'Cultivating honesty, respect for elders, and empathy' },
              { text: 'Kids Yoga, Asanas & Focus Building', note: 'Improving memory, concentration, and physical posture' },
              { text: 'Shloka Recitation & Vedic Chanting', note: 'Enhancing vocal clarity and linguistic faculties' },
              { text: 'Environmental Care & Service (Seva) Projects', note: 'Planting trees, caring for animals, and helping the community' }
            ]
          }
        ]
      }
    },
    {
      id: 'journey-of-self-discovery',
      slug: 'journey-of-self-discovery',
      title: 'Journey of Self Discovery Course',
      badge: 'Spiritual Philosophy',
      duration: '6-Session Series',
      description: 'Systematic modular seminar series exploring the timeless wisdom of Bhagavad-gita, mind control, and purposeful living.',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
      destinationType: 'detail_page',
      enabled: true,
      detailPage: {
        title: 'Journey of Self Discovery Course',
        subtitle: 'A systematic 6-session philosophical and practical seminar on mind control, happiness, purpose, and the timeless wisdom of Bhagavad-gita.',
        category: 'Educational Programmes',
        bannerImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
        blocks: [
          {
            id: 'b1',
            type: 'paragraph',
            title: 'Explore the Science of Consciousness & Peace',
            content: '<p>The Journey of Self Discovery (JSD) is an acclaimed foundational course tailored for professionals, students, and seekers who desire logical, scientific, and practical answers to life’s profound questions.</p>'
          },
          {
            id: 'b2',
            type: 'bullet-list',
            title: 'Course Syllabus & Seminar Modules',
            columns: 2,
            items: [
              { text: 'Session 1: Who Am I? — Beyond Body & Mind', note: 'Understanding identity, consciousness, and soul' },
              { text: 'Session 2: The Art of Mind Management', note: 'Overcoming stress, negative thoughts, and distractions' },
              { text: 'Session 3: Why Do Bad Things Happen to Good People?', note: 'Deciphering the Law of Karma & destiny' },
              { text: 'Session 4: Science and Spirituality', note: 'Intelligent design, cosmic order, and scientific synthesis' },
              { text: 'Session 5: Practical Yoga of Devotion (Bhakti)', note: 'Integrating spirituality into everyday modern life' },
              { text: 'Session 6: Living with Joy & Eternal Purpose', note: 'Developing emotional balance and spiritual resilience' }
            ]
          }
        ]
      }
    }
  ],

  // 3. Spiritual Retreats
  retreats: {
    hero: {
      badge: 'Holistic Rejuvenation & Pilgrimage',
      title: 'Spiritual Care Retreats',
      subtitle: 'Escape the hectic demands of modern living. Experience restorative residential retreats that unite evidence-based health guidance, sacred nature immersion, and blissful spiritual camaraderie.'
    },
    bimonthly: {
      title: 'Weekend Eco-Wellness & Spiritual Immersion',
      intro: 'Held every two months at tranquil retreat sanctuaries near Mumbai and Thane, our 2-day residential retreats are designed for patients, recovering individuals, families, and healthcare professionals seeking comprehensive physical and spiritual recharge.',
      activities: [
        {
          id: 'act-1',
          title: 'Health Talk',
          tag: 'Medical Wellness',
          caption: 'Senior hospital physicians share practical insights on lifestyle medicine, cardiovascular health, and Ayurvedic balance.',
          image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
          order: 1,
          enabled: true
        },
        {
          id: 'act-2',
          title: 'Arati & Kirtan',
          tag: 'Sacred Devotion',
          caption: 'Soul-stirring congregational lamp offerings and meditative musical chanting that elevate consciousness and inner peace.',
          image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
          order: 2,
          enabled: true
        },
        {
          id: 'act-3',
          title: 'Stress Management',
          tag: 'Mind & Serenity',
          caption: 'Guided mindfulness meditation, cognitive reframing, and deep diaphragmatic breathing for deep mental rejuvenation.',
          image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
          order: 3,
          enabled: true
        },
        {
          id: 'act-4',
          title: 'Nature Walk',
          tag: 'Eco-Therapy',
          caption: 'Meditative early morning trails through tranquil forests, organic orchards, and blooming herbal gardens.',
          image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80',
          order: 4,
          enabled: true
        },
        {
          id: 'act-5',
          title: 'Yoga & Pranayama',
          tag: 'Vitality',
          caption: 'Therapeutic asanas and energy-balancing breathwork led by certified yoga masters, suitable for all fitness levels.',
          image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
          order: 5,
          enabled: true
        },
        {
          id: 'act-6',
          title: 'Van-bhoja (Sattvic Picnic)',
          tag: 'Community Feast',
          caption: 'Delightful outdoor community dining featuring freshly harvested, nutrient-rich sattvic vegetarian delicacies.',
          image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
          order: 6,
          enabled: true
        },
        {
          id: 'act-7',
          title: 'Being with Cows (Go-Seva)',
          tag: 'Grounding & Healing',
          caption: 'Therapeutic cow brushing, feeding, and serene companionship with gentle indigenous cows at our eco-farm Goshala.',
          image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
          order: 7,
          enabled: true
        }
      ]
    },
    annual: {
      title: 'The Grand Annual Pilgrimage & Wellness Yatra',
      intro: '<p>Our flagship 4-day Annual Spiritual Retreat is a transformative spiritual journey held at iconic holy heritage destinations across India (such as Vrindavan, Govardhan, Mayapur, and Jagannath Puri).</p><p>Accompanied by dedicated hospital physicians, nurses, and world-renowned spiritual mentors, hundreds of families participate in uplifting keynote health discourses, holistic yoga sessions, sacred river bathing, devotional music concerts, and soul-enriching community bonding.</p>',
      highlights: [
        '24x7 Mobile Medical Care: Full ambulance and geriatric nursing escort accompanying the retreat group at all times.',
        'Keynote Discourses: Exclusive seminars on mental resilience, conscious leadership, and living a value-driven life.',
        'Gourmet Sattvic Dining: Hygienic, doctor-approved nutritious pure vegetarian cuisines prepared with love and devotion.',
        'Senior Citizen Friendly: Wheelchair assistance, special dietary accommodations, and gentle scheduling.'
      ]
    },
    contact: {
      title: 'Retreat Coordination & Bookings',
      phones: ['+91 22 2845 6000', '+91 98200 56789'],
      days: 'Monday – Saturday',
      timings: '9:00 AM – 6:00 PM',
      location: 'Spiritual Care Events Office, Ground Floor',
      email: 'retreats@bhaktivedantahospital.com',
      note: 'Registrations open 3 months in advance. Early bird slots are allocated on a first-come, first-served basis.'
    }
  },

  // 4. Publications
  publications: [
    {
      id: 'pub-1',
      title: 'Integrating Spiritual Care in Tertiary Hospital Settings: Clinical Outcomes and Inpatient Satisfaction',
      authors: ['Dr. Ajay Sankhe', 'Dr. Madhav Sanzgiri', 'Spiritual Care Clinical Faculty'],
      journal: 'Indian Journal of Palliative Care',
      year: '2024',
      volume: 'Vol. 30, Issue 2, pp. 145-152',
      doi: '10.4103/ijpc.ijpc_224_23',
      url: 'https://doi.org',
      thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=400&q=80',
      abstract: 'A 5-year retrospective observational study evaluating the measurable impact of protocolized bedside pastoral counseling, devotional music therapy, and universal prayers on postoperative recovery velocity, analgesic dependency, and psychological morale in surgical inpatients.',
      status: 'Published'
    },
    {
      id: 'pub-2',
      title: 'Impact of Structured Vedic Prenatal Education (Garbha Samskar) on Maternal Anxiety and Neonatal Health Indices',
      authors: ['Dr. Vaishali Patil', 'Dr. Suhas Joshi', 'Dr. R. K. Sharma'],
      journal: 'Journal of Maternal-Fetal & Neonatal Medicine',
      year: '2023',
      volume: 'Vol. 36, Issue 4, pp. 889-897',
      doi: '10.1080/14767058.2023.2189401',
      url: 'https://doi.org',
      thumbnail: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80',
      abstract: 'Prospective controlled trial demonstrating statistically significant reduction in maternal salivary cortisol levels, lower incidence of emergency cesarean interventions, and optimal APGAR scores among expectant mothers undergoing structured holistic Garbha Samskar modules.',
      status: 'Published'
    },
    {
      id: 'pub-3',
      title: 'Spiritual Distress Assessment and Multi-Faith Chaplaincy Interventions in Advanced Oncology Palliative Care',
      authors: ['Dr. B. N. Gangadhar', 'Dr. S. K. Kulkarni', 'Palliative Care Research Unit'],
      journal: 'Journal of Cancer Research and Therapeutics',
      year: '2023',
      volume: 'Vol. 19, Suppl 3, pp. 412-420',
      doi: '10.4103/jcrt.JCRT_890_21',
      url: 'https://doi.org',
      thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
      abstract: 'Investigating validated spiritual distress screening matrices and personalized non-denominational chaplaincy for terminal cancer patients, highlighting improvements in end-of-life quality, existential peace, and caregiver bereavement adjustment.',
      status: 'Published'
    },
    {
      id: 'pub-4',
      title: 'Neurobiological and Psychological Modulation of Healthcare Worker Burnout Through Daily Maha-Mantra Meditation',
      authors: ['Dr. Vivek Sharma', 'Dr. Priya Deshmukh', 'Neurophysiology Department'],
      journal: 'International Journal of Yoga & Healthcare Research',
      year: '2022',
      volume: 'Vol. 15, Issue 1, pp. 54-62',
      doi: '10.4103/ijoy.ijoy_45_23',
      url: 'https://doi.org',
      thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80',
      abstract: 'Randomized 12-week interventional trial measuring galvanic skin response, EEG alpha rhythm synchronization, and Maslach Burnout Inventory dimensions in ICU nursing personnel practicing daily guided transcendental sound meditation.',
      status: 'Published'
    },
    {
      id: 'pub-5',
      title: 'The Role of Hospital-Based Multi-Disciplinary Bioethics Committees in Resolving Critical Care Moral Dilemmas',
      authors: ['Dr. Kaushik Sen', 'Dr. Anita Deshpande', 'Hospital Ethics Board'],
      journal: 'Indian Journal of Medical Ethics',
      year: '2022',
      volume: 'Vol. 7, Issue 3, pp. 210-218',
      doi: '10.20529/IJME.2022.045',
      url: 'https://doi.org',
      thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=400&q=80',
      abstract: 'Case analysis and clinical framework synthesis on how incorporating spiritual caregivers alongside intensivists and legal advisers facilitates ethical consensus in withholding/withdrawing futile life support in critical care settings.',
      status: 'Published'
    }
  ]
};

// Data-driven sections array modeling the full dynamic Spiritual Care modular system
export const defaultSpiritualSections = [
  {
    id: 'spiritual-care-services',
    title: 'Spiritual Care Services',
    icon: 'spa',
    order: 1,
    enabled: true,
    layout: 'tabs',
    description: 'Overview, MATCH Acronym, Bullet Lists',
    hero: defaultSpiritualCareState.services.hero,
    tabs: [
      {
        id: 'overview',
        label: 'Overview',
        title: 'Overview',
        type: 'spiritual_services_overview',
        overview: defaultSpiritualCareState.services.overview
      },
      {
        id: 'services-offered',
        label: 'Services Offered',
        title: 'Services Offered',
        type: 'spiritual_services_offered',
        servicesOffered: defaultSpiritualCareState.services.servicesOffered
      }
    ],
    contact: defaultSpiritualCareState.services.contact
  },
  {
    id: 'educational-programmes',
    title: 'Educational Programmes',
    icon: 'school',
    order: 2,
    enabled: true,
    layout: 'card-grid',
    description: '6 Program Cards & Block Editor',
    hero: {
      badge: 'Value-Based Education & Holistic Health',
      title: 'Educational Programmes',
      subtitle: 'Empowering families, parents, and seekers with timeless wisdom, prenatal science, child psychology, and self-mastery courses conducted by experienced doctors and spiritual educators.'
    },
    cards: defaultSpiritualCareState.programmes,
    contact: {
      title: 'Educational Programmes Desk & Registration',
      phones: ['+91 22 2845 6000', '+91 98200 12345'],
      days: 'Monday – Saturday',
      timings: '9:30 AM – 5:30 PM',
      location: 'Education Wing, 3rd Floor, Bhaktivedanta Hospital',
      email: 'programmes@bhaktivedantahospital.com',
      note: 'Prior registration is recommended as batch sizes are limited to ensure personalized attention.'
    }
  },
  {
    id: 'spiritual-retreats',
    title: 'Spiritual Retreats',
    icon: 'nature_people',
    order: 3,
    enabled: true,
    layout: 'tabs',
    description: 'Bi-Monthly Activities & Annual Yatra',
    hero: defaultSpiritualCareState.retreats.hero,
    tabs: [
      {
        id: 'bimonthly',
        label: 'BI-Monthly Spiritual Retreat',
        title: 'BI-Monthly Spiritual Retreat',
        type: 'spiritual_retreats_bimonthly',
        bimonthly: defaultSpiritualCareState.retreats.bimonthly
      },
      {
        id: 'annual',
        label: 'Annual Spiritual Retreat',
        title: 'Annual Spiritual Retreat',
        type: 'spiritual_retreats_annual',
        annual: defaultSpiritualCareState.retreats.annual
      }
    ],
    contact: defaultSpiritualCareState.retreats.contact
  },
  {
    id: 'publications',
    title: 'Publications & Paper Presentations',
    icon: 'library_books',
    order: 4,
    enabled: true,
    layout: 'list',
    description: 'Research Papers & Presentations',
    hero: {
      badge: 'Academic & Clinical Research',
      title: 'Publications & Paper Presentations',
      subtitle: 'Demonstrating the therapeutic power of spiritual care through rigorous scientific research, randomized controlled trials, and peer-reviewed clinical literature.'
    },
    items: defaultSpiritualCareState.publications,
    contact: {
      title: 'Department of Medical Research & Ethics Committee',
      phones: ['+91 22 2845 6000', '+91 22 6188 2200'],
      days: 'Monday – Friday',
      timings: '9:00 AM – 5:00 PM',
      location: 'Research Wing, 4th Floor, Bhaktivedanta Hospital',
      email: 'research@bhaktivedantahospital.com',
      note: 'Researchers and clinicians interested in collaborating on spiritual care and palliative outcome studies are invited to contact the ethics board.'
    }
  }
];

// Attach sections to defaultSpiritualCareState
defaultSpiritualCareState.sections = defaultSpiritualSections;

/**
 * Normalizer & Validator for Spiritual Care State
 * Ensures state.sections exists and is kept in sync with legacy keys
 */
export function ensureStandardSpiritualSections(state) {
  if (!state || typeof state !== 'object') {
    return { ...defaultSpiritualCareState };
  }

  if (!Array.isArray(state.sections) || state.sections.length === 0) {
    state.sections = JSON.parse(JSON.stringify(defaultSpiritualSections));
  } else {
    // Ensure all 4 foundational sections exist if omitted
    const existingIds = new Set(state.sections.map(s => s.id));
    defaultSpiritualSections.forEach(defSec => {
      if (!existingIds.has(defSec.id)) {
        state.sections.push(JSON.parse(JSON.stringify(defSec)));
      }
    });
  }

  // Ensure sections are sorted by order
  state.sections.sort((a, b) => (a.order || 0) - (b.order || 0));

  // Sync legacy keys with sections
  const secServices = state.sections.find(s => s.id === 'spiritual-care-services');
  if (secServices && state.services) {
    secServices.overview = state.services.overview || secServices.overview;
    secServices.servicesOffered = state.services.servicesOffered || secServices.servicesOffered;
    secServices.contact = state.services.contact || secServices.contact;
  }

  const secProgs = state.sections.find(s => s.id === 'educational-programmes');
  if (secProgs && Array.isArray(state.programmes)) {
    secProgs.cards = state.programmes;
  }

  const secRetreats = state.sections.find(s => s.id === 'spiritual-retreats');
  if (secRetreats && state.retreats) {
    secRetreats.bimonthly = state.retreats.bimonthly || secRetreats.bimonthly;
    secRetreats.annual = state.retreats.annual || secRetreats.annual;
    secRetreats.contact = state.retreats.contact || secRetreats.contact;
  }

  const secPubs = state.sections.find(s => s.id === 'publications');
  if (secPubs && Array.isArray(state.publications)) {
    secPubs.items = state.publications;
  }

  return state;
}
