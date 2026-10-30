import{r as l,j as t}from"./index-_ve1TrR4.js";/* empty css               */const o="15859178",c=`https://ph.goldmine2007.com/scotgold?invite=${o}`,r=[{label:"Accueil",icon:"home.png"},{label:"Produits",icon:"products.png"},{label:"Partage",icon:"share.png",active:!0},{label:"Équipe",icon:"team.png"},{label:"Compte",icon:"account.png"}];function g(){const[i,a]=l.useState(null),n=async(e,s)=>{try{await navigator.clipboard.writeText(e),a(s),window.setTimeout(()=>a(null),1300)}catch{a(null)}};return t.jsxs("main",{className:"scotgold-match","aria-label":"Page de partage Scotgold",children:[t.jsxs("div",{className:"scotgold-match-content",children:[t.jsxs("header",{className:"scotgold-match-heading",children:[t.jsx("div",{className:"scotgold-match-brand",children:"SCOTGOLD"}),t.jsx("h1",{children:"Mon invitation"})]}),t.jsxs("section",{className:"scotgold-match-panel","aria-label":"Invitation",children:[t.jsxs("div",{className:"scotgold-match-code",children:[t.jsxs("div",{className:"scotgold-match-code-copy",children:[t.jsx("span",{className:"scotgold-match-label",children:"Code d’invitation"}),t.jsx("strong",{children:o})]}),t.jsx("button",{type:"button",className:"scotgold-match-outline-button",onClick:()=>{n(o,"code")},children:i==="code"?"Copié":"Copier"})]}),t.jsx("div",{className:"scotgold-match-rule"}),t.jsxs("div",{className:"scotgold-match-link-area",children:[t.jsx("span",{className:"scotgold-match-label",children:"Lien d’invitation"}),t.jsxs("div",{className:"scotgold-match-url-line",children:[t.jsx("svg",{className:"scotgold-match-chain",viewBox:"0 0 24 24","aria-hidden":"true",children:t.jsx("path",{d:"M10 13.5 14 9.5M8.2 15.7l-1.4 1.4a4 4 0 0 1-5.7-5.7l4-4a4 4 0 0 1 5.7 0M15.8 8.3l1.4-1.4a4 4 0 1 1 5.7 5.7l-4 4a4 4 0 0 1-5.7 0"})}),t.jsx("span",{children:c})]})]}),t.jsxs("button",{type:"button",className:"scotgold-match-copy-link",onClick:()=>{n(c,"link")},children:[t.jsx("svg",{viewBox:"0 0 24 24","aria-hidden":"true",children:t.jsx("path",{d:"M10 13.5 14 9.5M8.2 15.7l-1.4 1.4a4 4 0 0 1-5.7-5.7l4-4a4 4 0 0 1 5.7 0M15.8 8.3l1.4-1.4a4 4 0 1 1 5.7 5.7l-4 4a4 4 0 0 1-5.7 0"})}),i==="link"?"Lien copié":"Copier le lien d’invitation"]})]}),t.jsx("div",{className:"scotgold-match-section-rule"}),t.jsxs("section",{className:"scotgold-match-treasure","aria-label":"Coffre au trésor",children:[t.jsx("img",{src:"/__mockup/images/scotgold-share/treasure-chest.png",alt:"",className:"scotgold-match-chest"}),t.jsxs("div",{className:"scotgold-match-treasure-copy",children:[t.jsx("h2",{children:"Coffre au trésor"}),t.jsxs("div",{className:"scotgold-match-enter",children:[t.jsx("span",{children:"Entrer un code"}),t.jsx("svg",{viewBox:"0 0 24 24","aria-hidden":"true",children:t.jsx("path",{d:"M4 12h15M13 5l7 7-7 7"})})]})]})]}),t.jsx("div",{className:"scotgold-match-section-rule scotgold-match-lower-rule"})]}),t.jsx("nav",{className:"scotgold-match-nav","aria-label":"Navigation principale",children:r.map(e=>t.jsxs("div",{className:`scotgold-match-nav-item${e.active?" is-active":""}`,"aria-current":e.active?"page":void 0,children:[t.jsx("img",{src:`/__mockup/images/scotgold-share/navigation/${e.icon}`,alt:""}),t.jsx("span",{children:e.label})]},e.label))}),t.jsx("style",{children:`
        .scotgold-match {
          --match-gold: #e8bd4e;
          position: relative;
          width: 100%;
          max-width: 512px;
          height: 100dvh;
          min-height: 700px;
          margin: 0 auto;
          overflow: hidden;
          color: #f5f1e7;
          background:
            radial-gradient(ellipse at 64% 7%, rgba(149, 106, 34, .14), transparent 26%),
            radial-gradient(ellipse at 0% 48%, rgba(137, 92, 22, .1), transparent 29%),
            radial-gradient(ellipse at 100% 64%, rgba(137, 92, 22, .12), transparent 27%),
            #080807;
          font-family: Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        .scotgold-match::before {
          position: absolute;
          inset: 0 0 auto;
          height: 230px;
          content: "";
          pointer-events: none;
          opacity: .65;
          background-image:
            linear-gradient(180deg, rgba(123, 88, 37, .22), transparent),
            linear-gradient(180deg, rgba(221, 183, 98, .2), transparent),
            linear-gradient(180deg, rgba(221, 183, 98, .14), transparent),
            linear-gradient(180deg, rgba(221, 183, 98, .18), transparent),
            linear-gradient(180deg, rgba(221, 183, 98, .2), transparent),
            linear-gradient(180deg, rgba(221, 183, 98, .13), transparent),
            linear-gradient(180deg, rgba(221, 183, 98, .2), transparent),
            linear-gradient(180deg, rgba(221, 183, 98, .16), transparent),
            linear-gradient(180deg, rgba(221, 183, 98, .13), transparent),
            linear-gradient(180deg, rgba(221, 183, 98, .18), transparent);
          background-repeat: no-repeat;
          background-size: 100% 100%, 1px 126px, 1px 98px, 2px 116px, 1px 220px, 2px 87px, 2px 220px, 1px 136px, 1px 91px, 2px 160px;
          background-position: center, 25.4% 0, 31.8% 0, 47.8% 0, 50.8% 0, 57% 0, 69.9% 0, 72.7% 0, 77.1% 0, 81.6% 0;
          mask-image: linear-gradient(to bottom, #000, transparent);
        }
        .scotgold-match-content {
          position: relative;
          height: 100%;
          overflow: auto;
          padding: 0 27px 106px;
          scrollbar-width: none;
        }
        .scotgold-match-content::-webkit-scrollbar { display: none; }
        .scotgold-match-heading { padding-top: 34px; }
        .scotgold-match-brand {
          color: #d4b563;
          font-size: 14px;
          font-weight: 700;
          line-height: 18px;
        }
        .scotgold-match-heading h1 {
          margin: 16px 0 0;
          color: #f6f3ec;
          font-size: 36px;
          font-weight: 700;
          line-height: 43px;
          letter-spacing: -.65px;
        }
        .scotgold-match-panel {
          position: relative;
          display: flex;
          height: 406px;
          flex-direction: column;
          margin-top: 40px;
          padding: 30px 31px 32px;
          border: 1px solid rgba(202, 174, 102, .43);
          border-top: 2px solid #d9b446;
          border-radius: 12px;
          background: #1a1a1a;
          box-shadow: 0 16px 28px rgba(0, 0, 0, .2);
        }
        .scotgold-match-code {
          display: flex;
          min-height: 117px;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          padding-top: 3px;
        }
        .scotgold-match-code-copy {
          display: flex;
          min-width: 0;
          flex-direction: column;
          gap: 21px;
        }
        .scotgold-match-label {
          color: #b5b3b0;
          font-size: 16px;
          font-weight: 400;
          line-height: 21px;
        }
        .scotgold-match-code-copy strong {
          color: #f0cb60;
          font-size: 36px;
          font-weight: 600;
          line-height: 40px;
          letter-spacing: 1.2px;
        }
        .scotgold-match-outline-button {
          width: 95px;
          height: 59px;
          flex: 0 0 95px;
          border: 1px solid rgba(208, 182, 109, .34);
          border-radius: 9px;
          color: #e9cb76;
          background: #22211e;
          margin-top: 11px;
          font: inherit;
          font-size: 17px;
          cursor: pointer;
        }
        .scotgold-match-outline-button:active,
        .scotgold-match-copy-link:active { transform: scale(.985); }
        .scotgold-match-outline-button:focus-visible,
        .scotgold-match-copy-link:focus-visible { outline: 2px solid #f1cb5c; outline-offset: 3px; }
        .scotgold-match-rule {
          width: 100%;
          height: 1px;
          flex: 0 0 1px;
          background: rgba(226, 221, 211, .16);
        }
        .scotgold-match-link-area {
          display: flex;
          min-height: 160px;
          flex-direction: column;
          padding-top: 33px;
        }
        .scotgold-match-url-line {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          margin-top: 18px;
          color: #d8d6d2;
          font-size: 17px;
          line-height: 30px;
          overflow-wrap: anywhere;
        }
        .scotgold-match-chain {
          width: 24px;
          height: 24px;
          flex: 0 0 24px;
          margin-top: 3px;
          fill: none;
          stroke: #b3a579;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 1.8;
        }
        .scotgold-match-copy-link {
          display: flex;
          width: 100%;
          min-height: 62px;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: auto;
          border: 0;
          border-radius: 9px;
          color: #17140e;
          background: linear-gradient(105deg, #d9a92f, #ffd76e);
          font: inherit;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 120ms ease;
        }
        .scotgold-match-copy-link svg {
          width: 24px;
          height: 24px;
          fill: none;
          stroke: currentColor;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 2;
        }
        .scotgold-match-section-rule {
          width: 100%;
          height: 1px;
          margin-top: 43px;
          background: rgba(227, 222, 210, .22);
        }
        .scotgold-match-treasure {
          display: flex;
          min-height: 151px;
          align-items: center;
          gap: 28px;
          padding: 29px 0 51px;
        }
        .scotgold-match-chest {
          display: block;
          width: 138px;
          height: 113px;
          flex: 0 0 138px;
          object-fit: contain;
          transform: translateY(11px);
        }
        .scotgold-match-treasure-copy { min-width: 0; }
        .scotgold-match-treasure-copy h2 {
          margin: 0 0 38px;
          color: #f4f1eb;
          font-size: 24px;
          line-height: 29px;
          font-weight: 700;
          white-space: nowrap;
        }
        .scotgold-match-enter {
          display: flex;
          align-items: center;
          gap: 18px;
          color: #e8ca72;
          font-size: 18px;
          line-height: 23px;
        }
        .scotgold-match-enter svg {
          width: 24px;
          height: 24px;
          fill: none;
          stroke: currentColor;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 1.8;
        }
        .scotgold-match-lower-rule { margin-top: 0; }
        .scotgold-match-nav {
          position: absolute;
          z-index: 2;
          right: 0;
          bottom: 0;
          left: 0;
          display: grid;
          height: 106px;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          border-top: 1px solid rgba(218, 211, 193, .18);
          background: #4a4848;
        }
        .scotgold-match-nav-item {
          display: flex;
          min-width: 0;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          gap: 5px;
          padding-top: 14px;
          color: #9e926f;
          font-size: 14px;
          font-weight: 400;
          line-height: 18px;
        }
        .scotgold-match-nav-item img {
          width: 32px;
          height: 32px;
          object-fit: contain;
          opacity: .9;
        }
        .scotgold-match-nav-item:not(.is-active):first-child img { filter: brightness(.72) saturate(.9); }
        .scotgold-match-nav-item.is-active { color: #e8c64f; }
        .scotgold-match-nav-item.is-active img {
          opacity: 1;
          filter: brightness(0) saturate(100%) invert(80%) sepia(57%) saturate(530%) hue-rotate(4deg) brightness(101%) contrast(92%);
        }
        @media (max-width: 420px) {
          .scotgold-match-content { padding-right: 20px; padding-left: 20px; }
          .scotgold-match-heading h1 { font-size: 32px; }
          .scotgold-match-panel { height: auto; min-height: 390px; padding: 30px 22px 16px; }
          .scotgold-match-code-copy strong { font-size: 31px; }
          .scotgold-match-outline-button { width: 82px; flex-basis: 82px; }
          .scotgold-match-link-area { min-height: 144px; padding-top: 27px; }
          .scotgold-match-section-rule { margin-top: 36px; }
          .scotgold-match-treasure { gap: 18px; }
          .scotgold-match-chest { width: 30vw; max-width: 138px; flex-basis: 30vw; }
          .scotgold-match-treasure-copy h2 { font-size: 20px; }
          .scotgold-match-url-line { font-size: 15px; }
        }
        @media (max-width: 420px) and (max-height: 820px) {
          .scotgold-match-heading { padding-top: 26px; }
          .scotgold-match-panel { min-height: 370px; margin-top: 28px; padding-bottom: 8px; }
          .scotgold-match-link-area { min-height: 128px; padding-top: 22px; }
          .scotgold-match-url-line { margin-top: 14px; }
          .scotgold-match-copy-link { min-height: 58px; }
          .scotgold-match-section-rule { margin-top: 25px; }
          .scotgold-match-treasure { padding-top: 20px; }
        }
      `})]})}export{g as ReferenceMatch,g as default};
