module.exports = {
  title: 'Autocomplete-experimental',
  tagline: 'The new Algolia Autocomplete discovering experience 🔎',
  url: 'https://autocomplete-experimental.netlify.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'algolia', // Usually your GitHub org/user name.
  projectName: 'autocomplete', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Autocomplete-experimental',
      logo: {
        alt: 'Autocomplete-experimental',
        src: 'img/logo.svg',
      },
      links: [
        { to: 'docs/doc1', label: 'Docs', position: 'left' },
        {
          href: 'https://github.com/francoischalifour/autocomplete.js',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Style Guide',
              to: 'docs/doc1',
            },
            {
              label: 'Second Doc',
              to: 'docs/doc2',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Issues',
              to: 'https://github.com/francoischalifour/autocomplete.js/issues',
            },
            {
              label: 'Forum',
              href: 'https://discourse.algolia.com/tags/autocomplete',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/tXdr5mP',
            },
          ],
        },
        {
          title: 'Social',
          items: [
            {
              label: 'Algolia Blog',
              to: 'https://blog.algolia.com/',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/francoischalifour/autocomplete.js',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/docsearch_',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} • Designed and Built by Algolia.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
