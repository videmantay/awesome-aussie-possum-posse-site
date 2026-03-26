import { createTheme } from '@mantine/core';

const theme = createTheme({
  primaryColor: 'brown',
  colors: {
    brown: [
      '#fdf4eb',
      '#f3e4d2',
      '#e8c6a1',
      '#dca56c',
      '#d38a42',
      '#c87828',
      '#c06e1e',
      '#a95c14',
      '#96510f',
      '#824404',
    ],
  },
  fontFamily: '"Georgia", serif',
  headings: {
    fontFamily: '"Rio Grande", "Rye", "Georgia", serif',
  },
});

export default theme;
