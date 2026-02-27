import type { Translations } from './en';

const mm: Translations = {
  // Common
  common: {
    signIn: 'ဝင်မည်',
    signOut: 'ထွက်မည်',
    loading: 'ခဏစောင့်ပါ...',
    cancel: 'မလုပ်တော့ပါ',
    delete: 'ဖျက်မည်',
    save: 'သိမ်းမည်',
    next: 'ရှေ့ဆက်မည်',
    previous: 'နောက်ပြန်',
    search: 'ရှာရန်',
    all: 'အားလုံး',
    you: 'ကိုယ်',
    required: 'အကွက်အားလုံး ဖြည့်ရန် လိုအပ်ပါသည်',
  },

  // Landing Page
  landing: {
    badge: 'AI စနစ်ဖြင့် SOP ထုတ်လုပ်ခြင်း',
    title: 'SOP Generator',
    description:
      'ပရော်ဖက်ရှင်နယ် Standard Operating Procedures များကို မိနစ်ပိုင်းအတွင်း ရေးဆွဲပါ။ SOP အသစ်များ ထုတ်လုပ်ခြင်း သို့မဟုတ် ရှိပြီးသား SOP များကို ပြင်ဆင်ခြင်း ပြုလုပ်နိုင်ပါသည်။',
    signInBtn: 'ဝင်မည်',
    generateTitle: 'SOP အသစ် ရေးဆွဲမည်',
    generateDesc:
      'သင့်လိုအပ်ချက်များ ဖြည့်သွင်းပါ၊ AI က သင့်လုပ်ငန်းနှင့် ကိုက်ညီသော SOP ကို ရေးဆွဲပေးပါမည်။',
    modifyTitle: 'ရှိပြီးသား SOP ပြင်ဆင်မည်',
    modifyDesc:
      'ရှိပြီးသား SOP ကို တင်ပါ၊ ပြဿနာများကို ဖော်ပြပါ၊ AI က ပိုကောင်းသော ဗားရှင်းကို ရေးဆွဲပေးပါမည်။',
    featureAI: 'AI စနစ်',
    featureProfessional: 'ပရော်ဖက်ရှင်နယ် ပုံစံ',
    featureExport: 'PDF ထုတ်ယူခြင်း',
  },

  // Login Page
  login: {
    title: 'ပြန်လည်ကြိုဆိုပါတယ်',
    subtitle: 'သင့်အကောင့်ဖြင့် ဝင်ရောက်ပါ',
    email: 'အီးမေးလ်',
    emailPlaceholder: 'အီးမေးလ် ရိုက်ထည့်ပါ',
    password: 'စကားဝှက်',
    passwordPlaceholder: 'စကားဝှက် ရိုက်ထည့်ပါ',
    apiKey: 'Gemini API Key',
    apiKeyPlaceholder: 'Gemini API key ရိုက်ထည့်ပါ',
    apiKeyHint: '',
    signInBtn: 'ဝင်မည်',
    signingIn: 'ဝင်ရောက်နေပါသည်...',
    contactAdmin: 'အကောင့်ရရှိရန် administratorထံ ဆက်သွယ်ပါ',
    invalidCredentials: 'အီးမေးလ် သို့မဟုတ် စကားဝှက် မှားနေပါသည်',
    error: 'အမှားတစ်ခု ဖြစ်ခဲ့ပါသည်။ ထပ်မံကြိုးစားပါ။',
  },

  // Admin Login Page
  adminLogin: {
    title: 'Admin Panel',
    subtitle: 'SOP Generator စီမံခန့်ခွဲမှု',
    formTitle: 'Admin ဝင်ရောက်ရန်',
    emailPlaceholder: 'admin@company.com',
    passwordPlaceholder: 'စကားဝှက် ရိုက်ထည့်ပါ',
    signInBtn: 'Admin အဖြစ် ဝင်မည်',
    signingIn: 'ဝင်ရောက်နေပါသည်...',
    accessDenied: 'ဝင်ရောက်ခွင့် ငြင်းပယ်ခံရပါသည်။ Admin ခွင့်ပြုချက် လိုအပ်ပါသည်။',
    invalidCredentials: 'အီးမေးလ် သို့မဟုတ် စကားဝှက် မှားနေပါသည်',
    error: 'အမှားတစ်ခု ဖြစ်ခဲ့ပါသည်။ ထပ်မံကြိုးစားပါ။',
    authorizedOnly: 'ခွင့်ပြုချက်ရ စီမံခန့်ခွဲသူများသာ',
  },

  // Dashboard
  dashboard: {
    welcome: 'ပြန်လည်ကြိုဆိုပါတယ်',
    description:
      'ပရော်ဖက်ရှင်နယ် Standard Operating Procedures များကို ရေးဆွဲခြင်း သို့မဟုတ် ပြင်ဆင်ခြင်း ပြုလုပ်နိုင်ပါသည်။',
    greetingMorning: 'မင်္ဂလာနံနက်ခင်းပါ',
    greetingAfternoon: 'မင်္ဂလာနေ့လည်ခင်းပါ',
    greetingEvening: 'မင်္ဂလာညနေခင်းပါ',
    quickActions: 'အမြန်လုပ်ဆောင်ချက်များ',
    recentTitle: 'မကြာသေးမီ SOPs',
    viewAll: 'အားလုံးကြည့်ရန်',
    noSops: 'SOP များ မရှိသေးပါ',
    noSopsDesc: 'ပထမဆုံး SOP ကို ရေးဆွဲပါ',
    stats: {
      total: 'စုစုပေါင်း SOPs',
      created: 'အသစ်',
      modified: 'ပြုပြင်ပြီး',
      powered: 'Powered By',
    },
    generateCard: {
      title: 'SOP အသစ် ရေးဆွဲမည်',
      desc: 'SOP စာရွက်စာတမ်းကို ရေးဆွဲပါ။',
      tags: ['လုပ်ငန်းအချက်အလက်', 'ပါဝင်သူများ', 'လုပ်ငန်းစဉ်', 'KPIs'],
    },
    modifyCard: {
      title: 'ရှိပြီးသား SOP ပြင်ဆင်မည်',
      desc: 'ရှိပြီးသား SOP ကို AI အကြံပြုချက်ဖြင့် ပိုကောင်းအောင် ပြင်ဆင်ပါ။',
      tags: ['SOP တင်ရန်', 'AI ခွဲခြမ်းစိတ်ဖြာ', 'အကြံပြုချက်'],
    },
    features: {
      title: 'ဘာကြောင့် SOP Generator ကို သုံးသင့်သလဲ?',
      items: [
        {
          title: 'AI စနစ်ဖြင့် ရေးဆွဲခြင်း',
          desc: 'အဆင့်မြင့် AI က သင့်လုပ်ငန်းနှင့် ကိုက်ညီသော ပရော်ဖက်ရှင်နယ် SOP များကို ရေးဆွဲပေးပါသည်။',
        },
        {
          title: 'အချိန်ကုန်သက်သာ',
          desc: 'ရက်ပေါင်းများစွာ ကြာမည့် SOP ရေးဆွဲခြင်းကို မိနစ်ပိုင်းအတွင်း ပြီးမြောက်အောင် ဆောင်ရွက်နိုင်ပါသည်။',
        },
        {
          title: 'ပရော်ဖက်ရှင်နယ် ပုံစံ',
          desc: 'လုပ်ငန်းစံနှုန်းနှင့် ကိုက်ညီသော ပုံစံ၊ ဇယား၊ လိုက်နာမှုစံနှုန်းများ ပါဝင်ပါသည်။',
        },
      ],
    },
  },

  // Navbar
  nav: {
    brand: 'SOP Generator',
    dashboard: 'ပင်မစာမျက်နှာ',
    mySops: 'ကျွန်ုပ်၏ SOPs',
    changeApiKey: 'API Key',
    apiKeyModalTitle: 'Gemini API Key',
    apiKeyModalDesc: 'AI ထုတ်လုပ်ရေး key စီမံခြင်း',
    currentKey: 'လက်ရှိ API Key',
    newApiKey: 'API Key အသစ်',
    apiKeyHint: 'သင့် API key ကို database တွင် လုံခြုံစွာ သိမ်းဆည်းထားပါသည်။',
    saved: 'သိမ်းပြီး!',
  },

  // API Errors
  apiErrors: {
    noApiKey:
      'ကျေးဇူးပြု၍ Gemini API key ကို အရင်သတ်မှတ်ပါ။ အပေါ်ဘက်ရှိ "API Key" ခလုတ်ကို နှိပ်ပြီး key ထည့်ပါ။',
    limitReached:
      'သင့် Gemini API key သည် အသုံးပြုမှုကန့်သတ်ချက်ကို ကျော်လွန်ပါပြီ။ အပေါ်ဘက်ရှိ "API Key" ခလုတ်ကို နှိပ်ပြီး key ပြောင်းပါ။',
    invalidKey:
      'သင့် Gemini API key မမှန်ကန်ပါ။ အပေါ်ဘက်ရှိ "API Key" ခလုတ်ကို နှိပ်ပြီး key အပ်ဒိတ်လုပ်ပါ။',
  },

  // New SOP Form
  newSop: {
    title: 'SOP အသစ် ရေးဆွဲမည်',
    subtitle: 'SOP ရေးဆွဲရန် အကွက်အားလုံးကို ဖြည့်ပါ',
    steps: {
      processInfo: { title: 'လုပ်ငန်းစဉ်', desc: 'လုပ်ငန်းနှင့် ဆောင်ရွက်မှု အသေးစိတ်' },
      stakeholders: { title: 'ပါဝင်သူများ', desc: 'ရာထူးနှင့် တာဝန်များ' },
      procedures: { title: 'လုပ်ငန်းအဆင့်များ', desc: 'တစ်ဆင့်ချင်း လုပ်ဆောင်ရန်' },
      tools: { title: 'ကိရိယာများ', desc: 'ဆော့ဖ်ဝဲနှင့် စာရွက်စာတမ်း' },
      compliance: { title: 'လိုက်နာမှု', desc: 'စံနှုန်းနှင့် မူဝါဒ' },
      risks: { title: 'အန္တရာယ်', desc: 'အန္တရာယ် အကဲဖြတ်ခြင်း' },
      kpis: { title: 'KPIs', desc: 'ရလဒ်နှင့် တိုင်းတာမှု' },
      versionControl: { title: 'ဗားရှင်းထိန်းချုပ်', desc: 'ဗားရှင်းနှင့် ပြန်လည်စစ်ဆေး' },
      training: { title: 'လေ့ကျင့်ခြင်း', desc: 'လေ့ကျင့်ရေး အစီအစဉ်' },
    },
    fields: {
      businessName: 'လုပ်ငန်းအမည်',
      businessNamePlaceholder: 'ဥပမာ - Golden Star Co., Ltd.',
      businessType: 'လုပ်ငန်းအမျိုးအစား',
      businessTypePlaceholder: 'ဥပမာ - လက်လီ၊ ထုတ်လုပ်ရေး၊ စားသောက်ဆိုင်',
      purpose: 'ရည်ရွယ်ချက် / ရည်မှန်းချက်',
      purposePlaceholder: 'ဤ SOP ၏ ရည်ရွယ်ချက်ကဘာလဲ? ဘာကို အောင်မြင်စေချင်သလဲ?',
      progressStartEnd: 'လုပ်ငန်းတိုးတက်မှု (အစ – အဆုံး)',
      progressStartEndPlaceholder: 'လုပ်ငန်းစဉ်၏ အစနှင့် အဆုံးအမှတ်များကို ဖော်ပြပါ',
      scope: 'နယ်ပယ် (ဌာန / အဖွဲ့)',
      scopePlaceholder: 'ဥပမာ - အရောင်းဌာန၊ HR အဖွဲ့',
      stakeholders: 'ဤ SOP ကို လိုက်နာရမည့် ဝန်ထမ်း (ရာထူး / တာဝန်)',
      stakeholdersPlaceholder: 'ဥပမာ - ဆိုင်မန်နေဂျာ၊ အရောင်းဝန်ထမ်း၊ ငွေကိုင် စသည်',
      responsibility: 'တာဝန် (ဘယ်သူ ဘာလုပ်ရမလဲ)',
      responsibilityPlaceholder: 'တစ်ဦးချင်း၏ တာဝန်များကို ဖော်ပြပါ',
      approvalAuthority: 'ခွင့်ပြုအတည်ပြုသူ',
      approvalAuthorityPlaceholder: 'ဘယ်သူမှာ ခွင့်ပြုပိုင်ခွင့်ရှိသလဲ? ဥပမာ - ဌာနမှူး၊ CEO',
      stepByStep: 'တစ်ဆင့်ချင်း လုပ်ငန်းစဉ်',
      stepByStepPlaceholder:
        'အဆင့်တစ်ခုချင်းစီကို ဖော်ပြပါ: ဘာလုပ်ရမလဲ၊ ဘယ်သူလုပ်မလဲ၊ ဘယ်အချိန်/ဘယ်နေရာမှာ လုပ်ရမလဲ\n\nဥပမာ:\nအဆင့် ၁: ဖောက်သည် ဆိုင်ထဲဝင်လာသည် → ကြိုဆိုသူက ကြိုဆိုသည်\nအဆင့် ၂: ဖောက်သည် ပစ္စည်းရွေးသည် → အရောင်းဝန်ထမ်းက ကူညီသည်',
      decisionPoints: 'ဆုံးဖြတ်ချက်အမှတ်များ',
      decisionPointsPlaceholder:
        'လုပ်ငန်းစဉ်တွင် ဟုတ်/မဟုတ် ဆုံးဖြတ်ချက်များကို ဖော်ပြပါ\n\nဥပမာ:\n- ပစ္စည်း stock ရှိသလား? → ရှိ: ဆက်လုပ်ပါ / မရှိ: အခြားပစ္စည်း ကမ်းလှမ်းပါ',
      tools: 'ဆော့ဖ်ဝဲ / စနစ် / စက်ကိရိယာ / ကိရိယာများ',
      toolsPlaceholder: 'ဥပမာ - POS System, Microsoft Excel, SAP, Barcode Scanner',
      referenceDocuments: 'ကိုးကားစာရွက်စာတမ်း (မူဝါဒ၊ လမ်းညွှန်၊ ပုံစံ)',
      referenceDocumentsPlaceholder: 'ဥပမာ - ဝန်ထမ်းလက်စွဲ၊ ပြန်လဲရေးပုံစံ၊ အရောင်းအစီရင်ခံပုံစံ',
      complianceStandards: 'ကုမ္ပဏီမူဝါဒ / ဥပဒေ / စည်းမျဉ်း / အရည်အသွေးစံနှုန်း',
      complianceStandardsPlaceholder:
        'ဥပမာ - ISO 9001, ကုမ္ပဏီလုံခြုံရေးမူဝါဒ, စားသုံးသူအကာအကွယ်ဥပဒေ',
      dosAndDonts: 'လုပ်ရမည် / မလုပ်ရမည်',
      dosAndDontsPlaceholder:
        'ဤလုပ်ငန်းစဉ်အတွက် လုပ်ရမည့်နှင့် မလုပ်ရမည့် အချက်များကို စာရင်းပြုစုပါ',
      risks: 'ဖြစ်နိုင်သော အန္တရာယ်များ',
      risksPlaceholder:
        'ဤလုပ်ငန်းစဉ်တွင် ဘာအန္တရာယ်များ ဖြစ်နိုင်သလဲ?\n\nဥပမာ - ဒေတာထည့်သွင်းမှု အမှား, ကုန်ပစ္စည်းစာရင်း ကွဲလွဲမှု, ဖောက်သည်တိုင်ကြားမှု',
      controls: 'ထိန်းချုပ် / ကာကွယ်နည်းလမ်းများ',
      controlsPlaceholder:
        'အန္တရာယ်တစ်ခုချင်းစီကို ဘယ်လို ကာကွယ်/လျှော့ချမလဲ?\n\nဥပမာ - နှစ်ခါစစ်ဆေးခြင်း, ပုံမှန်စစ်ဆေးခြင်း, လေ့ကျင့်ရေးအစီအစဉ်',
      expectedOutput: 'မျှော်မှန်းထားသော ရလဒ် / Output',
      expectedOutputPlaceholder: 'ဤ SOP ကို လိုက်နာပြီးနောက် ရလဒ်က ဘာဖြစ်သင့်သလဲ?',
      kpiMetrics: 'အောင်မြင်မှုတိုင်းတာချက် KPI / Metrics',
      kpiMetricsPlaceholder:
        'ဥပမာ - ဖောက်သည်ကျေနပ်မှုနှုန်း > ၉၀%、အမှားနှုန်း < ၂%、လုပ်ဆောင်ချိန် < ၅ မိနစ်',
      versionNo: 'SOP ဗားရှင်းနံပါတ်',
      versionNoPlaceholder: 'ဥပမာ - 1.0',
      effectiveDate: 'စတင်အသက်ဝင်မည့်ရက်',
      reviewCycle: 'ပြန်လည်စစ်ဆေးမှုကာလ',
      reviewCyclePlaceholder: 'ဥပမာ - ၆ လတစ်ကြိမ်, နှစ်စဉ်',
      revisionHistory: 'ပြင်ဆင်မှုမှတ်တမ်း',
      revisionHistoryPlaceholder: 'ယခင် ပြင်ဆင်မှုမှတ်ချက်များ',
      trainingMethod: 'လေ့ကျင့်ရေးနည်းလမ်း',
      trainingMethodPlaceholder:
        'ဝန်ထမ်းများကို ဤ SOP အတွက် ဘယ်လို လေ့ကျင့်ပေးမလဲ?\n\nဥပမာ - စာသင်ခန်းသင်တန်း, အွန်လိုင်းသင်ခန်းစာ, တာဝန်ခွင်သင်ကြားခြင်း',
      inductionProcess: 'ဝန်ထမ်းအသစ် မိတ်ဆက်လုပ်ငန်းစဉ်',
      inductionProcessPlaceholder: 'ဝန်ထမ်းအသစ်များကို ဤ SOP ကို ဘယ်လို မိတ်ဆက်ပေးမလဲ?',
      updateNotification: 'SOP အပ်ဒိတ် အကြောင်းကြားနည်း',
      updateNotificationPlaceholder:
        'SOP အပ်ဒိတ်များကို ဝန်ထမ်းများကို ဘယ်လို အကြောင်းကြားမလဲ?\n\nဥပမာ - အီးမေးလ်, အဖွဲ့အစည်းအဝေး, ကြေငြာဘုတ်',
    },
    outputLanguage: 'SOP ရေးဆွဲမည့် ဘာသာစကား',
    outputLanguageEnglish: 'English (အင်္ဂလိပ်)',
    outputLanguageMyanmar: 'မြန်မာ',
    generateBtn: 'SOP ရေးဆွဲမည်',
    generating: 'SOP ရေးဆွဲနေပါသည်...',
  },

  // Modify SOP
  modifySop: {
    title: 'ရှိပြီးသား SOP ပြင်ဆင်မည်',
    subtitle: 'ရှိပြီးသား SOP ကို တင်ပြီး ပြင်ဆင်ရန် လိုအပ်သည်များကို ဖော်ပြပါ',
    uploadLabel: 'ရှိပြီးသား SOP တင်ရန်',
    uploadDesc: 'ရှိပြီးသား SOP အကြောင်းအရာကို ကူးထည့်ပါ သို့မဟုတ် တင်ပါ',
    uploadPlaceholder: 'ရှိပြီးသား SOP အကြောင်းအရာကို ဒီမှာ ကူးထည့်ပါ...',
    problemsLabel: 'တွေ့ရှိသော ပြဿနာများ',
    problemsPlaceholder: 'ရှိပြီးသား SOP တွင် တွေ့ရှိသော ပြဿနာများကို ဖော်ပြပါ...',
    additionalLabel: 'ထပ်ဆောင်း လိုအပ်ချက်များ',
    additionalPlaceholder: 'ထပ်ဆောင်း လိုအပ်ချက် သို့မဟုတ် ပြင်ဆင်လိုသည်များ...',
    outputLanguage: 'SOP ရေးဆွဲမည့် ဘာသာစကား',
    outputLanguageEnglish: 'English (အင်္ဂလိပ်)',
    outputLanguageMyanmar: 'မြန်မာ',
    submitBtn: 'SOP ပြင်ဆင်မည်',
    modifying: 'SOP ပြင်ဆင်နေပါသည်...',
    orUpload: 'သို့မဟုတ် ဖိုင်တင်ရန်',
    dropHere: 'ဖိုင်ကို ဒီမှာ ချထားပါ သို့မဟုတ် ရွေးပါ',
    supportedFormats: 'ပံ့ပိုးမှု: .pdf, .doc, .docx',
    businessName: 'လုပ်ငန်းအမည်',
    businessNamePlaceholder: 'ဥပမာ - Golden Star Co., Ltd.',
  },

  // SOP List
  sopList: {
    title: 'ကျွန်ုပ်၏ SOPs',
    subtitle: 'သင်ရေးဆွဲထားသော SOP များကို ကြည့်ရှုနှင့် စီမံခန့်ခွဲပါ',
    searchPlaceholder: 'SOP ရှာရန်...',
    filterAll: 'အားလုံး',
    filterNew: 'အသစ်',
    filterModified: 'ပြင်ဆင်ပြီး',
    noSops: 'SOP မတွေ့ပါ',
    noSopsDesc: 'စတင်ရန် သင့်ပထမဆုံး SOP ကို ရေးဆွဲပါ',
    generateFirst: 'SOP အသစ် ရေးဆွဲမည်',
    createdBy: 'ရေးဆွဲသူ',
    viewDetails: 'ကြည့်မည်',
    deleteSop: 'ဖျက်မည်',
    confirmDelete: 'ဤ SOP ကို ဖျက်ရန် သေချာပါသလား?',
  },

  // SOP Detail
  sopDetail: {
    title: 'SOP အသေးစိတ်',
    downloadPdf: 'PDF ဒေါင်းလုဒ်',
    deleteSop: 'SOP ဖျက်မည်',
    createdAt: 'ရေးဆွဲသည့်ရက်',
    type: 'အမျိုးအစား',
    generatedContent: 'ရေးဆွဲထားသော အကြောင်းအရာ',
    generatedDocument: 'ရေးဆွဲထားသော စာရွက်စာတမ်း',
    clickToEdit: 'တည်းဖြတ်ရန် နှိပ်ပါ',
    saveChanges: 'ပြောင်းလဲမှုများ သိမ်းဆည်းမည်',
    autoSaving: 'အလိုအလျောက် သိမ်းဆည်းနေသည်...',
    saved: 'သိမ်းဆည်းပြီးပါပြီ!',
    confirmDelete: 'ဤ SOP ကို ဖျက်ရန် သေချာပါသလား? ဤလုပ်ဆောင်ချက်ကို ပြန်လည်ပြင်ဆင်၍ မရပါ။',
  },

  // Admin Panel
  admin: {
    brand: 'SOP Admin',
    badge: 'Admin',
    title: 'အသုံးပြုသူ စီမံခန့်ခွဲမှု',
    subtitle: 'အကောင့်နှင့် ခွင့်ပြုချက်များ စီမံခန့်ခွဲမည်',
    usersRegistered: 'ဦး စာရင်းသွင်းထားသည်',
    searchPlaceholder: 'အသုံးပြုသူ ရှာရန်...',
    addUser: 'အသုံးပြုသူ ထည့်မည်',
    addUserTitle: 'အသုံးပြုသူ အသစ်ထည့်မည်',
    fullName: 'အမည်အပြည့်အစုံ',
    fullNamePlaceholder: 'အမည်အပြည့်အစုံ ရိုက်ထည့်ပါ',
    email: 'အီးမေးလ်',
    emailPlaceholder: 'အီးမေးလ် ရိုက်ထည့်ပါ',
    password: 'စကားဝှက်',
    passwordPlaceholder: 'အနည်းဆုံး ၆ လုံး',
    role: 'ရာထူး',
    createBtn: 'အသုံးပြုသူ ဖန်တီးမည်',
    creating: 'ဖန်တီးနေပါသည်...',
    promote: 'တိုးမြှင့်',
    demote: 'လျှော့ချ',
    joined: 'ပါဝင်သည့်ရက်',
    sops: 'SOPs',
    actions: 'လုပ်ဆောင်ချက်',
    user: 'အသုံးပြုသူ',
    confirmDeleteUser:
      'ဤအသုံးပြုသူကို ဖျက်ရန် သေချာပါသလား? ၎င်းတို့၏ SOP အားလုံးလည်း ဖျက်ခံရပါမည်။',
    failedDelete: 'အသုံးပြုသူ ဖျက်ခြင်း မအောင်မြင်ပါ',
    failedUpdate: 'ရာထူး ပြောင်းလဲခြင်း မအောင်မြင်ပါ',
    failedCreate: 'အသုံးပြုသူ ဖန်တီးခြင်း မအောင်မြင်ပါ',
    errorOccurred: 'အမှားတစ်ခု ဖြစ်ပွားခဲ့ပါသည်',
  },
} as const;

export default mm;
