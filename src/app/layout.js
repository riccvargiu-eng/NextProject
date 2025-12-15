import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <header className="bg-gray-800 text-white p-4 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-xl font-bold hover:text-gray-300">
              Movie Picker
            </Link>
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
            >
              Home
            </Link>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
