import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Server Rendering & Server Actions Demo</h1>
      <nav>
        <div>
          <Link href="/posts">Posts (JSONPlaceholder)</Link>
        </div>
        <div>
          <Link href="/movies">Film (TMDB API)</Link>
        </div>
      </nav>
    </main>
  );
}
