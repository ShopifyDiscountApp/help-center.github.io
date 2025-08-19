import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  // Main sidebar for all pages
  docs: [
    'index',
    {
      type: 'html',
      value:
        '<input id="sidebar-search-input" type="text" placeholder="Search in sidebar..." aria-label="Search in sidebar" />',
      defaultStyle: true,
    },
    'articles/article-1',
    'articles/article-2',
    'articles/article-3',
    'articles/article-4',
  ],
};

export default sidebars;
