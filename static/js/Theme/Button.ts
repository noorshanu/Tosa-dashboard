import { theme as baseTheme } from '@chakra-ui/theme';
import { StyleFunctionProps } from "@chakra-ui/theme-tools"

const Button = {
  // The styles all button have in common
  baseStyle: {
    fontWeight: '800',
    // textTransform: 'uppercase',
    borderRadius: 'full', // <-- border radius is same for all variants and sizes
  },
  // Two sizes: sm and md
  sizes: {
    sm: {
      fontSize: 'sm',
      px: 4, // <-- px is short for paddingLeft and paddingRight
      py: 3, // <-- py is short for paddingTop and paddingBottom
    },
    md: {
      fontSize: 'md',
      px: 6, // <-- these values are tokens from the design system
      py: 4, // <-- these values are tokens from the design system
    },
  },
  // Two variants: outline and solid
  variants: {
    primary: (props: StyleFunctionProps) => ({
      ...baseTheme.components.Button.variants.solid(props),
      color: 'white',
      backgroundColor: 'brand.200',
      _hover:{
      backgroundColor: 'brand.100'
      },
      _active:{
        backgroundColor: 'brand.200'
      }
    }),
    secondary: (props: StyleFunctionProps) => ({
      ...baseTheme.components.Button.variants.solid(props),
      color: 'white',
      backgroundColor: 'brand.800',
      _hover: {
        backgroundColor: 'brand.700',
      },
      _active:{
        backgroundColor: 'brand.900'
      }
    }),
  },
  // The default size and variant values
  defaultProps: {
    size: 'md',
    variant: 'outline',
  },
};

export default Button;
