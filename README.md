# Schedule B Code Search Application

A modern React + TypeScript application for searching and classifying products using the US Census Bureau's Schedule B classification system.

## Features

- 🔍 **Interactive Product Classification** - Guided question flow to accurately classify products
- 📊 **Hierarchical Code Display** - Tree view of Schedule B codes with expandable sections
- 💾 **Code Selection & Export** - Select and copy Schedule B codes with descriptions
- 🎨 **Modern UI** - Built with React 19, TypeScript, and Tailwind CSS
- ✅ **Fully Tested** - Integration tests with Vitest
- 🚀 **Production Ready** - Deployed to Vercel with serverless functions

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Testing**: Vitest with @testing-library/react
- **Deployment**: Vercel (with serverless functions)
- **API**: US Census Bureau 3CE Classification API

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd gmt-schedule-b

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev

# App will be available at http://localhost:5173/
```

The development server includes a proxy to the Census API, so no additional configuration is needed.

### Testing

```bash
# Run tests
npm test

# Run tests with UI
npm test:ui

# Run tests once (for CI)
npm test:run
```

See [TESTING.md](./TESTING.md) for detailed testing documentation.

### Building for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## Project Structure

```
gmt-schedule-b/
├── api/                          # Vercel serverless functions
│   ├── classify.ts              # Classification API proxy
│   └── schedule-b.ts            # Schedule B lookup proxy
├── src/
│   ├── api/                     # API client
│   │   ├── classifyApi.ts      # Main API functions
│   │   └── __tests__/          # Integration tests
│   ├── components/              # React components
│   │   ├── SearchInput.tsx     # Product search input
│   │   ├── QuestionPanel.tsx   # Drill-down questions
│   │   ├── KnownCharacteristics.tsx  # Answer breadcrumbs
│   │   ├── ScheduleBTable.tsx  # Hierarchical code tree
│   │   └── SelectedCodeDisplay.tsx   # Final code display
│   ├── hooks/                   # Custom React hooks
│   │   ├── useClassify.ts      # Classification state machine
│   │   └── useScheduleBFind.ts # Schedule B data fetching
│   ├── types/                   # TypeScript type definitions
│   │   └── census.ts           # Census API types
│   ├── App.tsx                  # Main application component
│   └── main.tsx                 # Application entry point
├── vite.config.ts              # Vite configuration
├── vitest.config.ts            # Test configuration
├── vercel.json                  # Vercel deployment config
└── tailwind.config.js          # Tailwind CSS configuration
```

## How It Works

1. **User enters product description** - e.g., "coffee beans"
2. **Classification API analyzes** - Sends to Census Bureau API
3. **Guided questions** - System asks clarifying questions
4. **HS Code generated** - Based on user answers
5. **Schedule B codes displayed** - Hierarchical tree of related codes
6. **User selects final code** - Choose the most specific code

## API Architecture

### Development
- Vite proxy handles API requests
- Direct connection to Census API
- Fast and simple for local development

### Production
- Vercel serverless functions proxy requests
- Handles CORS and authentication
- Secure and scalable

See [TESTING-SETUP-SUMMARY.md](./TESTING-SETUP-SUMMARY.md) for detailed architecture diagrams.

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Or deploy to production
vercel --prod
```

The serverless functions in `/api/` are automatically deployed and configured.

### Environment Variables

No environment variables are required for basic functionality. All configuration is handled automatically.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI
- `npm run test:run` - Run tests once
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run tests: `npm test`
6. Submit a pull request

## License

[Your License Here]

## Acknowledgments

- US Census Bureau for the 3CE Classification API
- Built with modern web technologies
