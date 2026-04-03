const ZepterClubSection = () => {
  return (
    <section className="zepter-club">
      <div className="container">
        <div className="zepter-club__top">
          <div className="zepter-club__image-wrap">
            <img
              src="/Zepter-Careers images/ZepteClubPrivileges.png"
              alt="Zepter Club Privileges"
              className="zepter-club__image"
            />

            <img
              src="/Zepter-Careers images/zepterclub_logo 1.png"
              alt="Zepter Club"
              className="zepter-club__logo"
            />
          </div>

          <div className="zepter-club__content">
            <h2 className="zepter-club__title">Vaše privilegije: ZepterClub</h2>

            <p className="zepter-club__text">
              <strong>STATUS ČLANA:</strong> Kupovina Zepter proizvoda uz popuste
              od <strong>–5% do –40%.</strong>
            </p>

            <p className="zepter-club__text">
              <strong>STATUS PARTNERA:</strong> Izgradite sopstveni biznis kao
              konsultant uz provizije od <strong>5% do 40%</strong> i dodatne
              korporativne privilegije.
            </p>

            <button type="button" className="zepter-club__button">
              <span>Postani član</span>
              <span className="zepter-club__button-arrow">›</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ZepterClubSection;