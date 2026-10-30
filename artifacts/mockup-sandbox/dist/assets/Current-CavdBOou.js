import{j as e}from"./index-_ve1TrR4.js";/* empty css               */const t=[{label:"Recharger",image:"/__mockup/images/scotgold-home/current-recharge.png"},{label:"Retrait",image:"/__mockup/images/scotgold-home/current-withdraw.png"},{label:"Service",image:"/__mockup/images/scotgold-home/current-service.png"},{label:"Télécharger",image:"/__mockup/images/scotgold-home/current-download.png"}];function o(){return e.jsxs("main",{className:"current-home",children:[e.jsxs("div",{className:"current-home-shell",children:[e.jsxs("section",{className:"current-hero","aria-label":"Scotgold Resources Ltd. et ses projets aurifères en Écosse",children:[e.jsx("img",{src:"/__mockup/images/scotgold-home/current-hero.jpg",alt:"Lingots d’or"}),e.jsxs("div",{className:"current-hero-copy","aria-hidden":"true",children:[e.jsx("span",{children:"Scotgold Resources Ltd."}),e.jsx("span",{children:"Exploration aurifère"}),e.jsx("span",{children:"en Écosse"})]})]}),e.jsx("section",{className:"current-actions","aria-label":"Actions rapides",children:t.map(r=>e.jsxs("button",{type:"button",className:"current-action",children:[e.jsx("img",{src:r.image,alt:""}),e.jsx("span",{children:r.label})]},r.label))}),e.jsxs("button",{type:"button",className:"current-checkin",children:[e.jsx("img",{src:"/__mockup/images/scotgold-home/current-hero.jpg",alt:""}),e.jsx("span",{children:"Wheel of Fortune"})]}),e.jsx("section",{className:"current-products",children:e.jsxs("div",{className:"current-empty",children:[e.jsx("strong",{children:"Offres disponibles"}),e.jsx("span",{children:"Aucune offre stable disponible pour le moment."})]})})]}),e.jsx("style",{children:`
        .current-home, .current-home * { box-sizing: border-box; }
        .current-home {
          min-height: 100dvh;
          padding: 29px 0 72px;
          background: #111;
          color: #f7f7f8;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
          -webkit-tap-highlight-color: transparent;
        }
        .current-home-shell { width: 100%; max-width: 512px; margin: 0 auto; padding: 0 16px; }
        .current-hero { position: relative; width: 100%; aspect-ratio: 796 / 338; overflow: hidden; border-radius: 10px; background: #080808; }
        .current-hero > img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .current-hero-copy {
          position: absolute; inset: 0 auto 0 0; display: flex; width: 68%; flex-direction: column; justify-content: center;
          padding: 10px 0 10px 9%; background: linear-gradient(90deg, #050505 0%, #050505 78%, rgba(5,5,5,0) 100%);
          color: #fff; font-size: clamp(17px, 4.2vw, 22px); font-weight: 750; line-height: 1.38; text-transform: uppercase;
        }
        .current-actions { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); align-items: start; margin-top: 20px; }
        .current-action {
          display: flex; min-width: 0; min-height: 80px; flex-direction: column; align-items: center; gap: 8px;
          border: 0; padding: 0 2px; background: transparent; color: #f4f4f5; font: inherit;
        }
        .current-action img { display: block; width: 56px; height: 56px; object-fit: contain; }
        .current-action span { max-width: 100%; overflow: hidden; font-size: 13px; font-weight: 600; line-height: 1.1; text-overflow: ellipsis; white-space: nowrap; }
        .current-checkin { position: relative; display: block; width: 100%; aspect-ratio: 796 / 179; margin-top: 24px; overflow: hidden; border: 0; border-radius: 12px; padding: 0; background: #08090c; }
        .current-checkin img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .current-checkin span {
          position: absolute; top: 50%; left: 4%; z-index: 1; transform: translateY(-50%);
          background: linear-gradient(95deg, #ffe500 7%, #ffbd42 43%, #f35e9b 94%); background-clip: text;
          color: transparent; font-size: clamp(23px, 7.3vw, 39px); font-weight: 750; letter-spacing: -.045em; line-height: 1;
          -webkit-background-clip: text;
        }
        .current-products { display: grid; gap: 16px; margin-top: 25px; }
        .current-empty { display: grid; min-height: 140px; place-items: center; gap: 12px; border-radius: 13px; padding: 20px; background: #23242f; color: #aaaab3; font-size: 14px; text-align: center; }
        .current-empty strong { color: #f3c244; font-size: 16px; }
      `})]})}export{o as Current};
