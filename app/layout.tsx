import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moodify",
  description: "Create personalized Spotify playlists based on your mood",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

