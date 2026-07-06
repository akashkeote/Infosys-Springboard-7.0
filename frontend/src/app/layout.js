import "./globals.css";

export const metadata = {
  title: "GovGrant Tracker — Government Subsidy & Grant Dashboard",
  description:
    "Track, discover, and apply for 4,600+ government subsidies and grants across India. Real-time analytics, AI-powered eligibility matching, and disbursement tracking.",
  keywords:
    "government schemes, subsidies, grants, India, PM schemes, state schemes, welfare",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
