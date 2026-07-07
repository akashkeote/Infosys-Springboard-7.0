import "./globals.css";
import UMANGChatbot from "@/components/UMANGChatbot";
import { LangProvider } from "@/lib/i18n";

export const metadata = {
  title: "GovGrant Tracker — Government Subsidy & Grant Dashboard",
  description:
    "Track, discover, and apply for 4,680+ government subsidies and grants across India. Real-time analytics, AI-powered eligibility matching, and disbursement tracking.",
  keywords:
    "government schemes, subsidies, grants, India, PM schemes, state schemes, welfare, UMANG, MyScheme",
  openGraph: {
    title: "GovGrant Tracker — Government Subsidy & Grant Dashboard",
    type: "website",
    siteName: "GovGrant Tracker",
    description:
      "UMANG-integrated platform for tracking all Indian government subsidy and grant schemes.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#7c3aed" />
      </head>
      <body>
        <LangProvider>
          {children}
          <UMANGChatbot />
        </LangProvider>
      </body>
    </html>
  );
}
