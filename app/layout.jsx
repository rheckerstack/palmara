import "./globals.css";

export const metadata = {
  title: "Palmara",
  description: "Palm · Zodiac · Soul",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
