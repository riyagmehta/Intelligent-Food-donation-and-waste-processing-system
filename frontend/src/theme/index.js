import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const colors = {
  brand: {
    50: '#e6fffa',
    100: '#b2f5ea',
    200: '#81e6d9',
    300: '#4fd1c5',
    400: '#38b2ac',
    500: '#319795',
    600: '#2c7a7b',
    700: '#285e61',
    800: '#234e52',
    900: '#1d4044',
  },
  accent: {
    50: '#fff5f5',
    100: '#fed7d7',
    200: '#feb2b2',
    300: '#fc8181',
    400: '#f56565',
    500: '#e53e3e',
    600: '#c53030',
    700: '#9b2c2c',
    800: '#822727',
    900: '#63171b',
  },
};

const fonts = {
  heading: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
  body: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
};

const styles = {
  global: (props) => ({
    body: {
      bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
      color: props.colorMode === 'dark' ? 'white' : 'gray.800',
    },
  }),
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: '600',
      borderRadius: 'lg',
    },
    variants: {
      solid: (props) => ({
        bg: props.colorMode === 'dark' ? 'brand.400' : 'brand.500',
        color: 'white',
        _hover: {
          bg: props.colorMode === 'dark' ? 'brand.300' : 'brand.600',
          transform: 'translateY(-2px)',
          boxShadow: 'lg',
        },
        _active: {
          bg: props.colorMode === 'dark' ? 'brand.500' : 'brand.700',
          transform: 'translateY(0)',
        },
        transition: 'all 0.2s',
      }),
      ghost: (props) => ({
        _hover: {
          bg: props.colorMode === 'dark' ? 'whiteAlpha.200' : 'brand.50',
        },
      }),
      gradient: {
        bgGradient: 'linear(to-r, brand.400, teal.400)',
        color: 'white',
        _hover: {
          bgGradient: 'linear(to-r, brand.500, teal.500)',
          transform: 'translateY(-2px)',
          boxShadow: 'lg',
        },
        transition: 'all 0.2s',
      },
    },
  },
  Card: {
    baseStyle: (props) => ({
      container: {
        bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
        borderRadius: 'xl',
        boxShadow: props.colorMode === 'dark' ? 'dark-lg' : 'sm',
        border: '1px solid',
        borderColor: props.colorMode === 'dark' ? 'gray.700' : 'gray.100',
        transition: 'all 0.3s',
        _hover: {
          boxShadow: props.colorMode === 'dark' ? '0 0 20px rgba(49, 151, 149, 0.3)' : 'md',
          transform: 'translateY(-2px)',
        },
      },
    }),
  },
  Badge: {
    baseStyle: {
      borderRadius: 'full',
      px: 3,
      py: 1,
      fontWeight: '600',
      fontSize: 'xs',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
  },
  Input: {
    variants: {
      filled: (props) => ({
        field: {
          bg: props.colorMode === 'dark' ? 'gray.700' : 'gray.100',
          borderRadius: 'lg',
          _hover: {
            bg: props.colorMode === 'dark' ? 'gray.600' : 'gray.200',
          },
          _focus: {
            bg: props.colorMode === 'dark' ? 'gray.600' : 'white',
            borderColor: 'brand.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
          },
        },
      }),
    },
    defaultProps: {
      variant: 'filled',
    },
  },
  Select: {
    variants: {
      filled: (props) => ({
        field: {
          bg: props.colorMode === 'dark' ? 'gray.700' : 'gray.100',
          borderRadius: 'lg',
          _hover: {
            bg: props.colorMode === 'dark' ? 'gray.600' : 'gray.200',
          },
          _focus: {
            bg: props.colorMode === 'dark' ? 'gray.600' : 'white',
            borderColor: 'brand.500',
          },
        },
      }),
    },
    defaultProps: {
      variant: 'filled',
    },
  },
  Textarea: {
    variants: {
      filled: (props) => ({
        bg: props.colorMode === 'dark' ? 'gray.700' : 'gray.100',
        borderRadius: 'lg',
        _hover: {
          bg: props.colorMode === 'dark' ? 'gray.600' : 'gray.200',
        },
        _focus: {
          bg: props.colorMode === 'dark' ? 'gray.600' : 'white',
          borderColor: 'brand.500',
        },
      }),
    },
    defaultProps: {
      variant: 'filled',
    },
  },
  Modal: {
    baseStyle: (props) => ({
      dialog: {
        bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
        borderRadius: '2xl',
        boxShadow: '2xl',
      },
      header: {
        fontWeight: '700',
        fontSize: 'xl',
      },
    }),
  },
  Table: {
    variants: {
      simple: (props) => ({
        th: {
          borderColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.200',
          color: props.colorMode === 'dark' ? 'gray.400' : 'gray.600',
          fontWeight: '600',
          textTransform: 'uppercase',
          fontSize: 'xs',
          letterSpacing: '0.5px',
        },
        td: {
          borderColor: props.colorMode === 'dark' ? 'gray.700' : 'gray.100',
        },
        tr: {
          _hover: {
            bg: props.colorMode === 'dark' ? 'gray.700' : 'gray.50',
          },
        },
      }),
    },
  },
  Stat: {
    baseStyle: (props) => ({
      label: {
        color: props.colorMode === 'dark' ? 'gray.400' : 'gray.500',
        fontWeight: '500',
        fontSize: 'sm',
      },
      number: {
        fontWeight: '700',
        fontSize: '3xl',
      },
      helpText: {
        color: props.colorMode === 'dark' ? 'gray.500' : 'gray.500',
        fontSize: 'sm',
      },
    }),
  },
};

const theme = extendTheme({
  config,
  colors,
  fonts,
  styles,
  components,
  shadows: {
    outline: '0 0 0 3px rgba(49, 151, 149, 0.4)',
  },
});

export default theme;
