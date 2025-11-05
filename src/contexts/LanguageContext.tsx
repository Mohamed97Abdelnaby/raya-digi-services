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
    withdrawal: 'Withdrawal Above Limit',
    withdrawalDesc: 'Request withdrawals exceeding your daily limit with secure authorization',
    updateKyc: 'Update KYC',
    updateKycDesc: 'Keep your Know Your Customer information current and compliant',
    foreignCurrency: 'Foreign Currency Withdrawal',
    foreignCurrencyDesc: 'Withdraw foreign currencies at competitive exchange rates',
    moneyExchange: 'Money Exchange',
    moneyExchangeDesc: 'Exchange currencies with real-time rates and instant processing',
    learnMore: 'Learn More',
    close: 'Close',
    withdrawalDetails: 'Submit a request to withdraw amounts above your standard daily limit. Our secure verification process ensures your transaction is safe and compliant with banking regulations.',
    updateKycDetails: 'Update your personal information, documents, and verification details to maintain compliance with banking standards and regulations.',
    foreignCurrencyDetails: 'Access foreign currency withdrawal services with competitive rates. Perfect for travel or international business needs.',
    moneyExchangeDetails: 'Exchange between multiple currencies with real-time market rates. Fast, secure, and convenient service.',
    withdrawalRequestTitle: 'Withdrawal Above Limit Request',
    nationalId: 'National ID',
    nationalIdHint: 'Enter your 14-digit national ID',
    withdrawalAmount: 'Withdrawal Amount',
    amountHint: 'Enter amount in selected currency',
    phoneNumber: 'Phone Number',
    phoneHint: 'Enter your Egyptian mobile number (e.g., 01012345678)',
    currency: 'Currency',
    scanNationalId: 'Scan National ID',
    enterAmount: 'Enter Withdrawal Amount',
    confirmPhone: 'Confirm Phone Number',
    submitRequest: 'Confirm Withdrawal Request',
    fieldRequired: 'This field is required',
    invalidNationalId: 'National ID must be exactly 14 digits',
    invalidPhone: 'Invalid Egyptian phone number',
    invalidAmount: 'Amount must be a positive number',
    withdrawalSuccess: 'Your withdrawal request has been submitted successfully. You will receive a confirmation SMS shortly.',
    uploadId: 'Upload ID Document',
    changeId: 'Change Document',
    optional: 'Optional',
    printForm: 'Print Form',
    sendWhatsApp: 'Send Form in WhatsApp',
    withdrawalReceipt: 'Withdrawal Request Receipt',
    requestDate: 'Request Date',
  },
  ar: {
    title: 'خدمات الفرع الرقمي',
    tagline: 'نبتكر. نربط. نؤمن.',
    withdrawal: 'السحب فوق الحد',
    withdrawalDesc: 'طلب عمليات سحب تتجاوز الحد اليومي مع تفويض آمن',
    updateKyc: 'تحديث البيانات',
    updateKycDesc: 'حافظ على تحديث معلومات العميل الخاصة بك',
    foreignCurrency: 'سحب عملات أجنبية',
    foreignCurrencyDesc: 'سحب العملات الأجنبية بأسعار صرف تنافسية',
    moneyExchange: 'صرف العملات',
    moneyExchangeDesc: 'تبادل العملات بأسعار لحظية ومعالجة فورية',
    learnMore: 'معرفة المزيد',
    close: 'إغلاق',
    withdrawalDetails: 'قدم طلبًا لسحب مبالغ تتجاوز حدك اليومي القياسي. تضمن عملية التحقق الآمنة لدينا أن تكون معاملتك آمنة ومتوافقة مع اللوائح المصرفية.',
    updateKycDetails: 'قم بتحديث معلوماتك الشخصية ومستنداتك وتفاصيل التحقق للحفاظ على الامتثال للمعايير واللوائح المصرفية.',
    foreignCurrencyDetails: 'الوصول إلى خدمات سحب العملات الأجنبية بأسعار تنافسية. مثالي للسفر أو احتياجات الأعمال الدولية.',
    moneyExchangeDetails: 'التبادل بين عملات متعددة بأسعار السوق في الوقت الفعلي. خدمة سريعة وآمنة ومريحة.',
    withdrawalRequestTitle: 'طلب السحب فوق الحد',
    nationalId: 'الرقم القومي',
    nationalIdHint: 'أدخل رقمك القومي المكون من 14 رقمًا',
    withdrawalAmount: 'مبلغ السحب',
    amountHint: 'أدخل المبلغ بالعملة المحددة',
    phoneNumber: 'رقم الهاتف',
    phoneHint: 'أدخل رقم هاتفك المحمول المصري (مثال: 01012345678)',
    currency: 'العملة',
    scanNationalId: 'مسح الرقم القومي',
    enterAmount: 'إدخال مبلغ السحب',
    confirmPhone: 'تأكيد رقم الهاتف',
    submitRequest: 'تأكيد طلب السحب',
    fieldRequired: 'هذا الحقل مطلوب',
    invalidNationalId: 'الرقم القومي يجب أن يكون 14 رقمًا بالضبط',
    invalidPhone: 'رقم هاتف مصري غير صحيح',
    invalidAmount: 'المبلغ يجب أن يكون رقمًا موجبًا',
    withdrawalSuccess: 'تم تقديم طلب السحب بنجاح. سوف تتلقى رسالة تأكيد نصية قريبًا.',
    uploadId: 'تحميل مستند الهوية',
    changeId: 'تغيير المستند',
    optional: 'اختياري',
    printForm: 'طباعة النموذج',
    sendWhatsApp: 'إرسال النموذج في واتساب',
    withdrawalReceipt: 'إيصال طلب السحب',
    requestDate: 'تاريخ الطلب',
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
