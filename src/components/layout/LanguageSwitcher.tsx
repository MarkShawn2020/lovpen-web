'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

type Language = {
  code: string;
  name: string;
  flag: string;
};

const languages: Language[] = [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

type LanguageSwitcherProps = {
  currentLocale: string;
};

export const LanguageSwitcher = ({ currentLocale }: LanguageSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0]!;

  const handleLanguageChange = (languageCode: string) => {
    // Get the current pathname without locale prefix
    let pathWithoutLocale = pathname;
    
    // Remove current locale prefix if it exists
    if (currentLocale !== 'zh' && pathname.startsWith(`/${currentLocale}`)) {
      pathWithoutLocale = pathname.replace(`/${currentLocale}`, '');
    }
    
    // Ensure path starts with /
    if (!pathWithoutLocale.startsWith('/')) {
      pathWithoutLocale = `/${pathWithoutLocale}`;
    }
    
    // Build new path based on target language
    let newPath: string;
    if (languageCode === 'zh') {
      // Chinese is default, no prefix needed
      newPath = pathWithoutLocale;
    } else {
      // Other languages need prefix
      newPath = `/${languageCode}${pathWithoutLocale}`;
    }
    
    setIsOpen(false);
    
    // Use router.push for client-side navigation
    router.push(newPath);
    // Also force a page refresh to ensure locale context updates
    router.refresh();
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors",
          "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20",
          "text-sm text-text-main"
        )}
        aria-label="Switch language"
      >
        <span className="text-base">{currentLanguage.flag}</span>
        <span className="hidden sm:inline font-medium">{currentLanguage.name}</span>
        <svg
          className={cn(
            "w-4 h-4 transition-transform",
            isOpen && "rotate-180"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsOpen(false);
              }
            }}
            role="button"
            tabIndex={0}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="py-2">
              {languages.map(language => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={cn(
                    "flex items-center space-x-3 w-full px-4 py-2 text-sm transition-colors",
                    "hover:bg-gray-50 focus:outline-none focus:bg-gray-50",
                    currentLocale === language.code 
                      ? "text-primary bg-primary/5 font-medium" 
                      : "text-text-main"
                  )}
                >
                  <span className="text-base">{language.flag}</span>
                  <span>{language.name}</span>
                  {currentLocale === language.code && (
                    <svg 
                      className="w-4 h-4 ml-auto text-primary" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
