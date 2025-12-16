import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">
        The page you are looking for does not exist.
      </p>
      <Image
        src="/404.jpeg"
        alt="Not Found"
        width={400}
        height={300}
        className="mb-6 rounded-lg"
      />
      <Link
        href="/"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Go Home
      </Link>
    </main>
  );
}
