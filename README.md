# Surgery Status Board

A modern web application that allows surgery center personnel to collect patient information and track the progress of their surgery. This will be displayed in the surgical waiting room so loved ones can track patient progress.

[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## ✨ Features

### 🔍 Advanced Search Capabilities

- **Add/Update Patient Info** - Add/Update Patient Info with valid input
- **Search Patient** - Search specific patient by patient name and patient ID
- **Display Patient Status** - Displays a screen showing the status of all surgical patients

### 🤖 AI-Powered Assistant

- **Google Gemini Integration** - Powered by Google's latest AI model
- **Interactive Chat Interface** - Natural conversation experience
- **Context-Aware Responses** - AI understands the application context
- **Predefined Queries** - Quick access to common questions

### 🎨 Modern UI/UX

- **Responsive Design** - Mobile-first approach
- **Loading States** - Animated placeholders and smooth transitions
- **Modern Components** - Built with shadcn/ui components
- **Accessible Design** - Follows WCAG accessibility guidelines

## 🛠 Tech Stack

### Frontend

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tooling and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern, accessible UI components

### AI & APIs

- **Google Generative AI** - Gemini 1.5 Flash model

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm**
- **Git**

You'll also need accounts and API keys for:

- Google Gemini API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/chingu-voyages/V56-tier2-team-21.git
   cd V56-tier2-team-21
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   # API Configuration
  VITE_SERVER_BASE_URL= window.location.origin
  VITE_API_URL = https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCiFHmkBcLWoE52DR2fPJ9aDlmRyUpKAMg

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Start the application**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to `http://localhost:5173` to view the application.

#### Google Gemini API Setup

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Create a new API key
3. Add the key to your `.env` file


## 🤝 Contributing

We welcome contributions to Resource Finder! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add tests for new features
- Ensure responsive design
- Follow accessibility guidelines

## 📝 License

This project is part of the Chingu Voyage 55 Tier 2 Team 21 collaboration. It is created for educational purposes and community learning.

## 👥 Team Members

- [@elva329](https://github.com/elva329) - Full Stack Developer
- [@tulsishuka](https://github.com/tulsishuka) - Full Stack Developer
- [@Amaljithuk](https://github.com/Amaljithuk) - Full Stack Developer
- [@satyambalaiwar](https://github.com/satyambalaiwar) - Full Stack Developer

## 🙏 Acknowledgments

- **Chingu** - For providing the platform and community for collaborative learning
- **Discord Community** - For the valuable resources in the `#resource-treasures` channel
- **Google** - For the Gemini AI API
- **The Open Source Community** - For the amazing tools and libraries that made this project possible

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/chingu-voyages/V56-tier2-team-21/issues) page
2. Create a new issue with detailed information
3. Reach out to the team members

---

**Built with ❤️ by Chingu Voyage 56 Tier 2 Team 21**
