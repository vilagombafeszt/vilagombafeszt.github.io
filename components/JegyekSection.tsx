export default function JegyekSection() {
  return (
    <div className="section" id="jegyeket-berleteket">
      <div className="title">Jegyeket, Bérleteket!</div>

      <div className="ticket-status">
        <div className="ticket-badge animate-pulse">ELINDULT A JEGYÉRTÉKESÍTÉS!</div>

        <h2 className="ticket-subtitle">Hangolódjatok a 2026-os ViláGombára!</h2>

        <p className="ticket-text">
          A 2026-os fesztiválra a jegyértékesítés elkezdődött! Csapjatok le minél hamarabb az Early
          Bird jegyekre, mert csak korlátozott számban (és ideig) érhetők el. A legfrissebb
          információkért kövessetek minket a hivatalos Facebook- és Instagram-oldalunkon.
        </p>

        <div className="ticket-links">
          <a
            href="https://www.tixa.hu/vilagomba-2026"
            target="_blank"
            rel="noopener noreferrer"
            className="ticket-link-btn"
          >
            Jegyvásárlás (Tixa)
          </a>
          <a
            href="https://www.facebook.com/vilagombafeszt"
            target="_blank"
            rel="noopener noreferrer"
            className="ticket-link-btn"
          >
            Kövess Facebookon
          </a>
          <a
            href="https://www.instagram.com/vilagombafeszt/"
            target="_blank"
            rel="noopener noreferrer"
            className="ticket-link-btn ticket-link-btn-outline"
          >
            Kövess Instagramon
          </a>
        </div>
      </div>
    </div>
  );
}
