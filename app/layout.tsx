import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Timaitha Vault",
  description:
    "Discover, Explore, and Enjoy the Timaitha Audio Vault - Your Gateway to a World of Music and Creativity.Build your own audio vault, explore trending tracks, and immerse yourself in the vibrant world of music. Join us today and experience the ultimate audio adventure. Designed and Developed by ThunderProbuids",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${roboto.className} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Timaitha Audio Vault",
              applicationCategory: "MultimediaApplication",
              operatingSystem: "All",
              author: {
                "@type": "Person",
                name: "Alique",
                jobTitle: "Full-Stack Software Engineer & Systems Architect",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#0B0F17] text-slate-100">
        {children}
      </body>
    </html>
  );
}
