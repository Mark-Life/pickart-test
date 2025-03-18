# PickArt


## 🚀 Tech Stack

- [Next.js](https://nextjs.org/) - React framework for production
- [TypeScript](https://www.typescriptlang.org/) - Static type checking
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [pnpm](https://pnpm.io/) - Fast, disk space efficient package manager

## 📋 Prerequisites

- Node.js 18.x or later
- pnpm 8.x or later

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pickart-next
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env.local` file in the root directory and add necessary environment variables:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 📦 Project Structure

```
pickart-next/
├── app/                    # App router directory
│   ├── api/               # API routes
│   ├── components/        # React components
│   ├── lib/               # Utility functions and shared logic
│   └── styles/            # Global styles
├── public/                # Static files
├── types/                 # TypeScript type definitions
└── tests/                 # Test files
```

## 🧪 Testing

Run the test suite:

```bash
pnpm test
```

Run tests in watch mode:

```bash
pnpm test:watch
```

## 🚀 Deployment

The application can be deployed using [Vercel](https://vercel.com) or any other hosting platform that supports Next.js applications.

```bash
pnpm build
```

## 🔧 Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build production bundle
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- All contributors who participate in this project