/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  // Colors are now defined in CSS using @theme directive (Tailwind v4)
  // Keeping minimal config for content paths and dark mode
}
