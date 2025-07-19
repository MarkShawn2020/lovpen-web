import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import {SafeLink} from '@/components/lovpen-ui/safe-link';
import {Container} from './Container';

type FooterLink = {
  name: string;
  href: string;
  status?: string;
  description?: string;
}

const Footer = () => {
  const footerLinks: {
    company: FooterLink[];
    product: FooterLink[];
    support: FooterLink[];
  } = {
    company: [
      {name: '关于我们', href: '/about'},
      {name: '加入我们', href: '#careers'},
      {name: '媒体报道', href: '#press'},
      {name: '博客', href: '/blog'},
    ],
    product: [
      {name: 'LovPen Web', href: '/', status: '当前版本'},
      {name: 'LovPen Sider', href: '#', status: '即将上线', description: '谷歌插件'},
      {name: 'LovPen Clip', href: '#', status: '即将上线', description: 'Mac软件'},
      {name: 'LovPen Obsidian', href: '#', status: '即将上线', description: 'Obsidian排版插件'},
      {name: 'LovPen Desktop', href: '#', status: '即将上线', description: '桌面版'},
      {name: 'LovPen NAS', href: '#', status: '未来规划', description: '硬件中心'},
    ],
    support: [
      {name: '帮助中心', href: '/help'},
      {name: '联系我们', href: '#contact'},
      {name: '服务状态', href: '/status'},
      {name: '隐私政策', href: '/privacy'},
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
                Neurora：AI时代，为创作者而生
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
                公司
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map(link => (
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

            <div className="lg:col-span-2">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">
                产品
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                所有产品共享用户中心、知识库等数据
              </p>
              <ul className="space-y-3">
                {footerLinks.product.map(link => (
                  <li key={link.name}>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <SafeLink
                          href={link.href}
                          className="text-gray-300 hover:text-white transition-colors no-underline"
                        >
                          {link.name}
                        </SafeLink>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          link.status === '当前版本'
? 'bg-green-500 text-white'
                          : link.status === '即将上线'
? 'bg-blue-500 text-white'
                          : 'bg-gray-500 text-white'
                        }`}
                        >
                          {link.status}
                        </span>
                      </div>
                      {link.description && (
                        <span className="text-xs text-gray-400 mt-1">{link.description}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                支持
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

            <div className="lg:col-span-2">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                联系我们
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                有任何问题或建议，欢迎与我们联系。
              </p>
              <div className="flex flex-col gap-2">
                <a 
                  href="mailto:mark@cs-magic.com"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  📧 mark@cs-magic.com
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 Neurora Technology. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <SafeLink
                  href="/terms"
                  className="text-gray-400 hover:text-white text-sm transition-colors no-underline"
                >
                  服务条款
                </SafeLink>
                <SafeLink
                  href="/privacy"
                  className="text-gray-400 hover:text-white text-sm transition-colors no-underline"
                >
                  隐私政策
                </SafeLink>
                <SafeLink
                  href="/cookies"
                  className="text-gray-400 hover:text-white text-sm transition-colors no-underline"
                >
                  Cookie 政策
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
