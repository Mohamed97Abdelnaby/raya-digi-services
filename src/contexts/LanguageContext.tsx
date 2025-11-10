import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    title: 'Digital Branch Services',
    tagline: 'Innovate. Connect. Secure.',
    updateKyc: 'Update KYC',
    updateKycDesc: 'Keep your Know Your Customer information current and compliant',
    updateKycDetails: 'Update your personal information, documents, and verification details to maintain compliance with banking standards and regulations.',
    foreignCurrency: 'Foreign Currency Withdrawal',
    foreignCurrencyDesc: 'Withdraw foreign currencies at competitive exchange rates',
    foreignCurrencyDetails: 'Access foreign currency withdrawal services with competitive rates. Perfect for travel or international business needs.',
    moneyExchange: 'Money Exchange',
    moneyExchangeDesc: 'Exchange currencies with real-time rates and instant processing',
    moneyExchangeDetails: 'Exchange between multiple currencies with real-time market rates. Fast, secure, and convenient service.',
    learnMore: 'Learn More',
    close: 'Close',
    
    // Unified Service Form
    fullName: 'Full Name',
    fullNameHint: 'Enter your full name',
    mobileNumber: 'Mobile Number',
    mobileNumberHint: 'Enter your Egyptian mobile number (e.g., 01012345678)',
    confirmButton: 'Confirm',
    sendWhatsAppButton: 'Send Message via WhatsApp',
    requestSubmittedSuccess: 'Your request has been submitted successfully! A message has been sent via WhatsApp.',
    serviceRequest: 'Request',
    fieldRequired: 'This field is required',
    invalidPhone: 'Invalid Egyptian phone number',
    requestDate: 'Request Date',
    submitRequest: 'Request Submitted',
    
    statementPrinting: 'Statement Printing',
    statementPrintingDesc: 'Generate and print your account statements instantly',
    statementPrintingDetails: 'Request printed statements for any date range. Select your preferred format (PDF or paper) and receive detailed transaction history for your financial records.',
    chequeBookRequest: 'Cheque Book Request',
    chequeBookRequestDesc: 'Order new cheque books for your accounts',
    chequeBookRequestDetails: 'Request a new cheque book with customized options. Choose the number of leaves and specify your delivery preferences. Processing typically takes 3-5 business days.',
    mobilePrestaging: 'Mobile Prestaging',
    'mobilePrestaging Desc': 'Pre-configure your mobile banking settings',
    'mobilePrestaging Details': 'Set up your mobile banking profile in advance. Configure security settings, biometric authentication, notification preferences, and transaction limits before activation.',
  },
  ar: {
    title: 'خدمات الفرع الرقمي',
    tagline: 'نبتكر. نربط. نؤمن.',
    updateKyc: 'تحديث البيانات',
    updateKycDesc: 'حافظ على تحديث معلومات العميل الخاصة بك',
    updateKycDetails: 'قم بتحديث معلوماتك الشخصية ومستنداتك وتفاصيل التحقق للحفاظ على الامتثال للمعايير واللوائح المصرفية.',
    foreignCurrency: 'سحب عملات أجنبية',
    foreignCurrencyDesc: 'سحب العملات الأجنبية بأسعار صرف تنافسية',
    foreignCurrencyDetails: 'الوصول إلى خدمات سحب العملات الأجنبية بأسعار تنافسية. مثالي للسفر أو احتياجات الأعمال الدولية.',
    moneyExchange: 'صرف العملات',
    moneyExchangeDesc: 'تبادل العملات بأسعار لحظية ومعالجة فورية',
    moneyExchangeDetails: 'التبادل بين عملات متعددة بأسعار السوق في الوقت الفعلي. خدمة سريعة وآمنة ومريحة.',
    learnMore: 'معرفة المزيد',
    close: 'إغلاق',
    
    // Unified Service Form
    fullName: 'الاسم الكامل',
    fullNameHint: 'أدخل اسمك الكامل',
    mobileNumber: 'رقم الهاتف المحمول',
    mobileNumberHint: 'أدخل رقم هاتفك المحمول المصري (مثال: 01012345678)',
    confirmButton: 'تأكيد',
    sendWhatsAppButton: 'إرسال رسالة عبر واتساب',
    requestSubmittedSuccess: 'تم إرسال طلبك بنجاح! تم إرسال رسالة عبر واتساب.',
    serviceRequest: 'طلب',
    fieldRequired: 'هذا الحقل مطلوب',
    invalidPhone: 'رقم هاتف مصري غير صحيح',
    requestDate: 'تاريخ الطلب',
    submitRequest: 'تم إرسال الطلب',
    
    statementPrinting: 'طباعة الكشوف',
    statementPrintingDesc: 'إنشاء وطباعة كشوف حسابك فوراً',
    statementPrintingDetails: 'اطلب كشوف مطبوعة لأي نطاق زمني. اختر التنسيق المفضل لديك (PDF أو ورقي) واحصل على تاريخ المعاملات التفصيلي لسجلاتك المالية.',
    chequeBookRequest: 'طلب دفتر شيكات',
    chequeBookRequestDesc: 'اطلب دفاتر شيكات جديدة لحساباتك',
    chequeBookRequestDetails: 'اطلب دفتر شيكات جديد مع خيارات مخصصة. اختر عدد الأوراق وحدد تفضيلات التسليم الخاصة بك. تستغرق المعالجة عادةً من 3 إلى 5 أيام عمل.',
    mobilePrestaging: 'الإعداد المسبق للجوال',
    'mobilePrestaging Desc': 'قم بتكوين إعدادات الخدمات المصرفية عبر الهاتف المحمول مسبقاً',
    'mobilePrestaging Details': 'قم بإعداد ملف تعريف الخدمات المصرفية عبر الهاتف المحمول الخاص بك مسبقاً. قم بتكوين إعدادات الأمان ومصادقة القياسات الحيوية وتفضيلات الإشعارات وحدود المعاملات قبل التفعيل.',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
