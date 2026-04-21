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
  fontFamily: '"Baloo 2", "Bubblegum Sans", sans-serif',
  headings: {
    fontFamily: '"Rye", cursive',
  },
  other: {
    handwrittenFont: '"Patrick Hand", cursive',
    funFont: '"Bangers", cursive',
    bodyFont: '"Baloo 2", sans-serif',
  },
});

export default theme;
