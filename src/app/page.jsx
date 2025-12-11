import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Film Picker</h1>
      <nav>
        <div>
          <Link href="/movies">Film</Link>{" "}
          {/* collegamento alla pagina dei film */}
        </div>
      </nav>
    </main>
  );
}
