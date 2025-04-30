
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				inter: ['Inter', 'system-ui', 'sans-serif'],
			},
			letterSpacing: {
				tight: '-0.05em',
			},
			colors: {
				border: '#DDDDDD',
				input: '#DDDDDD',
				ring: '#286EF1',
				background: '#FFFFFF',
				foreground: '#212123',
				primary: {
					DEFAULT: '#286EF1',
					foreground: '#FFFFFF'
				},
				secondary: {
					DEFAULT: '#F9F9FA',
					foreground: '#212123'
				},
				destructive: {
					DEFAULT: '#D64141',
					foreground: '#FFFFFF'
				},
				muted: {
					DEFAULT: '#F5F5F7',
					foreground: '#616165'
				},
				accent: {
					DEFAULT: '#286EF1',
					foreground: '#FFFFFF'
				},
				popover: {
					DEFAULT: '#FFFFFF',
					foreground: '#212123'
				},
				card: {
					DEFAULT: '#FFFFFF',
					foreground: '#212123'
				},
				sidebar: {
					DEFAULT: '#292F34',
					foreground: '#FFFFFF',
					primary: '#292F34',
					'primary-foreground': '#FFFFFF',
					accent: '#286EF1',
					'accent-foreground': '#FFFFFF',
					border: '#3D4548',
					ring: '#286EF1'
				},
                eco: {
                    purple: '#9b87f5',
                    dark: '#1A1F2C',
                    gray: '#8F8F91',
                    lightPurple: '#D6BCFA',
                    softGray: '#F1F0FB',
                },
                success: '#1FCC83',
                warning: '#FFC846',
                error: '#D64141',
                'text-secondary': '#616165',
                'text-tertiary': '#8F8F91',
			},
			borderRadius: {
				lg: '8px',
				md: '6px',
				sm: '4px'
			},
			boxShadow: {
				'card': '0 1px 6px rgba(0,0,0,0.05)',
				'modal': '0 4px 20px rgba(0,0,0,0.15)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
                'slide-in-right': {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(0)' }
                },
                'slide-out-right': {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(100%)' }
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                'fade-out': {
                    '0%': { opacity: '1' },
                    '100%': { opacity: '0' }
                },
				'pulse-blue': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
                'slide-in-right': 'slide-in-right 0.3s ease-out',
                'slide-out-right': 'slide-out-right 0.3s ease-out',
                'fade-in': 'fade-in 0.3s ease-out',
                'fade-out': 'fade-out 0.3s ease-out',
				'pulse-blue': 'pulse-blue 1.5s ease-in-out infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
