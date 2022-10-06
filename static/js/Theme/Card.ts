const Card = {
  // The styles all Cards have in common
  baseStyle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    padding: [4, 4, 4],
    margin: [2, 4, 4],
    borderRadius: 'md',
    boxShadow: 'xl',
  },
  // Two variants: rounded and smooth
  variants: {
    primary: {
        background: 'white',
        color: 'brand.900'
    },
    secondary: {
        background: 'brand.900',
        color: 'white'
    },
  },
  // The default variant value
  defaultProps: {
    variant: 'primary',
  },
};
export default Card;
