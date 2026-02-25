export default function JegyekSection() {
  return (
    <div className="section" id="jegyeket-berleteket">
      <div className="title">Jegyeket, Bérleteket!</div>

      <div className="ticket-status">
        <div className="ticket-badge">JEGYÉRTÉKESÍTÉS LEZÁRULT</div>

        <h2 className="ticket-subtitle">Köszönjük, hogy velünk voltatok 2025-ben!</h2>

        <p className="ticket-text">
          Jelenleg nincs aktív jegyértékesítés. A következő ViláGomba Fesztivál időpontjával és
          jegyinformációkkal kapcsolatban itt, a hivatalos Facebook- és Instagram-oldalunkon
          jelentkezünk.
        </p>

        <div className="ticket-links">
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
