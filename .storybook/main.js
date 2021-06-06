const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
    'storybook-addon-performance/register',
    '@storybook/theming'
  ],
  typescript: {
    check: true,
    checkOptions: {
      tsconfig: path.resolve(__dirname, '../tsconfig.json')
    },
    reactDocgen: 'react-docgen'
  }
};
