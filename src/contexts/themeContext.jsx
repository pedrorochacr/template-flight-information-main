/* eslint-disable no-unused-vars */
import { createContext, useEffect, useState } from 'react';
import {
  useTemplateVal,
} from '@dsplay/react-template-utils';

export const ThemeContext = createContext({
  globalTheme: {
    primaryColor: '',
    secondaryColor: '',
    lineColor: '',
  },
});

const ThemeContextParent = (props) => {
  const theme = useTemplateVal('theme', '');

  if (!theme.primaryColor) {
    theme.primaryColor = '#008c9e';
  }

  if (!theme.secondaryColor) {
    theme.secondaryColor = '#005f6b';
  }

  if (!theme.lineColor) {
    theme.lineColor = '#cecece';
  }

  // const theme = activeTheme;
  const { children } = props;

  const value = {
    globalTheme: {
      primaryColor: theme.primaryColor,
      secondaryColor: theme.secondaryColor,
      lineColor: theme.lineColor,
    },
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextParent;
