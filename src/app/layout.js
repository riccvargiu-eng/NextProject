import "./globals.css";
import Header from "./components/Header";

export const metadata = {
  title: "Film Picker",
  description: "Select your favorite movies and get a random recommendation",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
