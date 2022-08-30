/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
        './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
        './src/styles/base.css'
    ],
	theme: {
		extend: {
            colors: {
                'youtube': '#f40407',
            },
        },
	},
	plugins: [],
}
