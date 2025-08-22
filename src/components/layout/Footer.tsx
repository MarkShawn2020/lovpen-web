import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import {SafeLink} from '@/components/lovpen-ui/safe-link';
import {Container} from './Container';
import {useTranslations} from 'next-intl';

type FooterLink = {
  name: string;
  href: string;
  status?: string;
  description?: string;
}

const Footer = () => {
  const t = useTranslations('Footer');
  
  const footerLinks: {
    company: FooterLink[];
    product: FooterLink[];
    support: FooterLink[];
  } = {
    company: [
      {name: t('links.company.about'), href: '#about'},
      {name: t('links.company.careers'), href: '#careers'},
      {name: t('links.company.press'), href: 'https://mp.weixin.qq.com/s/119YaD6JTgI9uZsv-Zl2UQ'},
      {name: t('links.company.blog'), href: '/blog'},
    ],
    product: [
      {name: t('links.product.lovpen_web'), href: '/', status: t('status.current')},
      {name: t('links.product.lovpen_sider'), href: '#', status: t('status.coming_soon')},
      {name: t('links.product.lovpen_clip'), href: '#', status: t('status.coming_soon')},
      {name: t('links.product.lovpen_obsidian'), href: '#', status: t('status.coming_soon')},
      {name: t('links.product.lovpen_desktop'), href: '#', status: t('status.in_development')},
      {name: t('links.product.lovpen_nas'), href: '#', status: t('status.future_plan')},
    ],
    support: [
      {name: t('links.support.help_center'), href: '/help'},
      {name: t('links.support.contact_us'), href: 'mailto:mark@cs-magic.com'},
      {name: t('links.support.service_status'), href: '/status'},
      {name: t('links.support.privacy_policy'), href: '/privacy'},
    ],
  };

  return (
    <footer className="u-theme-dark">
      <Container>
        <div className="py-16 lg:py-24">
          <div className="u-grid-desktop gap-8 lg:gap-16">
            {/* Logo and Description */}
            <div className="lg:col-span-4">
              <Link href="/" className="flex items-center no-underline mb-4">
                <Image
                  src="/assets/images/neurora-logo-white.png"
                  alt="Neurora"
                  width={40}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
              <p className="u-paragraph-m text-gray-300 mb-6">
                {t('company_description')}
              </p>
              <div className="flex space-x-4">
                <a href="https://github.com/markshawn2020" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Links */}
            <div className="lg:col-span-2">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {t('sections.company')}
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map(link => (
                  <li key={link.name}>
                    {link.href.startsWith('http')
? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-white transition-colors no-underline"
                      >
                        {link.name}
                      </a>
                    )
: (
                      <SafeLink
                        href={link.href}
                        className="text-gray-300 hover:text-white transition-colors no-underline"
                      >
                        {link.name}
                      </SafeLink>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">
                {t('sections.product')}
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                {t('product_description')}
              </p>
              <ul className="space-y-3">
                {footerLinks.product.map(link => (
                  <li key={link.name}>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <SafeLink
                          href={link.href}
                          className="text-gray-300 hover:text-white transition-colors no-underline"
                        >
                          {link.name}
                        </SafeLink>
                        {link.description && (
                          <span className="text-xs text-gray-400 mt-1">{link.description}</span>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                        link.status === t('status.current')
                          ? 'bg-[#629A90] text-white'
                        : link.status === t('status.coming_soon')
                          ? 'bg-[#97B5D5] text-white'
                        : link.status === t('status.in_development')
                          ? 'bg-[#C2C07D] text-white'
                        : 'bg-[#87867F] text-white'
                      }`}
                      >
                        {link.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {t('sections.support')}
              </h3>
              <ul className="space-y-3">
                {footerLinks.support.map(link => (
                  <li key={link.name}>
                    <SafeLink
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors no-underline"
                    >
                      {link.name}
                    </SafeLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Partner Logos */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="text-center">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
                {t('sections.partners')}
              </h3>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                <a
                  href="https://booko.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-60 hover:opacity-100 transition-opacity duration-300"
                >
                  <Image
                    src="/bukoo_logo_dark.png"
                    alt="Booko"
                    width={120}
                    height={40}
                    className="h-8 md:h-10 w-auto filter brightness-0 invert"
                  />
                </a>
                <a
                  href="https://puppyagent.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-60 hover:opacity-100 transition-opacity duration-300"
                >
                  <Image
                    src="/puppyagent_logo.png"
                    alt="PuppyAgent"
                    width={120}
                    height={40}
                    className="h-8 md:h-10 w-auto filter brightness-0 invert"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                {t('copyright')}
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <SafeLink
                  href="/terms"
                  className="text-gray-400 hover:text-white text-sm transition-colors no-underline"
                >
                  {t('links.legal.terms')}
                </SafeLink>
                <SafeLink
                  href="/privacy"
                  className="text-gray-400 hover:text-white text-sm transition-colors no-underline"
                >
                  {t('links.legal.privacy')}
                </SafeLink>
                <SafeLink
                  href="/cookies"
                  className="text-gray-400 hover:text-white text-sm transition-colors no-underline"
                >
                  {t('links.legal.cookies')}
                </SafeLink>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export {Footer};
