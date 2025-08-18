import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  // Main sidebar for all pages
  docs: [
    'index',
    {
      type: 'category',
      label: 'Articles',
      items: [
        'articles/article-1',
        'articles/article-2',
        'articles/article-3',
        'articles/article-4',
      ],
    },
  ],
};

export default sidebars;
