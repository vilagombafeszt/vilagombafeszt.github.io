'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

function useRandomImage(jsonUrl: string, folder: string) {
  const [src, setSrc] = useState('');

  useEffect(() => {
    fetch(jsonUrl)
      .then<string[]>((r) => r.json())
      .then((files) => {
        const idx = Math.floor(Math.random() * files.length);
        setSrc(`/${folder}/${files[idx]}`);
      })
      .catch(console.error);
  }, [jsonUrl, folder]);

  return src;
}

export default function KeptarSection() {
  const album1Src = useRandomImage('/images.json',  'index_pictures');
  const album2Src = useRandomImage('/images2.json', 'index_pictures2');

  return (
    <div className="section" id="keptar">
      <div className="title">Képtár</div>

      <div className="albums-container">
        <a className="album-container" href="https://photos.app.goo.gl/5kMuzpd7iqXdGfGV7" target="_blank" rel="noopener noreferrer">
          {album1Src && (
            <Image
              className="album-img"
              src={album1Src}
              alt="Világomba 2024"
              width={800}
              height={600}
              unoptimized
              loading="lazy"
            />
          )}
          <div className="overlay-text">ViláGomba 2024</div>
        </a>

        <a className="album-container" href="https://photos.app.goo.gl/njhqn6NmA3wEk73H7" target="_blank" rel="noopener noreferrer">
          {album2Src && (
            <Image
              className="album-img"
              src={album2Src}
              alt="Világomba 2025"
              width={800}
              height={600}
              unoptimized
              loading="lazy"
            />
          )}
          <div className="overlay-text2">ViláGomba 2025</div>
        </a>
      </div>

      <div className="gallery-caption">
        Kattints a képre a teljes galéria megtekintéséhez!
      </div>

      <div className="gallery-credit">
        <span>Képeket készítette: </span>
        <a href="https://www.instagram.com/g.adam.llery/" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-instagram" />
          Kovács Ádám
        </a>
      </div>
    </div>
  );
}
