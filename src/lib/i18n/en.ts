const en = {
  // Common
  common: {
    signIn: 'Sign In',
    signOut: 'Sign Out',
    loading: 'Loading...',
    cancel: 'Cancel',
    delete: 'Delete',
    save: 'Save',
    next: 'Next',
    previous: 'Previous',
    search: 'Search',
    all: 'All',
    you: 'You',
    required: 'All fields are required',
  },

  // Landing Page
  landing: {
    badge: 'AI-Powered SOP Generation',
    title: 'SOP Generator',
    description:
      'Create professional Standard Operating Procedures in minutes with AI assistance. Generate new SOPs or modify existing ones with intelligent analysis.',
    signInBtn: 'Sign In',
    generateTitle: 'Generate New SOPs',
    generateDesc:
      'Fill in your requirements and let AI create comprehensive SOPs tailored to your business.',
    modifyTitle: 'Modify Existing SOPs',
    modifyDesc:
      'Upload your existing SOP, describe the problems, and get an AI-improved version with suggestions.',
    featureAI: 'AI-Powered',
    featureProfessional: 'Professional Format',
    featureExport: 'PDF Export',
  },

  // Login Page
  login: {
    title: 'Welcome back',
    subtitle: 'Sign in to your account',
    email: 'Email',
    emailPlaceholder: 'Enter your email',
    password: 'Password',
    passwordPlaceholder: 'Enter your password',
    apiKey: 'Gemini API Key',
    apiKeyPlaceholder: 'Enter your Gemini API key',
    apiKeyHint: '',
    signInBtn: 'Sign In',
    signingIn: 'Signing in...',
    contactAdmin: 'Contact your administrator to get an account',
    invalidCredentials: 'Invalid email or password',
    error: 'An error occurred. Please try again.',
  },

  // Admin Login Page
  adminLogin: {
    title: 'Admin Panel',
    subtitle: 'SOP Generator Administration',
    formTitle: 'Admin Sign In',
    emailPlaceholder: 'admin@company.com',
    passwordPlaceholder: 'Enter your password',
    signInBtn: 'Sign In as Admin',
    signingIn: 'Signing in...',
    accessDenied: 'Access denied. Admin privileges required.',
    invalidCredentials: 'Invalid email or password',
    error: 'An error occurred. Please try again.',
    authorizedOnly: 'Authorized administrators only',
  },

  // Dashboard
  dashboard: {
    welcome: 'Welcome back,',
    description:
      'Create professional Standard Operating Procedures or modify existing ones with AI-powered assistance.',
    greetingMorning: 'Good morning',
    greetingAfternoon: 'Good afternoon',
    greetingEvening: 'Good evening',
    quickActions: 'Quick Actions',
    recentTitle: 'Recent SOPs',
    viewAll: 'View All',
    noSops: 'No SOPs yet',
    noSopsDesc: 'Create your first SOP to get started',
    stats: {
      total: 'Total SOPs',
      created: 'New',
      modified: 'Modified',
      powered: 'Powered By',
    },
    generateCard: {
      title: 'Generate New SOP',
      desc: 'Create a comprehensive SOP from scratch with AI assistance.',
      tags: ['Business Info', 'Stakeholders', 'Procedures', 'KPIs'],
    },
    modifyCard: {
      title: 'Modify Existing SOP',
      desc: 'Upload and improve your existing SOP with AI suggestions.',
      tags: ['Upload SOP', 'AI Analysis', 'Suggestions'],
    },
    features: {
      title: 'Why Use SOP Generator?',
      items: [
        {
          title: 'AI-Powered Generation',
          desc: 'Advanced AI creates professional, detailed SOPs tailored to your specific business needs.',
        },
        {
          title: 'Time Saving',
          desc: 'Generate comprehensive SOPs in minutes instead of hours or days of manual work.',
        },
        {
          title: 'Professional Format',
          desc: 'Industry-standard formatting with proper sections, tables, and compliance standards.',
        },
      ],
    },
  },

  // Navbar
  nav: {
    brand: 'SOP Generator',
    dashboard: 'Dashboard',
    mySops: 'My SOPs',
    changeApiKey: 'API Key',
    apiKeyModalTitle: 'Gemini API Key',
    apiKeyModalDesc: 'Manage your AI generation key',
    currentKey: 'Current API Key',
    newApiKey: 'New API Key',
    apiKeyHint: '',
    saved: 'Saved!',
  },

  // API Errors
  apiErrors: {
    noApiKey:
      'Please set your Gemini API key first. Click the "API Key" button in the top menu to add your key.',
    limitReached:
      'Your Gemini API key has reached its usage limit. Please click the "API Key" button in the top menu to change your API key.',
    invalidKey:
      'Your Gemini API key is invalid. Please click the "API Key" button in the top menu to update your key.',
  },

  // New SOP Form
  newSop: {
    title: 'Generate New SOP',
    subtitle: 'Fill in all required fields to generate your SOP',
    steps: {
      processInfo: { title: 'Process Info', desc: 'Business & process details' },
      stakeholders: { title: 'Stakeholders', desc: 'Roles & responsibilities' },
      procedures: { title: 'Procedures', desc: 'Step-by-step process' },
      tools: { title: 'Tools & Resources', desc: 'Software & documents' },
      compliance: { title: 'Compliance', desc: 'Standards & policies' },
      risks: { title: 'Risks', desc: 'Risk assessment' },
      kpis: { title: 'KPIs', desc: 'Output & metrics' },
      versionControl: { title: 'Version Control', desc: 'Version & review' },
      training: { title: 'Training', desc: 'Training plan' },
    },
    fields: {
      businessName: 'Business Name',
      businessNamePlaceholder: 'e.g., Golden Star Co., Ltd.',
      businessType: 'Business Type',
      businessTypePlaceholder: 'e.g., Retail, Manufacturing, F&B',
      purpose: 'Purpose / Objective',
      purposePlaceholder: 'What is the purpose of this SOP? What should it achieve?',
      progressStartEnd: 'Business Progress (Start – End point)',
      progressStartEndPlaceholder: 'Describe the start and end points of the process',
      scope: 'Scope (Department / Team)',
      scopePlaceholder: 'e.g., Sales Department, HR Team',
      stakeholders: 'Personnel who must follow this SOP (Role / Position)',
      stakeholdersPlaceholder: 'e.g., Store Manager, Sales Staff, Cashier, etc.',
      responsibility: 'Responsibility (Who does what)',
      responsibilityPlaceholder: "Describe each person's responsibilities",
      approvalAuthority: 'Approval Authority',
      approvalAuthorityPlaceholder: 'Who has the authority to approve? e.g., Department Head, CEO',
      stepByStep: 'Step-by-Step Process',
      stepByStepPlaceholder:
        'Describe each step: what to do, who does it, when/where to do it.\n\nExample:\nStep 1: Customer enters the store → Greeter welcomes customer\nStep 2: Customer selects items → Sales staff assists\nStep 3: Customer proceeds to checkout → Cashier processes payment',
      decisionPoints: 'Decision Points',
      decisionPointsPlaceholder:
        'Describe any Yes/No decision points in the process\n\nExample:\n- Is the item in stock? → Yes: proceed / No: offer alternative',
      tools: 'Software / System / Equipment / Tools',
      toolsPlaceholder: 'e.g., POS System, Microsoft Excel, SAP, Barcode Scanner',
      referenceDocuments: 'Reference Documents (Policy, Guideline, Form, Template)',
      referenceDocumentsPlaceholder:
        'e.g., Employee Handbook, Return Policy Form, Sales Report Template',
      complianceStandards: 'Company Policy / Law / Regulation / Quality Standard',
      complianceStandardsPlaceholder:
        'e.g., ISO 9001, Company Safety Policy, Consumer Protection Law',
      dosAndDonts: "Dos & Don'ts",
      dosAndDontsPlaceholder: "List the dos and don'ts for this process",
      risks: 'Potential Risks',
      risksPlaceholder:
        'What risks could occur during this process?\n\ne.g., Data entry errors, Inventory discrepancies, Customer complaints',
      controls: 'Control / Prevention Methods',
      controlsPlaceholder:
        'How to prevent or mitigate each risk?\n\ne.g., Double-check entries, Regular audits, Training programs',
      expectedOutput: 'Expected Result / Output',
      expectedOutputPlaceholder: 'What should be the result after following this SOP?',
      kpiMetrics: 'Success Measurement KPI / Metrics',
      kpiMetricsPlaceholder:
        'e.g., Customer satisfaction rate > 90%, Error rate < 2%, Processing time < 5 minutes',
      versionNo: 'SOP Version No.',
      versionNoPlaceholder: 'e.g., 1.0',
      effectiveDate: 'Effective Date',
      reviewCycle: 'Review Cycle',
      reviewCyclePlaceholder: 'e.g., Every 6 months, Annually',
      revisionHistory: 'Revision History',
      revisionHistoryPlaceholder: 'Any previous revision notes',
      trainingMethod: 'Training Method',
      trainingMethodPlaceholder:
        'How will staff be trained on this SOP?\n\ne.g., Classroom training, Online modules, On-the-job training',
      inductionProcess: 'New Staff Induction Process',
      inductionProcessPlaceholder: 'How will new staff be introduced to this SOP?',
      updateNotification: 'SOP Update Notification Method',
      updateNotificationPlaceholder:
        'How will staff be notified about SOP updates?\n\ne.g., Email notification, Team meeting, Notice board',
    },
    outputLanguage: 'SOP Output Language',
    outputLanguageEnglish: 'English',
    outputLanguageMyanmar: 'Myanmar (မြန်မာ)',
    generateBtn: 'Generate SOP',
    generating: 'Generating SOP...',
  },

  // Modify SOP
  modifySop: {
    title: 'Modify Existing SOP',
    subtitle: 'Upload your existing SOP and describe the changes needed',
    uploadLabel: 'Upload Existing SOP',
    uploadDesc: 'Paste or upload your existing SOP content',
    uploadPlaceholder: 'Paste your existing SOP content here...',
    problemsLabel: 'Problems / Issues Found',
    problemsPlaceholder: 'Describe the problems or issues you found in the existing SOP...',
    additionalLabel: 'Additional Requirements',
    additionalPlaceholder: 'Any additional requirements or changes you want to make...',
    outputLanguage: 'SOP Output Language',
    outputLanguageEnglish: 'English',
    outputLanguageMyanmar: 'Myanmar (မြန်မာ)',
    submitBtn: 'Modify SOP',
    modifying: 'Modifying SOP...',
    orUpload: 'Or upload a file',
    dropHere: 'Drop your file here or click to browse',
    supportedFormats: 'Supported: .pdf, .doc, .docx',
    businessName: 'Business Name',
    businessNamePlaceholder: 'e.g., Golden Star Co., Ltd.',
  },

  // SOP List
  sopList: {
    title: 'My SOPs',
    subtitle: 'View and manage your generated SOPs',
    searchPlaceholder: 'Search SOPs...',
    filterAll: 'All',
    filterNew: 'New',
    filterModified: 'Modified',
    noSops: 'No SOPs found',
    noSopsDesc: 'Generate your first SOP to get started',
    generateFirst: 'Generate New SOP',
    createdBy: 'Created by',
    viewDetails: 'View',
    deleteSop: 'Delete',
    confirmDelete: 'Are you sure you want to delete this SOP?',
  },

  // SOP Detail
  sopDetail: {
    title: 'SOP Details',
    downloadPdf: 'Download PDF',
    deleteSop: 'Delete SOP',
    createdAt: 'Created at',
    type: 'Type',
    generatedContent: 'Generated Content',
    generatedDocument: 'Generated Document',
    clickToEdit: 'Click to edit',
    saveChanges: 'Save Changes',
    autoSaving: 'Auto-saving...',
    saved: 'Saved!',
    confirmDelete: 'Are you sure you want to delete this SOP? This action cannot be undone.',
  },

  // Admin Panel
  admin: {
    brand: 'SOP Admin',
    badge: 'Admin',
    title: 'User Management',
    subtitle: 'Manage accounts and permissions',
    usersRegistered: 'users registered',
    searchPlaceholder: 'Search users...',
    addUser: 'Add User',
    addUserTitle: 'Add New User',
    fullName: 'Full Name',
    fullNamePlaceholder: 'Enter full name',
    email: 'Email',
    emailPlaceholder: 'Enter email',
    password: 'Password',
    passwordPlaceholder: 'Min. 6 characters',
    role: 'Role',
    createBtn: 'Create User',
    creating: 'Creating...',
    promote: 'Promote',
    demote: 'Demote',
    joined: 'Joined',
    sops: 'SOPs',
    actions: 'Actions',
    user: 'User',
    confirmDeleteUser:
      'Are you sure you want to delete this user? All their SOPs will also be deleted.',
    failedDelete: 'Failed to delete user',
    failedUpdate: 'Failed to update role',
    failedCreate: 'Failed to create user',
    errorOccurred: 'An error occurred',
  },
};

export default en;
export type Translations = typeof en;
