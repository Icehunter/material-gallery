import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import React from 'react';
import { addDecorator } from '@storybook/react';
import { create } from '@storybook/theming/create';
import pkg from '../package.json';
import { withPerformance } from 'storybook-addon-performance';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  options: {
    theme: create({
      base: 'light',
      fontBase: '"Roboto", sans-serif',
      fontCode: 'monospace',
      brandTitle: `Material Gallery ${pkg.version}`,
      brandUrl: 'https://github.com/Icehunter/material-gallery'
    }),
    storySort: {
      order: ['Introduction']
    }
  },
  controls: { expanded: true },
  layout: 'fullscreen'
};

addDecorator(withPerformance);

export const decorators = [
  (Story) => {
    const defaultTheme = createMuiTheme({
      palette: {
        type: 'light'
      }
    });

    return (
      <ThemeProvider theme={defaultTheme}>
        <div
          style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center'
          }}>
          <Story />
        </div>
      </ThemeProvider>
    );
  }
];
