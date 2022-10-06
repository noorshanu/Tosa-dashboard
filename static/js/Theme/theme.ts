import {
  extendTheme,
  theme as baseTheme,
  withDefaultColorScheme,
  withDefaultVariant,
} from '@chakra-ui/react';
import Button from 'Theme/Button';
import Text from 'Theme/Text';
import Heading from 'Theme/Heading';
import Card from 'Theme/Card';
import Modal from 'Theme/Modal';
import 'Theme/theme.css';

const theme = extendTheme(
  {
    colors: {
      brand: {
        50: '#EBF8FF',
        100: '#7EA1DE',
        200: '#7EA1DE',
        300: '#63B3ED',
        400: '#4299E1',
        500: '#85AAEB',
        600: '#2B6CB0',
        700: '#2C5282',
        800: '#1E3469',
        900: '#101F43',
        green: '#73F29F',
        red: '#F27373',
        heartIcon: '#FF3E6C',
      },
    },
    fonts: {
      body: `Montserrat, ${baseTheme.fonts.body}`,
      heading: `Montserrat, ${baseTheme.fonts.heading}`,
      mono: `Montserrat, ${baseTheme.fonts.mono}`,
    },
    radii: {
      none: '0',
      sm: '12px',
      base: '24px',
      md: '33px',
      lg: '48px',
      xl: '60px',
      '2xl': '100px',
      '3xl': '140px',
      full: '9999px',
    },
    fontSizes: {
      xs: '9px',
      sm: '11px',
      md: '14px',
      lg: '17px',
      xl: '22px',
      '2xl': '26px',
      '3xl': '32px',
      '4xl': '40px',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
      '8xl': '6rem',
      '9xl': '8rem',
    },
    components: {
      Button,
      Text,
      Heading,
      Card,
      Modal,
    },
  },
  withDefaultColorScheme({
    colorScheme: 'brand',
    components: ['Button'],
  }),
  withDefaultVariant({
    variant: 'primary',
    components: ['Button'],
  }),
);

export default theme;
