/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary Stigg Brand Colors
        'stigg': {
          50: '#fef7f7',
          100: '#fdeaea',
          200: '#fbd5d5',
          300: '#f7b3b3',
          400: '#f18585',
          500: '#e85a5a',
          600: '#d63939',
          700: '#b52d2d',
          800: '#962929',
          900: '#7d2727',
          950: '#441111',
        },
        // Professional Color Palette
        'stigg-red': '#8B1538',      // Primary brand red - WCAG AA compliant
        'stigg-red-dark': '#6B1028', // Darker variant for better contrast
        'stigg-red-light': '#A61E42', // Lighter variant for backgrounds
        'stigg-dark': '#0f172a',     // Darker for better contrast
        'stigg-dark-light': '#1e293b', // Lighter dark variant
        'stigg-gray': {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        // High contrast text colors
        'text-primary': '#0f172a',   // Dark blue-gray for primary text
        'text-secondary': '#374151', // Medium gray for secondary text
        'text-muted': '#6b7280',     // Light gray for muted text
        'stigg-blue': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Accent Colors
        'stigg-accent': '#0f172a',   // Deep navy - high contrast
        'stigg-success': '#047857',  // Darker green for better contrast
        'stigg-success-light': '#d1fae5', // Light green background
        'stigg-warning': '#b45309',  // Darker orange for better contrast
        'stigg-warning-light': '#fef3c7', // Light orange background
        'stigg-error': '#b91c1c',    // Darker red for better contrast
        'stigg-error-light': '#fee2e2', // Light red background
        'stigg-info': '#1e40af',     // Blue for info messages
      }
    },
  },
  plugins: [],
};