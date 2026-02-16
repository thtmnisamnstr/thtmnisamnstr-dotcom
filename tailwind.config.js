const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./(components|constant|layouts|pages)/**/*.(ts|tsx)', './data/(blog|authors)/*.mdx'],
  darkMode: 'class',
  theme: {
    extend: {
      spacing: {
        '9/16': '56.25%',
      },
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
      },
      fontFamily: {
        sans: ['Outfit', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: colors.sky,
        gray: colors.gray,
        dark: colors.slate[900],
        code: {
          green: '#b5f4a5',
          yellow: '#ffe484',
          purple: '#d9a9ff',
          red: '#ff8383',
          blue: '#93ddfd',
          white: '#fff',
        },
        twitter: '#1da1f2',
        facebook: '#1877f2',
      },
      width: {
        5.5: '1.375rem',
      },
      height: {
        5.5: '1.375rem',
      },
      cursor: {
        'zoom-in': 'zoom-in',
        'zoom-out': 'zoom-out',
      },
      typography: () => ({
        DEFAULT: {
          css: {
            color: 'var(--vscode-editor-foreground)',
            a: {
              color: 'var(--vscode-text-link-foreground)',
              '&:hover': {
                color: 'var(--vscode-text-link-active-foreground)',
              },
              code: { color: 'var(--vscode-text-link-foreground)' },
            },
            h1: {
              fontWeight: '700',
              letterSpacing: '-0.02em',
              color: 'var(--vscode-editor-foreground)',
            },
            h2: {
              fontWeight: '700',
              letterSpacing: '-0.02em',
              color: 'var(--vscode-editor-foreground)',
            },
            h3: {
              fontWeight: '600',
              color: 'var(--vscode-editor-foreground)',
            },
            h4: {
              fontSize: '1.166667em',
            },
            'h4,h5,h6': {
              color: 'var(--vscode-editor-foreground)',
            },
            code: {
              color: 'var(--vscode-editor-foreground)',
              backgroundColor: 'var(--vscode-text-code-block-background)',
              paddingLeft: '4px',
              paddingRight: '4px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '0.25rem',
              border: '1px solid var(--vscode-editor-group-border)',
            },
            'code::before': {
              content: 'none',
            },
            'code::after': {
              content: 'none',
            },
            hr: { borderColor: 'var(--vscode-editor-group-border)' },
            'ol li::before': {
              fontWeight: '600',
              color: 'var(--vscode-description-foreground)',
            },
            'ul li::before': {
              backgroundColor: 'var(--vscode-description-foreground)',
            },
            strong: { color: 'var(--vscode-editor-foreground)' },
            blockquote: {
              color: 'var(--vscode-editor-foreground)',
              borderLeftColor: 'var(--vscode-text-blockquote-border)',
              backgroundColor: 'var(--vscode-text-blockquote-background)',
            },
          },
        },
        lg: {
          'ol li::marker': {
            content: 'none',
          },
          'ul li::marker': {
            content: 'none',
          },
          ul: {
            paddingLeft: '0px',
          },
          'ul > li': {
            paddingLeft: '0px',
          },
        },
        dark: {
          css: {
            color: 'var(--vscode-editor-foreground)',
            a: {
              color: 'var(--vscode-text-link-foreground)',
              '&:hover': {
                color: 'var(--vscode-text-link-active-foreground)',
              },
              code: { color: 'var(--vscode-text-link-foreground)' },
            },
            h1: {
              fontWeight: '700',
              letterSpacing: '-0.02em',
              color: 'var(--vscode-editor-foreground)',
            },
            h2: {
              fontWeight: '700',
              letterSpacing: '-0.02em',
              color: 'var(--vscode-editor-foreground)',
            },
            h3: {
              fontWeight: '600',
              color: 'var(--vscode-editor-foreground)',
            },
            'h4,h5,h6': {
              color: 'var(--vscode-editor-foreground)',
            },
            hr: { borderColor: 'var(--vscode-editor-group-border)' },
            'ol li:before': {
              fontWeight: '600',
              color: 'var(--vscode-description-foreground)',
            },
            'ul li:before': {
              backgroundColor: 'var(--vscode-description-foreground)',
            },
            strong: { color: 'var(--vscode-editor-foreground)' },
            thead: {
              color: 'var(--vscode-editor-foreground)',
            },
            tbody: {
              tr: {
                borderBottomColor: 'var(--vscode-editor-group-border)',
              },
            },
            blockquote: {
              color: 'var(--vscode-editor-foreground)',
              borderLeftColor: 'var(--vscode-text-blockquote-border)',
              backgroundColor: 'var(--vscode-text-blockquote-background)',
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
