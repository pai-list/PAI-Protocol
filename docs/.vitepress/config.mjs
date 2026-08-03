import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'PAI Protocol (PPP)',
  description: 'Universal Wire Protocol for Autonomous Agents',
  lang: 'en-US',
  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#00D4AA' }],
    ['meta', { name: 'og:title', content: 'PAI Protocol (PPP)' }],
    ['meta', { name: 'og:description', content: 'Universal wire protocol for autonomous agent communication' }],
    ['meta', { name: 'og:image', content: '/og-image.png' }],
  ],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'PAI Protocol (PPP)',
    nav: [
      { text: 'Specification', link: '/spec/message-format', activeMatch: '/spec/' },
      { text: 'Whitepaper', link: '/whitepaper/executive-summary', activeMatch: '/whitepaper/' },
      { text: 'Implementations', link: '/implementations', activeMatch: '/implementations/' },
      { text: 'GitHub', link: 'https://github.com/pai-list/PAI-Protocol' },
    ],
    sidebar: {
      '/spec/': [
        { text: 'Message Format', link: '/spec/message-format' },
        { text: 'Header', link: '/spec/header' },
        { text: 'Body', link: '/spec/body' },
        { text: 'Receipt & TrustChain', link: '/spec/receipt' },
        { text: 'Routing', link: '/spec/routing' },
        { text: 'Error Handling', link: '/spec/error-handling' },
      ],
      '/whitepaper/': [
        { text: 'Executive Summary', link: '/whitepaper/executive-summary' },
        { text: 'Architecture', link: '/whitepaper/architecture' },
      ],
      '/implementations/': [
        { text: 'Overview', link: '/implementations' },
      ],
    },
    editLink: {
      pattern: 'https://github.com/pai-list/PAI-Protocol/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/pai-list/PAI-Protocol' },
      { icon: 'discord', link: 'https://discord.gg/pai-universe' },
      { icon: 'twitter', link: 'https://twitter.com/pai_universe' },
    ],
    footer: {
      message: 'MIT Licensed | Built with ❤️ by PAI Universe',
      copyright: 'Copyright © 2024-present PAI Universe',
    },
    search: {
      provider: 'local',
    },
    ignoreDeadLinks: true,
  },
})