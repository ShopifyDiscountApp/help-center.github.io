/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
    title: 'Help Center',
    url: 'https://shopifydiscountapp.github.io',
    baseUrl: '/help-center/',
    organizationName: 'shopifyDiscountApp',
    projectName: 'help-center.github.io',
    favicon: 'img/favicon.ico',
    trailingSlash: false,
    clientModules: ['./src/clientModules/sidebarSearch.js'],
    presets: [
      [
        '@docusaurus/preset-classic',
        {
          docs: {
            sidebarPath: './sidebars.ts',
            routeBasePath: '/',
            editUrl: undefined,
          },
          blog: false,
          theme: {
            customCss: './src/css/custom.css',
          },
        },
      ],
    ],
    themeConfig: {
      navbar: {
        title: 'Help Center',
        items: [
          { type: 'search', position: 'right' },
        ],
      },
    },
  };
  