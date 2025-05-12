# SOLITUDE - AI-Powered 2D & 3D Asset Marketplace

SOLITUDE is a web application designed to be a central hub for 2D and 3D creative assets. It features a marketplace, a community forum, asset uploading capabilities, and AI-powered tools for generating reference images and simple 3D assets.

## Core Features

*   **User Authentication:** Secure user registration and login system.
*   **Asset Marketplace:** Browse, search, filter, and sort 2D and 3D assets.
*   **Asset Upload:** Allows authenticated users to upload their own assets (images, ZIP archives for 3D models) with descriptions, tags, and pricing.
*   **Asset Request Forum:** A community space for users to request specific assets and discuss ideas. Users can create posts and reply to existing ones.
*   **AI-Powered Reference Image Generation:** Generate reference images based on text prompts using Google's Generative AI.
*   **AI-Powered Simple 3D Asset Generation:** Generate basic 3D shapes (cubes, spheres, pyramids, cylinders, flat squares, flat circles) as downloadable `.stl` files based on text prompts.
*   **Shopping Cart & Checkout:** Add assets to a cart and simulate a checkout process with local Bangladeshi payment methods (bKash, Nagad - simulated).
*   **User Profiles:** View basic user information and manage uploaded assets (mocked for now).

## Technology Stack

*   **Frontend:** Next.js (React Framework), TypeScript
*   **Styling:** Tailwind CSS, Shadcn UI (for pre-built components)
*   **State Management:** React Context API
*   **Forms:** React Hook Form with Zod for validation
*   **Database:** SQLite (using `better-sqlite3` for local data persistence)
*   **AI Integration:** Genkit with Google AI (for image generation)
*   **Icons:** Lucide React

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm or yarn

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd solitude-asset-hub 
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root of your project and add your Google Generative AI API key. This is required for the AI Reference Image Generation feature.
    ```env
    GOOGLE_GENAI_API_KEY=your_google_genai_api_key_here
    ```
    You can obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application will typically be available at `http://localhost:9002`.

5.  **Database:**
    The application uses SQLite for data persistence. The database file (`solitude.db`) will be automatically created in a `database` folder in the project root when the application first starts and interacts with data (e.g., user registration, asset upload).

## Available Scripts

In the project directory, you can run:

*   `npm run dev`: Runs the app in development mode.
*   `npm run build`: Builds the app for production.
*   `npm run start`: Starts the production server (after building).
*   `npm run lint`: Lints the codebase.
*   `npm run genkit:dev`: Starts the Genkit development server (if you need to inspect or test flows directly).

## Project Structure (Simplified)

```
/
├── database/             # SQLite database file will be created here
├── public/               # Static assets
├── src/
│   ├── actions/          # Server Actions for database interactions
│   ├── ai/               # Genkit AI flows and configuration
│   ├── app/              # Next.js App Router (pages and layouts)
│   ├── components/       # Reusable UI components (Shadcn UI, custom)
│   ├── contexts/         # React Context providers for global state
│   ├── data/             # Mock data (initially empty for dynamic data)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions, database connection
│   ├── types/            # TypeScript type definitions
├── .env                  # Environment variables (needs to be created)
├── next.config.ts
├── package.json
└── tsconfig.json
```

## Contributing

This project is primarily for demonstration purposes. If you'd like to contribute, please feel free to fork the repository and submit pull requests.

## License

This project is unlicensed.
