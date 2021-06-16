import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { CssBaseline } from '@material-ui/core';
import React from 'react';
import { addDecorator } from '@storybook/react';
import { create } from '@storybook/theming/create';
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
      fontCode: 'monospace'
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
  (Story, { args }) => {
    const defaultTheme = createMuiTheme({
      palette: {
        type: args.themePaletteType ?? 'light'
      }
    });

    return (
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <Story />
      </ThemeProvider>
    );
  }
];
