import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ padding: '20px', textAlign: 'center', color: 'white' }}>
      <h1>404 - Az oldal nem található</h1>
      <p>A keresett oldal nem létezik.</p>
      <Link href="/hu" style={{ color: 'lightblue' }}>
        Vissza a főoldalra
      </Link>
    </div>
  );
}
