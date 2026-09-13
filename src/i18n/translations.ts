export interface TranslationStructure {
  brand: {
    name: string;
    subtitle: string;
    companyName: string;
  };
  nav: {
    home: string;
    services: string;
    projects: string;
    transformations: string;
    houses: string;
    process: string;
    craftsmanship: string;
    about: string;
    contact: string;
    bookConsultation: string;
    admin: string;
  };
  hero: {
    badge: string;
    headline: string;
    subheadline: string;
    exploreProjects: string;
    startProject: string;
    scrollDown: string;
  };
  philosophy: {
    pretitle: string;
    title: string;
    quote: string;
    p1: string;
    p2: string;
    projectsCount: string;
    projectsLabel: string;
    yearsCount: string;
    yearsLabel: string;
    qualityCount: string;
    qualityLabel: string;
  };
  services: {
    title: string;
    subtitle: string;
    requestQuote: string;
    includedScope: string;
  };
  transformations: {
    title: string;
    subtitle: string;
    dragHint: string;
    before: string;
    after: string;
    originalSpace: string;
    completedRenovation: string;
  };
  projects: {
    title: string;
    subtitle: string;
    allCategory: string;
    viewDetails: string;
    filterBy: string;
    scopeLabel: string;
    locationLabel: string;
    yearLabel: string;
    materialsLabel: string;
    servicesLabel: string;
    overviewTab: string;
    visionTab: string;
    transformationTab: string;
    materialsTab: string;
    galleryTab: string;
    closeModal: string;
  };
  process: {
    title: string;
    subtitle: string;
  };
  craftsmanship: {
    title: string;
    subtitle: string;
  };
  whyUs: {
    title: string;
    subtitle: string;
  };
  instagram: {
    title: string;
    subtitle: string;
    followAt: string;
  };
  testimonials: {
    title: string;
    subtitle: string;
    verifiedClient: string;
  };
  about: {
    title: string;
    subtitle: string;
    founderTitle: string;
    statsProjects: string;
    statsYears: string;
    statsSatisfaction: string;
  };
  contact: {
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    emailLabel: string;
    projectTypeLabel: string;
    selectTypePlaceholder: string;
    locationLabel: string;
    spaceSizeLabel: string;
    budgetLabel: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitBtn: string;
    submitting: string;
    successTitle: string;
    successMsg: string;
    directContact: string;
    atelierAddress: string;
    businessHours: string;
    businessHoursValue: string;
  };
  booking: {
    modalTitle: string;
    modalSubtitle: string;
    selectType: string;
    typeOnSite: string;
    typeOnSiteDesc: string;
    typeInStudio: string;
    typeInStudioDesc: string;
    typeVirtual: string;
    typeVirtualDesc: string;
    preferredDate: string;
    preferredTime: string;
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    projectScope: string;
    scopePlaceholder: string;
    confirmBooking: string;
    bookingSuccessTitle: string;
    bookingSuccessMsg: string;
    close: string;
  };
  theme: {
    mode: string;
    light: string;
    dark: string;
    togglePrompt: string;
  };
  footer: {
    tagline: string;
    quickLinks: string;
    disciplines: string;
    atelierContact: string;
    rightsReserved: string;
    adminStudio: string;
  };
  common: {
    learnMore: string;
    backToTop: string;
    loading: string;
    error: string;
  };
}

export const TRANSLATIONS: Record<'fr' | 'en' | 'ar', TranslationStructure> = {
  fr: {
    brand: {
      name: 'BESSAM.DECO',
      subtitle: 'Rénovation & Architecture',
      companyName: 'BESSAM DECORATEUR',
    },
    nav: {
      home: 'Accueil',
      services: 'Disciplines',
      projects: 'Réalisations',
      transformations: 'Avant / Après',
      houses: 'Maisons Clé en Main',
      process: 'Méthode',
      craftsmanship: 'Savoir-Faire',
      about: "L'Atelier",
      contact: 'Contact',
      bookConsultation: 'Réserver une Consultation',
      admin: 'Espace Admin',
    },
    hero: {
      badge: "Atelier d'Architecture d'Intérieur & Rénovation Prestige",
      headline: 'Transformez Votre Espace En Une Œuvre Extraordinaire',
      subheadline:
        'Des rénovations d’exception alliant vision architecturale audacieuse, matériaux nobles et savoir-faire artisanal de haute précision en Algérie.',
      exploreProjects: 'Découvrir nos Réalisations',
      startProject: 'Initier Votre Projet',
      scrollDown: 'Défiler pour contempler',
    },
    philosophy: {
      pretitle: 'Philosophie & Vision',
      title: 'L’Art de Sculpter l’Espace & la Matière',
      quote:
        '« Nous ne rénovons pas simplement des espaces. Nous redéfinissons leur façon de vivre, de respirer et d’émouvoir. »',
      p1:
        'Chaque projet chez BESSAM.DECO commence par une écoute attentive et une analyse spatiale rigoureuse. Nous éliminons le superflu pour révéler la beauté des proportions, la lumière zénithale et la noblesse des matières brutes.',
      p2:
        'De Batna à Alger, notre atelier rassemble architectes d’intérieur, artisans marbriers, maîtres ébénistes et ingénieurs dédiés à une discrétion absolue et une précision au millimètre près.',
      projectsCount: '150+',
      projectsLabel: 'Projets Remarquables',
      yearsCount: '12+',
      yearsLabel: 'Années d’Excellence',
      qualityCount: '100%',
      qualityLabel: 'Réalisation Sur-Mesure',
    },
    services: {
      title: 'Nos Domaines d’Intervention',
      subtitle:
        'Une maîtrise intégrale de la conception architecturale, du gros œuvre raffiné aux finitions d’artisanat d’art.',
      requestQuote: 'Demander un devis sur-mesure',
      includedScope: 'Prestations incluses',
    },
    transformations: {
      title: 'Transformations Avant / Après',
      subtitle:
        'Faites glisser le curseur central pour apprécier la métamorphose de nos interventions architecturales.',
      dragHint: 'Glisser pour révéler la métamorphose',
      before: 'Avant',
      after: 'Après',
      originalSpace: 'État d’Origine',
      completedRenovation: 'Rénovation BESSAM.DECO',
    },
    projects: {
      title: 'Réalisations Emblématiques',
      subtitle:
        'Une sélection d’intérieurs résidentiels d’exception, villas contemporaines et espaces de prestige.',
      allCategory: 'Tous les Projets',
      viewDetails: 'Consulter l’Étude de Cas',
      filterBy: 'Filtrer par typologie',
      scopeLabel: 'Étendue des travaux',
      locationLabel: 'Localisation',
      yearLabel: 'Année de livraison',
      materialsLabel: 'Matériaux nobles',
      servicesLabel: 'Disciplines déployées',
      overviewTab: 'Vue d’Ensemble',
      visionTab: 'Vision & Contexte',
      transformationTab: 'Transformation Réalisée',
      materialsTab: 'Matériaux & Finitions',
      galleryTab: 'Galerie Haute Définition',
      closeModal: 'Fermer l’étude',
    },
    process: {
      title: 'Notre Méthode en 6 Étapes',
      subtitle:
        'Une rigueur absolue et un suivi exclusif de la première esquisse jusqu’à la remise des clés.',
    },
    craftsmanship: {
      title: 'Matériaux Nobles & Savoir-Faire',
      subtitle:
        'Travertin de carrière, chêne massif fumé, laiton patiné et plâtres à la chaux appliqués à la main.',
    },
    whyUs: {
      title: 'Pourquoi Choisir BESSAM.DECO',
      subtitle:
        'L’engagement d’un atelier indépendant dédié à la perfection, à l’élégance pérenne et à la tranquillité de nos clients.',
    },
    instagram: {
      title: 'Instantanés de l’Atelier',
      subtitle: 'Les coulisses de nos chantiers, nos détails de matière et inspirations au quotidien.',
      followAt: 'Suivre @bessam.deco',
    },
    testimonials: {
      title: 'Témoignages de nos Clients',
      subtitle:
        'La confiance renouvelée de propriétaires exigeants et d’amateurs d’architecture raffinée.',
      verifiedClient: 'Client vérifié',
    },
    about: {
      title: 'L’Atelier BESSAM.DECO',
      subtitle:
        'Fondé par une passion indéfectible pour l’harmonie des volumes, la pureté des lignes et l’artisanat de luxe.',
      founderTitle: 'Fondateur & Architecte Principal',
      statsProjects: 'Projets menés à bien',
      statsYears: 'Années de passion',
      statsSatisfaction: 'Satisfaction client',
    },
    contact: {
      title: 'Initiez Votre Projet',
      subtitle:
        'Partagez-nous vos ambitions architecturales. Notre atelier vous répondra sous 24 heures avec une analyse préliminaire.',
      nameLabel: 'Nom & Prénom',
      namePlaceholder: 'Ex: Karim Mansouri',
      phoneLabel: 'Numéro de Téléphone',
      emailLabel: 'Adresse Email',
      projectTypeLabel: 'Type de Projet',
      selectTypePlaceholder: 'Sélectionner le type de rénovation...',
      locationLabel: 'Ville / Localisation',
      spaceSizeLabel: 'Surface approximative (m²)',
      budgetLabel: 'Enveloppe budgétaire estimée',
      messageLabel: 'Détails du projet & vision',
      messagePlaceholder:
        'Décrivez votre espace, vos exigences en matière de matériaux, vos délais souhaités...',
      submitBtn: 'Transmettre la Demande',
      submitting: 'Transmission en cours...',
      successTitle: 'Demande transmise avec succès',
      successMsg:
        'Merci pour votre confiance. Notre architecte principal étudie vos données et prendra contact avec vous rapidement.',
      directContact: 'Liaison Directe',
      atelierAddress: 'Adresse de l’Atelier',
      businessHours: 'Horaires d’Ouverture',
      businessHoursValue: 'Samedi – Jeudi : 09h00 – 18h30',
    },
    booking: {
      modalTitle: 'Réserver une Consultation Dédiée',
      modalSubtitle:
        'Une séance privée de 90 minutes pour analyser vos plans, évaluer les contraintes structurelles et définir l’orientation design.',
      selectType: 'Format de la Consultation',
      typeOnSite: 'Visite & Relevé sur Site',
      typeOnSiteDesc: 'Relevé dimensionnel et analyse technique directe dans votre espace.',
      typeInStudio: 'Rendez-vous à l’Atelier',
      typeInStudioDesc: 'Présentation d’échantillons de matériaux et étude sur plans.',
      typeVirtual: 'Consultation Virtuelle',
      typeVirtualDesc: 'Échange interactif en visioconférence avec partage d’écran.',
      preferredDate: 'Date souhaitée',
      preferredTime: 'Créneau horaire',
      clientName: 'Nom complet',
      clientPhone: 'Téléphone',
      clientEmail: 'Email',
      projectScope: 'Portée approximative du projet',
      scopePlaceholder: 'Ex: Rénovation villa 350m², cuisine ouverte en marbre et suite parentale...',
      confirmBooking: 'Confirmer la Séance',
      bookingSuccessTitle: 'Consultation Enregistrée',
      bookingSuccessMsg:
        'Votre créneau a été réservé avec succès. Notre atelier vous contactera pour valider les derniers détails logistiques.',
      close: 'Fermer',
    },
    theme: {
      mode: 'Thème Visuel',
      light: 'Mode Galerie Clair',
      dark: 'Mode Nocturne Prestige',
      togglePrompt: 'Basculer le thème',
    },
    footer: {
      tagline: 'Transform Your Space Into Something Extraordinary.',
      quickLinks: 'Navigation',
      disciplines: 'Disciplines',
      atelierContact: 'Atelier & Contact',
      rightsReserved: 'Tous droits réservés. Architecture & Rénovation Haut de Gamme.',
      adminStudio: 'Accès Espace Administrateur',
    },
    common: {
      learnMore: 'En savoir plus',
      backToTop: 'Retour en haut',
      loading: 'Chargement en cours...',
      error: 'Une erreur est survenue',
    },
  },

  en: {
    brand: {
      name: 'BESSAM.DECO',
      subtitle: 'Renovation & Architecture',
      companyName: 'BESSAM DECORATEUR',
    },
    nav: {
      home: 'Home',
      services: 'Disciplines',
      projects: 'Projects',
      transformations: 'Before & After',
      houses: 'Turnkey Residences',
      process: 'Methodology',
      craftsmanship: 'Craftsmanship',
      about: 'The Studio',
      contact: 'Contact',
      bookConsultation: 'Book Consultation',
      admin: 'Admin Studio',
    },
    hero: {
      badge: 'High-End Architectural & Renovation Atelier',
      headline: 'Transform Your Space Into Something Extraordinary',
      subheadline:
        'Exceptional renovation services that bring your architectural vision to life with expert craftsmanship, refined materials, and obsessive attention to detail in Algeria.',
      exploreProjects: 'Explore Selected Works',
      startProject: 'Start Your Project',
      scrollDown: 'Scroll to explore',
    },
    philosophy: {
      pretitle: 'Philosophy & Vision',
      title: 'The Art of Sculpting Space & Substance',
      quote:
        '“We do not simply renovate spaces. We redefine the way they feel, function, and live.”',
      p1:
        'Every project at BESSAM.DECO begins with attentive listening and rigorous volumetric analysis. We strip away the unnecessary, allowing natural light, noble proportions, and raw textures to establish serene harmony.',
      p2:
        'From Batna to Algiers, our atelier brings together licensed architects, stonemasons, master joiners, and MEP engineers devoted to understated discretion and millimeter-exact execution.',
      projectsCount: '150+',
      projectsLabel: 'Curated Commissions',
      yearsCount: '12+',
      yearsLabel: 'Years of Mastery',
      qualityCount: '100%',
      qualityLabel: 'Bespoke Delivery',
    },
    services: {
      title: 'Architectural Disciplines',
      subtitle:
        'End-to-end architectural mastery, from structural civil alterations to bespoke artisanal finishing works.',
      requestQuote: 'Request a bespoke proposal',
      includedScope: 'Included deliverables',
    },
    transformations: {
      title: 'Before & After Transformations',
      subtitle:
        'Drag the center slider to witness the metamorphosis between the original space and the finished architectural environment.',
      dragHint: 'Drag to reveal the transformation',
      before: 'Before',
      after: 'After',
      originalSpace: 'Original Space',
      completedRenovation: 'BESSAM.DECO Completion',
    },
    projects: {
      title: 'Selected Works',
      subtitle:
        'A curated monograph of private residential sanctuaries, contemporary villas, and luxury commercial spaces.',
      allCategory: 'All Projects',
      viewDetails: 'View Detailed Case Study',
      filterBy: 'Filter by typology',
      scopeLabel: 'Scope of work',
      locationLabel: 'Location',
      yearLabel: 'Completion year',
      materialsLabel: 'Noble materials',
      servicesLabel: 'Disciplines involved',
      overviewTab: 'Overview',
      visionTab: 'Vision & Context',
      transformationTab: 'Executed Metamorphosis',
      materialsTab: 'Materials & Finishes',
      galleryTab: 'High-Resolution Gallery',
      closeModal: 'Close Case Study',
    },
    process: {
      title: 'The 6-Step Methodology',
      subtitle:
        'Uncompromising rigor and dedicated supervision from the primary spatial sketch to the turnkey handover.',
    },
    craftsmanship: {
      title: 'Noble Materials & Craftsmanship',
      subtitle:
        'Hand-selected quarry travertine, smoked European oak, patinated brass profiles, and artisanal lime plasters.',
    },
    whyUs: {
      title: 'Why Choose BESSAM.DECO',
      subtitle:
        'The commitment of an independent architectural studio obsessed with refinement, enduring longevity, and client peace of mind.',
    },
    instagram: {
      title: 'Atelier Instagram',
      subtitle: 'Behind the scenes of our active transformations, material studies, and daily inspirations.',
      followAt: 'Follow @bessam.deco',
    },
    testimonials: {
      title: 'Client Testimonials',
      subtitle:
        'The enduring trust of discerning homeowners and patrons of architectural distinction.',
      verifiedClient: 'Verified Client',
    },
    about: {
      title: 'About The Studio',
      subtitle:
        'Founded on an unwavering passion for spatial balance, minimalist elegance, and noble tactile craftsmanship.',
      founderTitle: 'Founder & Principal Architect',
      statsProjects: 'Completed projects',
      statsYears: 'Years in practice',
      statsSatisfaction: 'Client satisfaction',
    },
    contact: {
      title: 'Initiate Your Project',
      subtitle:
        'Share your spatial vision. Our atelier will review your details and respond within 24 hours with preliminary guidance.',
      nameLabel: 'Full Name',
      namePlaceholder: 'e.g., Karim Mansouri',
      phoneLabel: 'Phone Number',
      emailLabel: 'Email Address',
      projectTypeLabel: 'Project Type',
      selectTypePlaceholder: 'Select transformation type...',
      locationLabel: 'City / Location',
      spaceSizeLabel: 'Approximate Surface (m²)',
      budgetLabel: 'Estimated Budget Allocation',
      messageLabel: 'Project Vision & Requirements',
      messagePlaceholder:
        'Describe your space, timeline expectations, material inclinations, and functional priorities...',
      submitBtn: 'Transmit Inquiry',
      submitting: 'Transmitting...',
      successTitle: 'Inquiry Successfully Received',
      successMsg:
        'Thank you for your trust. Our principal architect is reviewing your submission and will get in touch with you shortly.',
      directContact: 'Direct Inquiries',
      atelierAddress: 'Atelier Address',
      businessHours: 'Consultation Hours',
      businessHoursValue: 'Saturday – Thursday: 09:00 – 18:30',
    },
    booking: {
      modalTitle: 'Book an Architectural Consultation',
      modalSubtitle:
        'A dedicated 90-minute private session to analyze drawings, evaluate structural conditions, and define aesthetic direction.',
      selectType: 'Consultation Format',
      typeOnSite: 'On-Site Survey & Inspection',
      typeOnSiteDesc: 'Direct volumetric survey and technical review at your property.',
      typeInStudio: 'In-Studio Meeting',
      typeInStudioDesc: 'Material sample review and spatial layout planning at our atelier.',
      typeVirtual: 'Virtual 3D Consultation',
      typeVirtualDesc: 'Interactive video session with real-time digital screen sharing.',
      preferredDate: 'Preferred Date',
      preferredTime: 'Time Slot',
      clientName: 'Full Name',
      clientPhone: 'Phone Number',
      clientEmail: 'Email Address',
      projectScope: 'Project Scope Overview',
      scopePlaceholder: 'e.g., 350m² villa total overhaul, marble kitchen island, master suite...',
      confirmBooking: 'Confirm Appointment',
      bookingSuccessTitle: 'Appointment Scheduled',
      bookingSuccessMsg:
        'Your consultation request has been confirmed. Our atelier coordinator will follow up to finalize logistics.',
      close: 'Close',
    },
    theme: {
      mode: 'Visual Theme',
      light: 'Light Gallery Mode',
      dark: 'Prestige Noir Mode',
      togglePrompt: 'Toggle visual theme',
    },
    footer: {
      tagline: 'Transform Your Space Into Something Extraordinary.',
      quickLinks: 'Navigation',
      disciplines: 'Disciplines',
      atelierContact: 'Atelier & Contact',
      rightsReserved: 'All rights reserved. Luxury Architecture & Renovation.',
      adminStudio: 'Studio Admin Portal',
    },
    common: {
      learnMore: 'Discover more',
      backToTop: 'Back to top',
      loading: 'Loading content...',
      error: 'An unexpected error occurred',
    },
  },

  ar: {
    brand: {
      name: 'بـسام ديكور',
      subtitle: 'تجديد وهندسة معمارية',
      companyName: 'بسام ديكوراتور',
    },
    nav: {
      home: 'الرئيسية',
      services: 'اختصاصاتنا',
      projects: 'المشاريع',
      transformations: 'قبل وبعد',
      houses: 'منازل جاهزة للبيع',
      process: 'منهجيتنا',
      craftsmanship: 'الحرفية والمواد',
      about: 'عن الأتيليه',
      contact: 'اتصل بنا',
      bookConsultation: 'حجز استشارة',
      admin: 'لوحة التحكم',
    },
    hero: {
      badge: 'استوديو الهندسة المعمارية الداخلية والتجديد الراقي',
      headline: 'حوّل مساحتك إلى تحفة فنية استثنائية',
      subheadline:
        'خدمات تجديد راقية تدمج بين الرؤية المعمارية المعاصرة، المواد النبيلة والحرفية الاستثنائية مع عناية فائقة بأدق التفاصيل في الجزائر.',
      exploreProjects: 'استكشف مشاريعنا',
      startProject: 'ابدأ مشروعك الآن',
      scrollDown: 'مرر للأسفل للاستكشاف',
    },
    philosophy: {
      pretitle: 'فلسفتنا ورؤيتنا',
      title: 'فن تشكيل الفراغ والارتقاء بالمادة',
      quote:
        '«نحن لا نكتفي بتجديد المساحات، بل نعيد صياغة الإحساس بها والعيش فيها بكل رقي وسكينة.»',
      p1:
        'يبدأ كل مشروع في بـسام ديكور بالاستماع المتأني والتحليل الهندسي الدقيق للأحجام والإضاءة. نزيل كل ما هو فائض لنبرز جمال النسب، الإضاءة الطبيعية ونقاء المواد الأصيلة.',
      p2:
        'من باتنة إلى الجزائر العاصمة، يجمع الأتيليه نخبة من المهندسين المعماريين، حرفيي الرخام، صناع النجارة الفاخرة وخبراء التنفيذ الملتزمين بالدقة المتناهية حتى المليمتر.',
      projectsCount: '150+',
      projectsLabel: 'مشروع استثنائي منجز',
      yearsCount: '12+',
      yearsLabel: 'سنوات من الريادة والخبرة',
      qualityCount: '100%',
      qualityLabel: 'تنفيذ مخصص بالكامل',
    },
    services: {
      title: 'مجالات اختصاصنا المعماري',
      subtitle:
        'إتقان كامل من التصميم الهندسي والأشغال الإنشائية الراقية إلى أدق التشطيبات الحرفية الفاخرة.',
      requestQuote: 'طلب عرض سعر مخصص',
      includedScope: 'الميزات والخدمات المتضمنة',
    },
    transformations: {
      title: 'التحولات الملموسة: قبل وبعد',
      subtitle:
        'اسحب المؤشر التفاعلي لمشاهدة التحول المعماري المبهر بين واقع المساحة الأصلي والنتيجة النهائية لتجديداتنا.',
      dragHint: 'اسحب للمقارنة بين الواقع السابق والتجديد',
      before: 'قبل',
      after: 'بعد',
      originalSpace: 'الحالة الأصلية',
      completedRenovation: 'إنجاز بـسام ديكور',
    },
    projects: {
      title: 'أبرز إنجازاتنا المعمارية',
      subtitle:
        'مختارات من الفيلات الخاصة الراقية، الشقق المتميزة والمساحات التجارية المعاصرة.',
      allCategory: 'جميع المشاريع',
      viewDetails: 'عرض دراسة المشروع',
      filterBy: 'تصفية حسب نوع المشروع',
      scopeLabel: 'نطاق الأعمال',
      locationLabel: 'الموقع',
      yearLabel: 'سنة الإنجاز',
      materialsLabel: 'المواد النبيلة المستخدمة',
      servicesLabel: 'الخدمات المطبقة',
      overviewTab: 'نظرة عامة',
      visionTab: 'الرؤية والسياق',
      transformationTab: 'التحول المنفذ',
      materialsTab: 'المواد والتشطيبات',
      galleryTab: 'معرض الصور عالي الدقة',
      closeModal: 'إغلاق نافذة المشروع',
    },
    process: {
      title: 'منهجيتنا في 6 مراحل متكاملة',
      subtitle:
        'انضباط مطلق وإشراف مباشر من المخطط الأولي وحتى تسليم المفاتيح في أبهى حلة.',
    },
    craftsmanship: {
      title: 'المواد النبيلة والحرفية الأصيلة',
      subtitle:
        'حجر الترافيرتين الطبيعي، خشب البلوط الأوروبي المدخن، النحاس الشامباني والملاط الجيري المصنوع يدوياً.',
    },
    whyUs: {
      title: 'لماذا تختار بـسام ديكور',
      subtitle:
        'التزام استوديو معماري مستقل يضع الأناقة الدائمة، الجودة غير القابلة للمساومة وراحة العميل في المقام الأول.',
    },
    instagram: {
      title: 'لقطات حصرية من الأتيليه',
      subtitle: 'كواليس مشاريعنا الجارية، تفاصيل المواد وإلهامنا المعماري اليومي.',
      followAt: 'تابعنا على @bessam.deco',
    },
    testimonials: {
      title: 'شهادات عملائنا المميزين',
      subtitle:
        'ثقة غالية من ملاك العقارات الراقية وأصحاب الذوق الرفيع في مختلف ربوع الوطن.',
      verifiedClient: 'عميل موثق',
    },
    about: {
      title: 'عن استوديو بـسام ديكور',
      subtitle:
        'تأسس بدافع شغف عميق بتناغم الفراغات المعمارية، نقاء الخطوط وجودة الحرفية الفاخرة.',
      founderTitle: 'المؤسس والمهندس المعماري الرئيسي',
      statsProjects: 'مشاريع ناجحة',
      statsYears: 'سنوات من الشغف',
      statsSatisfaction: 'رضا العملاء التام',
    },
    contact: {
      title: 'ابدأ مشروعك المعماري معنا',
      subtitle:
        'شاركنا طموحك وتفاصيل مساحتك. سيقوم فريقنا بدراسة طلبكم والرد خلال 24 ساعة بمقترح وتوجيه أولي.',
      nameLabel: 'الاسم الكامل',
      namePlaceholder: 'مثال: كريم المنصوري',
      phoneLabel: 'رقم الهاتف',
      emailLabel: 'البريد الإلكتروني',
      projectTypeLabel: 'نوع المشروع',
      selectTypePlaceholder: 'اختر نوع التجديد المرغوب...',
      locationLabel: 'المدينة / الموقع',
      spaceSizeLabel: 'المساحة التقريبية (م²)',
      budgetLabel: 'الميزانية التقديرية المخصصة',
      messageLabel: 'رؤيتكم للمشروع والمتطلبات',
      messagePlaceholder:
        'صف مساحتكم الحالية، تفضيلاتكم للمواد، والجدول الزمني المفضل لديكم...',
      submitBtn: 'إرسال طلب المشروع',
      submitting: 'جاري الإرسال...',
      successTitle: 'تم استلام طلبكم بنجاح',
      successMsg:
        'شكراً لثقتكم في بـسام ديكور. يدرس مهندسنا الرئيسي معطياتكم وسيتواصل معكم هاتفياً في أقرب وقت.',
      directContact: 'التواصل المباشر',
      atelierAddress: 'مقر الأتيليه',
      businessHours: 'أوقات العمل والاستقبال',
      businessHoursValue: 'السبت – الخميس: 09:00 صباحاً – 06:30 مساءً',
    },
    booking: {
      modalTitle: 'حجز استشارة معمارية مخصصة',
      modalSubtitle:
        'جلسة خاصة مدتها 90 دقيقة لمراجعة المخططات، فحص المتطلبات وتحديد التوجه المعماري الأمثل.',
      selectType: 'طبيعة الاستشارة',
      typeOnSite: 'معاينة ورفع مساحي بالموقع',
      typeOnSiteDesc: 'رفع أبعاد دقيق وفحص تقني مباشر في عقاركم.',
      typeInStudio: 'لقاء خاص في الأتيليه',
      typeInStudioDesc: 'استعراض عينات المواد والتشطيبات ودراسة المخططات.',
      typeVirtual: 'استشارة افتراضية 3D',
      typeVirtualDesc: 'جلسة فيديو تفاعلية ومشاركة رقمية للشاشات والنماذج.',
      preferredDate: 'التاريخ المفضل',
      preferredTime: 'الوقت المناسب',
      clientName: 'الاسم الكامل',
      clientPhone: 'رقم الهاتف',
      clientEmail: 'البريد الإلكتروني',
      projectScope: 'ملخص نطاق المشروع',
      scopePlaceholder: 'مثال: تجديد كامل لفيلا 350م² مع مطبخ رخامي وجناح رئيسي...',
      confirmBooking: 'تأكيد موعد الاستشارة',
      bookingSuccessTitle: 'تم حجز موعدكم بنجاح',
      bookingSuccessMsg:
        'تم تسجيل موعد الاستشارة بنجاح. سيتواصل معكم منسق الأتيليه لتأكيد التفاصيل اللوجستية.',
      close: 'إغلاق',
    },
    theme: {
      mode: 'النمط البصري',
      light: 'الوضع الفاتح الأنيق',
      dark: 'الوضع الليلي الفاخر',
      togglePrompt: 'تبديل المظهر',
    },
    footer: {
      tagline: 'حوّل مساحتك إلى تحفة فنية استثنائية.',
      quickLinks: 'روابط سريعة',
      disciplines: 'المجالات المعمارية',
      atelierContact: 'الأتيليه والاتصال',
      rightsReserved: 'جميع الحقوق محفوظة. استوديو بـسام ديكور للهندسة والتجديد الراقي.',
      adminStudio: 'بوابة إدارة الاستوديو',
    },
    common: {
      learnMore: 'اكتشف المزيد',
      backToTop: 'العودة للأعلى',
      loading: 'جاري التحميل...',
      error: 'حدث خطأ غير متوقع',
    },
  },
};
