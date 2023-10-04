/* eslint-disable no-unused-vars */
import { createContext } from 'react';

export const ThemeContext = createContext({
  globalTheme: {
    primaryColor: '',
    secondaryColor: '',
    lineColor: '',
  },
});

const ThemeContextParent = (props) => {
  const primary = '#008c9e';
  const secondary = '#005f6b';
  const line = '#cecece';

  const { children } = props;

  const value = {
    globalTheme: {
      primaryColor: primary,
      secondaryColor: secondary,
      lineColor: line,
    },
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextParent;
