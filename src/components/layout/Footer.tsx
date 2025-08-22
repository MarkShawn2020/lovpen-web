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
                <svg
                  width={40}
                  height={40}
                  viewBox="0 0 435.55 477.03"
                  className="h-10 w-auto fill-white"
                >
                  <g>
                    <path d="M0,0L0,0v269.62c0,68.71,55.7,124.45,124.45,124.45l0,0V124.45C124.45,55.73,68.74,0,0,0z"/>
                    <path d="M155.55,82.96L155.55,82.96v269.62c0,68.71,55.7,124.45,124.45,124.45l0,0V207.41C280,138.67,224.29,82.96,155.55,82.96z"/>
                    <path d="M311.1,40.27v248.86c68.71,0,124.45-55.7,124.45-124.45S379.84,40.27,311.1,40.27z"/>
                  </g>
                </svg>
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
                  href="https://terracottasec.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group opacity-60 hover:opacity-100 transition-all duration-300"
                >
                  <Image
                    src="/terracottasec_logo.png"
                    alt="Terracotta"
                    width={120}
                    height={40}
                    className="h-8 md:h-10 w-auto filter grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </a>
                <a
                  href="https://puppyagent.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group opacity-60 hover:opacity-100 transition-all duration-300"
                >
                  <Image
                    src="/puppyagent_logo.png"
                    alt="PuppyAgent"
                    width={120}
                    height={40}
                    className="h-8 md:h-10 w-auto filter grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </a>
                <a
                  href="https://featbit.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group opacity-60 hover:opacity-100 transition-all duration-300"
                >
                  <Image
                    src="/logo/featbit_logo.png"
                    alt="FeatBit"
                    width={120}
                    height={40}
                    className="h-8 md:h-10 w-auto filter grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </a>
                <div className="group opacity-60 hover:opacity-100 transition-all duration-300">
                  <a
                    href="https://grimo.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 no-underline"
                  >
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 824 824"
                      className="h-8 md:h-10 w-auto filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    >
                      <rect width="824" height="824" rx="183" fill="#FAFAFA"/>
                      <path d="M223.79 603V563.4H162.374V260.6H223.79V221H122.719V603H223.79Z" fill="#37363A"/>
                      <path d="M382.464 603V563.4H321.04V260.599H382.464V220.999H281.393V603H382.464Z" fill="#5E4DB2" fillOpacity="0.8"/>
                      <path d="M502.007 563.009H440.192V602.602H541.263V220.999H440.192V260.599H502.007V563.009Z" fill="#5E4DB2" fillOpacity="0.8"/>
                      <path d="M661.455 563.011H599.64V602.603H700.719V221H599.64V260.6H661.455V563.011Z" fill="#37363A"/>
                    </svg>
                    <span className="text-gray-400 group-hover:text-white font-semibold text-lg md:text-xl transition-all duration-300">
                      Grimo.ai
                    </span>
                  </a>
                </div>
                <div className="group opacity-60 hover:opacity-100 transition-all duration-300">
                  <a
                    href="https://shareai-lab.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 no-underline"
                  >
                    <svg
                      width="30"
                      height="30"
                      viewBox="15 21 153 158"
                      className="h-8 md:h-10 w-auto filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    >
                      <path d="M103.5,178.6c-20.7,1.4-46.1-7-63.1-24.7C18,130.7,10.1,104.6,18.2,73.2c1.5-5.9,4.9-9.1,11-8.4c9.6,1.1,14,6.8,12.1,15.7c-7,33.4,13.4,69.6,45.7,81.3c27.3,9.8,52.1,5.4,74.6-12.9c1.1-0.9,5.3-4.1,6.4-5C162.9,155.3,137.1,176.4,103.5,178.6z" fill="#1730C6"/>
                      <path d="M45,94.7C41.6,65,50.4,41.4,74.4,24.2c4.2-3.4,10.4-4.6,14.1,1c3.7,5.6,3.1,10.9-2.2,15C70.5,52.4,62.9,68.8,61.7,89c-1.6,27.5,17.6,55.4,43.4,62.3c6.2,1.7,13,2.3,20.7,3.3c-6.3,1.1-13.3,1.7-19.2,1.1c-19-2.1-35.7-10.3-46.9-26.5C53.7,120.5,46.7,109.9,45,94.7z" fill="#033CDD"/>
                      <path d="M82.3,127.2c-13.7-17.6-16.1-38-8.5-59.4c11.4-32,46.6-47.7,76.5-34.5c7.3,3.2,8.9,5.8,6.9,11.3c-2.4,6.6-5.8,8-13.1,5.4c-22.6-8-45-1-58.5,19.1c-10.3,15.4-12,32.3-5.2,49.9c0.6,1.5,1.1,2.9,1.7,4.3c0.5,1.1,3.5,7.1,3.5,7.1S84,129.3,82.3,127.2z" fill="#15BCC8"/>
                    </svg>
                    <span className="text-gray-400 group-hover:text-white font-semibold text-lg md:text-xl transition-all duration-300">
                      ShareAI
                    </span>
                  </a>
                </div>
                <a
                  href="https://www.bukoo.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group opacity-60 hover:opacity-100 transition-all duration-300"
                >
                  <Image
                    src="/bukoo_logo_dark.png"
                    alt="Bukoo"
                    width={100}
                    height={33}
                    className="h-7 md:h-8 w-auto filter grayscale hover:grayscale-0 transition-all duration-300"
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
