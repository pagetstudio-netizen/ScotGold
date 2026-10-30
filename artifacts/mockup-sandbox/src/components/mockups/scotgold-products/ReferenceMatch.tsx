import "./_group.css";
import { useState } from "react";

const products = [
  { id: 1, price: "150", daily: "50", days: "100", total: "5 000", image: "vip1.jpg" },
  { id: 2, price: "400", daily: "133", days: "100", total: "13 300", image: "vip2.jpg" },
  { id: 3, price: "600", daily: "200", days: "100", total: "20 000", image: "vip3.jpg" },
  { id: 4, price: "1 000", daily: "333", days: "100", total: "33 300", image: "vip4.jpg" },
];

const navItems = [
  { label: "Accueil", image: "home.png" },
  { label: "Produits", image: "products.png" },
  { label: "Partage", image: "share.png" },
  { label: "Équipe", image: "team.png" },
  { label: "Compte", image: "account.png" },
];

export function ReferenceMatch() {
  const [activeTab, setActiveTab] = useState<"offers" | "owned">("offers");
  const [activeNav, setActiveNav] = useState("Produits");
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

  return (
    <>
      <style>{`
        .scotgold-reference {
          --sg-gold: #e7bd4a;
          --sg-soft-gold: #f3ce67;
          position: relative;
          width: 100%;
          height: 100dvh;
          min-height: 700px;
          overflow: hidden;
          color: #f1eee7;
          background:
            radial-gradient(ellipse at 0% 32%, rgba(126, 93, 27, .13), transparent 25%),
            radial-gradient(ellipse at 100% 79%, rgba(128, 91, 22, .12), transparent 24%),
            #050505;
          font-family: Inter, Arial, sans-serif;
          box-sizing: border-box;
        }
        .scotgold-reference *, .scotgold-reference *::before, .scotgold-reference *::after { box-sizing: border-box; }
        .sg-scroll {
          height: 100%;
          overflow-y: auto;
          padding-bottom: 82px;
          scrollbar-width: none;
        }
        .sg-scroll::-webkit-scrollbar { display: none; }
        .sg-title {
          height: 45px;
          padding-top: 16px;
          color: #d9b84f;
          text-align: center;
          font-size: 23px;
          font-weight: 400;
          letter-spacing: .5px;
          line-height: 29px;
          text-shadow: 0 1px 8px rgba(227, 179, 64, .2);
        }
        .sg-balance {
          position: relative;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          align-items: stretch;
          justify-content: center;
          height: 118px;
          margin: 16px 17px 0;
          overflow: hidden;
          border-radius: 14px;
          color: #17130b;
          background:
            repeating-linear-gradient(171deg, transparent 0 18px, rgba(255,255,255,.12) 19px, transparent 20px 29px),
            linear-gradient(112deg, #e5b936 0%, #f8d674 49%, #e8bc4a 100%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.45), 0 2px 5px rgba(0,0,0,.3);
        }
        .sg-balance-side {
          position: relative;
          z-index: 1;
          display: flex;
          min-width: 0;
          flex-direction: column;
          align-items: center;
          padding-top: clamp(20px, 7vw, 36px);
          color: #17130b;
        }
        .sg-balance-currency { font-size: 13px; line-height: 16px; }
        .sg-balance strong { margin-top: 3px; font-size: clamp(18px, 5vw, 26px); font-weight: 500; line-height: 1.1; white-space: nowrap; }
        .sg-balance-caption { display:flex; align-items:center; gap:7px; margin-top:4px; color:#322916; font-size:clamp(12px, 3vw, 15px); white-space:nowrap; }
        .sg-balance-caption img { display:block; width:22px; height:20px; object-fit:contain; }
        .sg-tabs {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          align-items: stretch;
          height: 55px;
          margin: 20px 17px 0;
          border-bottom: 1px solid rgba(227, 222, 208, .68);
        }
        .sg-tabs button {
          position: relative;
          width: 100%;
          min-width: 0;
          padding: 0 0 11px;
          border: 0;
          background: transparent;
          color: #e9e6df;
          font: inherit;
          font-size: 20px;
          text-align: left;
          cursor: pointer;
        }
        .sg-tabs button:last-child { text-align: right; }
        .sg-tabs button.is-active { color: #e5bd47; }
        .sg-tabs button.is-active::after {
          position: absolute;
          right: 0;
          bottom: -1px;
          left: 0;
          height: 2px;
          background: linear-gradient(90deg, #d7aa34, #f1cf66);
          content: "";
        }
        .sg-product-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 15px;
          padding: 13px 17px 20px;
        }
        .sg-product-card {
          min-width: 0;
          padding: 6px;
          overflow: hidden;
          border: 1px solid #3c3b39;
          border-radius: 14px;
          background: #292929;
          box-shadow: 0 2px 5px rgba(0,0,0,.38);
        }
        .sg-product-photo {
          position: relative;
          aspect-ratio: 1.22;
          overflow: hidden;
          border-radius: 9px;
          background: #4a3517;
        }
        .sg-product-photo img { width: 100%; height: 100%; display: block; object-fit: cover; }
        .sg-product-photo::after {
          position: absolute;
          inset: 55% 0 0;
          background: linear-gradient(transparent, rgba(0,0,0,.76));
          content: "";
        }
        .sg-product-photo span {
          position: absolute;
          z-index: 1;
          bottom: 8px;
          left: 7px;
          color: #fff;
          font-size: 15px;
          line-height: 18px;
          text-shadow: 0 1px 3px #000;
        }
        .sg-metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 68px 68px;
          margin-top: 8px;
          overflow: hidden;
          border: 1px solid #454545;
          border-radius: 8px;
          background: #303030;
        }
        .sg-metric {
          display: flex;
          min-width: 0;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          text-align: center;
        }
        .sg-metric:nth-child(odd) { border-right: 1px solid #494949; }
        .sg-metric:nth-child(-n+2) { border-bottom: 1px solid #494949; }
        .sg-metric strong {
          max-width: 100%;
          overflow: hidden;
          color: #f2f0ec;
          font-size: clamp(11px, 3.3vw, 15px);
          font-weight: 700;
          white-space: nowrap;
        }
        .sg-metric span { color: #d0ceca; font-size: 14px; line-height: 17px; }
        .sg-buy {
          width: 100%;
          height: 40px;
          margin-top: 8px;
          border: 0;
          border-radius: 12px;
          color: #17130b;
          background: linear-gradient(105deg, #dfb33b, #f6d16b);
          font: inherit;
          font-size: 17px;
          cursor: pointer;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.4);
        }
        .sg-buy:active { transform: scale(.985); }
        .sg-empty {
          padding-top: 32px;
          color: #dedbd8;
          text-align: center;
          font-size: 16px;
        }
        .sg-bottom-nav {
          position: absolute;
          z-index: 3;
          right: 0;
          bottom: 0;
          left: 0;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          height: 68px;
          background: #454545;
          box-shadow: 0 -2px 8px rgba(0,0,0,.3);
        }
        .sg-bottom-nav button {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 5px 0 2px;
          border: 0;
          background: transparent;
          color: #aaa18b;
          font: inherit;
          font-size: 14px;
          cursor: pointer;
        }
        .sg-bottom-nav img {
          display: block;
          width: 28px;
          height: 28px;
          object-fit: contain;
          filter: saturate(.78);
          opacity: .78;
        }
        .sg-bottom-nav button.is-current { color: #d7b44a; }
        .sg-bottom-nav button.is-current img { opacity: 1; filter: saturate(1.15); }
        .sg-modal-backdrop {
          position: absolute;
          z-index: 5;
          inset: 0;
          display: grid;
          place-items: center;
          padding: 24px;
          background: rgba(0,0,0,.7);
        }
        .sg-modal {
          width: min(100%, 340px);
          padding: 22px;
          border: 1px solid rgba(237,198,90,.4);
          border-radius: 16px;
          background: #242321;
          text-align: center;
        }
        .sg-modal strong { color: #e7c45d; font-size: 20px; }
        .sg-modal p { color: #e8e4dc; font-size: 14px; }
        .sg-modal button {
          width: 100%;
          padding: 10px;
          border: 0;
          border-radius: 10px;
          background: #e6be4d;
          color: #17130b;
          font: inherit;
          cursor: pointer;
        }
        @media (max-width: 380px) {
          .sg-product-grid { gap: 9px; padding-right: 11px; padding-left: 11px; }
          .sg-tabs { margin-right: 12px; margin-left: 12px; }
          .sg-metrics { grid-template-rows: 62px 62px; }
          .sg-metric span { font-size: 12px; }
        }
      `}</style>
      <main className="scotgold-reference">
      <div className="sg-scroll">
        <header className="sg-title">PRODUITS</header>

        <section className="sg-balance" aria-label="Solde et revenus des produits">
          <div className="sg-balance-side">
            <span className="sg-balance-currency">FCFA</span>
            <strong>0,00</strong>
            <span className="sg-balance-caption">
              <img src="/__mockup/images/scotgold-products/assets.png" alt="" />
              Solde
            </span>
          </div>
          <div className="sg-balance-side">
            <span className="sg-balance-currency">FCFA</span>
            <strong>0,00</strong>
            <span className="sg-balance-caption">
              <img src="/__mockup/images/scotgold-products/income.png" alt="" />
              Mes revenus
            </span>
          </div>
        </section>

        <nav className="sg-tabs" aria-label="Produits">
          <button
            className={activeTab === "offers" ? "is-active" : ""}
            onClick={() => setActiveTab("offers")}
          >
            Liste des produits
          </button>
          <button
            className={activeTab === "owned" ? "is-active" : ""}
            onClick={() => setActiveTab("owned")}
          >
            Mes produits
          </button>
        </nav>

        {activeTab === "offers" ? (
          <section className="sg-product-grid" aria-label="Offres disponibles">
            {products.map((product) => (
              <article className="sg-product-card" key={product.id}>
                <div className="sg-product-photo">
                  <img
                    src={`/__mockup/images/scotgold-products/${product.image}`}
                    alt={`Lingots d’or Scotgold ${product.id}`}
                  />
                  <span>Scotgold {product.id}</span>
                </div>
                <div className="sg-metrics">
                  <div className="sg-metric">
                    <strong>{product.price} FCFA</strong>
                    <span>Prix</span>
                  </div>
                  <div className="sg-metric">
                    <strong>{product.daily} FCFA</strong>
                    <span>Gain / jour</span>
                  </div>
                  <div className="sg-metric">
                    <strong>{product.days}</strong>
                    <span>Jours</span>
                  </div>
                  <div className="sg-metric">
                    <strong>{product.total} FCFA</strong>
                    <span>Gain total</span>
                  </div>
                </div>
                <button className="sg-buy" onClick={() => setSelectedProduct(product.id)}>
                  Acheter
                </button>
              </article>
            ))}
          </section>
        ) : (
          <div className="sg-empty">Aucun enregistrement pour le moment.</div>
        )}
      </div>

      <nav className="sg-bottom-nav" aria-label="Navigation principale">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={activeNav === item.label ? "is-current" : ""}
            onClick={() => setActiveNav(item.label)}
          >
            <img src={`/__mockup/images/scotgold-products/${item.image}`} alt="" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {selectedProduct !== null && (
        <div className="sg-modal-backdrop" onClick={() => setSelectedProduct(null)}>
          <section
            className="sg-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Confirmation d’achat"
            onClick={(event) => event.stopPropagation()}
          >
            <strong>Scotgold {selectedProduct}</strong>
            <p>Confirmer l’achat de ce produit&nbsp;?</p>
            <button onClick={() => setSelectedProduct(null)}>Fermer</button>
          </section>
        </div>
      )}
      </main>
    </>
  );
}

export default ReferenceMatch;
