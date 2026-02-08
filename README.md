This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Backend Connection Configuration

The frontend application connects to the backend API using an environment variable `NEXT_PUBLIC_API_URL`. This variable defines the base URL for all API requests.

**Development Environment:**
In the development environment, if `NEXT_PUBLIC_API_URL` is not explicitly set, it defaults to `http://localhost:3000/api/v1`. This allows for local development against a local backend server.

**Production and Other Environments:**
For production deployments (or any other environment like staging, etc.), it is crucial to set the `NEXT_PUBLIC_API_URL` environment variable to the actual URL of your deployed backend API.

**Example:**

If your backend API is deployed at `https://api.yourdomain.com/api/v1`, you should set the environment variable as follows:

```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
```

**How to set environment variables:**

*   **Vercel:** You can set environment variables in your Vercel project settings under "Environment Variables".
*   **Other Hosting Platforms:** Refer to your hosting provider's documentation for instructions on how to set environment variables.
*   **Local Development:** Create a `.env.local` file in the root of your project and add the variable there (e.g., `NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1`). This file should *not* be committed to version control.

## Google OAuth Configuration

The frontend application uses Google OAuth for user authentication. To enable this, you need to configure the `NEXT_PUBLIC_GOOGLE_CLIENT_ID` environment variable.

**How to get your Google Client ID:**

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Select your project or create a new one.
3.  Navigate to "APIs & Services" > "Credentials".
4.  Create an "OAuth client ID" for a "Web application".
5.  You will get a Client ID.

**Configuring the `NEXT_PUBLIC_GOOGLE_CLIENT_ID`:**

*   **Vercel:** Set the `NEXT_PUBLIC_GOOGLE_CLIENT_ID` environment variable in your Vercel project settings under "Environment Variables".
*   **Local Development:** Create a `.env.local` file in the root of your project and add the variable there (e.g., `NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID`). This file should *not* be committed to version control.
