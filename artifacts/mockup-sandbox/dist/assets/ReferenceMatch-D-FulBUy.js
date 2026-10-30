import{r as s,j as e}from"./index-_ve1TrR4.js";/* empty css               */const t="/__mockup/images/scotgold-home/",g=[{label:"Recharger",image:"recharge.png"},{label:"Retrait",image:"withdraw.png"},{label:"Présence",image:"checkin.png"},{label:"Service client",image:"service.png"}],d=[["092****948","Retrait","51 FCFA"],["994****664","Recharge","150 FCFA"],["907****874","Retrait","53 FCFA"],["991****845","Retrait","50 FCFA"],["994****643","Retrait","60 FCFA"],["939****364","Retrait","51 FCFA"],["921****362","Recharge","400 FCFA"],["939****364","Recharge","150 FCFA"],["975****451","Retrait","334 FCFA"],["919****844","Recharge","150 FCFA"],["981****014","Retrait","50 FCFA"],["917****945","Recharge","400 FCFA"]],x=[{label:"Accueil",icon:"home"},{label:"Produits",icon:"invest"},{label:"Partage",icon:"share"},{label:"Équipe",icon:"team"},{label:"Compte",icon:"me"}];function m({name:i}){return i==="home"?e.jsxs("svg",{viewBox:"0 0 32 32","aria-hidden":"true",children:[e.jsx("path",{d:"M5 14 16 4l11 10v14H5z",fill:"currentColor"}),e.jsx("path",{d:"M13 28v-9h6v9",fill:"#4a4848"})]}):i==="invest"?e.jsxs("svg",{viewBox:"0 0 32 32","aria-hidden":"true",children:[e.jsx("path",{d:"m16 3 12 5v16l-12 5L4 24V8z",fill:"currentColor"}),e.jsx("path",{d:"M19.5 10.5h-7v4.1h7v4.2h-7M16 8v16",fill:"none",stroke:"#4a4848",strokeWidth:"1.8",strokeLinecap:"round"})]}):i==="share"?e.jsxs("svg",{viewBox:"0 0 32 32","aria-hidden":"true",children:[e.jsx("circle",{cx:"8",cy:"16",r:"5",fill:"currentColor"}),e.jsx("circle",{cx:"24",cy:"8",r:"5",fill:"currentColor"}),e.jsx("circle",{cx:"24",cy:"24",r:"5",fill:"currentColor"}),e.jsx("path",{d:"m12 14 7-4M12 18l7 4",stroke:"currentColor",strokeWidth:"3"})]}):i==="team"?e.jsxs("svg",{viewBox:"0 0 32 32","aria-hidden":"true",children:[e.jsx("circle",{cx:"16",cy:"9",r:"5",fill:"currentColor"}),e.jsx("circle",{cx:"6.5",cy:"12",r:"3.6",fill:"currentColor"}),e.jsx("circle",{cx:"25.5",cy:"12",r:"3.6",fill:"currentColor"}),e.jsx("path",{d:"M7 28v-5c0-4.8 3.6-8 9-8s9 3.2 9 8v5zM1 27v-4c0-3.6 2.1-6 5.8-6m24.2 10v-4c0-3.6-2.1-6-5.8-6",fill:"currentColor"})]}):e.jsxs("svg",{viewBox:"0 0 32 32","aria-hidden":"true",children:[e.jsx("circle",{cx:"16",cy:"16",r:"14",fill:"currentColor"}),e.jsx("circle",{cx:"16",cy:"12",r:"5",fill:"#4a4848"}),e.jsx("path",{d:"M7 26c1-5 4-7 9-7s8 2 9 7",fill:"#4a4848"})]})}function f(){const[i,n]=s.useState(""),[r,l]=s.useState("Accueil");return e.jsxs("main",{className:"sg-reference",children:[e.jsx("style",{children:`
        .sg-reference {
          --gold: #edc74d;
          --gold-bright: #ffdb69;
          --ink: #050505;
          min-height: 100dvh;
          background: var(--ink);
          color: #eeeeee;
          font-family: Arial, sans-serif;
          overflow-x: hidden;
          padding-bottom: calc(68px + env(safe-area-inset-bottom, 0px));
          -webkit-tap-highlight-color: transparent;
        }
        .sg-reference, .sg-reference * { box-sizing: border-box; }
        .sg-frame {
          width: 100%;
          max-width: 512px;
          margin: 0 auto;
          padding: 0 17px;
        }
        .sg-top {
          position: relative;
          height: min(66.8vw, 342px);
          max-height: 342px;
          margin: 0 -17px;
          overflow: hidden;
          background:
            radial-gradient(ellipse at 78% 1%, rgba(180,126,54,.35), transparent 27%),
            radial-gradient(ellipse at 3% 43%, rgba(107,77,32,.22), transparent 37%),
            linear-gradient(180deg, #19120b 0%, #080706 49%, #050505 100%);
        }
        .sg-top::before {
          position: absolute;
          inset: 0;
          content: "";
          opacity: .36;
          background: repeating-linear-gradient(90deg, transparent 0 28px, rgba(205,166,100,.1) 29px 31px, transparent 32px 47px);
          mask-image: linear-gradient(180deg, #000 0%, transparent 66%);
        }
        .sg-top::after {
          position: absolute;
          top: 0;
          right: 12%;
          width: 48%;
          height: 50%;
          content: "";
          opacity: .26;
          background: repeating-linear-gradient(90deg, transparent 0 19px, rgba(235,210,167,.5) 20px 21px, transparent 22px 33px);
          mask-image: linear-gradient(180deg, #000 0%, transparent 85%);
        }
        .sg-wordmark {
          position: absolute;
          z-index: 1;
          top: min(38px, 7.4vw);
          left: 17px;
          display: block;
          width: min(195px, 38.1vw);
          height: min(67px, 13.1vw);
          background: #fff;
          object-fit: contain;
        }
        .sg-content { position: relative; margin-top: 0; }
        .sg-balance {
          position: relative;
          display: grid;
          height: auto;
          aspect-ratio: 2.94 / 1;
          grid-template-columns: 45% 55%;
          overflow: hidden;
          border-radius: 12px;
          background:
            repeating-linear-gradient(158deg, transparent 0 21px, rgba(255,244,190,.17) 22px 23px, transparent 24px 32px),
            repeating-linear-gradient(10deg, transparent 0 35px, rgba(255,255,255,.16) 36px 37px, transparent 38px 46px),
            linear-gradient(105deg, #e8bd36 0%, #f8d362 54%, #ffdf87 100%);
          color: #111;
        }
        .sg-balance::after {
          position: absolute;
          inset: 0;
          content: "";
          background: linear-gradient(160deg, transparent 36%, rgba(255,255,255,.18) 37%, transparent 38%, transparent 63%, rgba(255,255,255,.15) 64%, transparent 65%);
          pointer-events: none;
        }
        .sg-balance-side {
          z-index: 1;
          display: flex;
          min-width: 0;
          flex-direction: column;
          justify-content: flex-start;
          padding: min(7.6vw, 39px) 13px 12px clamp(16px, 5.1vw, 26px);
        }
        .sg-currency {
          height: 34px;
          font-size: 15px;
          font-weight: 700;
          line-height: 1;
        }
        .sg-amount {
          margin-top: 0;
          font-size: clamp(21px, 5.3vw, 27px);
          font-weight: 400;
          letter-spacing: -.045em;
          line-height: 1.05;
        }
        .sg-balance-label {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 14px;
          font-size: clamp(12px, 3.1vw, 16px);
          line-height: 1;
        }
        .sg-balance-label img { width: min(24px, 6vw); height: min(24px, 6vw); object-fit: contain; }
        .sg-action-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(10px, 3vw, 15px) clamp(11px, 3.3vw, 17px);
          margin-top: 16px;
        }
        .sg-action {
          display: flex;
          min-width: 0;
          height: auto;
          aspect-ratio: 1.83 / 1;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          gap: 6px;
          overflow: hidden;
          border: 1px solid transparent;
          border-radius: 13px;
          padding: 8px 14px;
          background: #303032;
          color: #d6c06d;
          text-align: left;
          font: inherit;
          cursor: pointer;
          transition: border-color .14s ease, transform .14s ease;
        }
        .sg-action:nth-child(odd) { background: #242426; }
        .sg-action:active { transform: scale(.985); }
        .sg-action.is-selected { border-color: rgba(255,216,102,.7); }
        .sg-action:focus-visible, .sg-tab:focus-visible { outline: 2px solid var(--gold-bright); outline-offset: 2px; }
        .sg-action img { display: block; width: clamp(42px, 13.3vw, 68px); height: clamp(42px, 13.3vw, 68px); object-fit: contain; }
        .sg-action span {
          max-width: 100%;
          overflow: hidden;
          color: #d0ba67;
          font-size: clamp(12px, 3.125vw, 16px);
          line-height: 1.15;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .sg-activity {
          margin-top: 15px;
          overflow: hidden;
          border-radius: 12px 12px 10px 10px;
          background: #333335;
        }
        .sg-activity-heading {
          display: flex;
          height: clamp(42px, 11.3vw, 58px);
          align-items: center;
          gap: 7px;
          border-bottom: 1px solid rgba(255,255,255,.08);
          padding: 0 13px;
          background: #3c3c3e;
          color: #eeeef0;
          font-size: clamp(16px, 4.3vw, 22px);
          font-weight: 400;
          letter-spacing: -.035em;
        }
        .sg-heading-mark {
          width: 5px;
          height: 16px;
          flex: 0 0 auto;
          border-radius: 3px;
          background: #f2cb50;
        }
        .sg-row {
          display: grid;
          min-height: clamp(30px, 7.42vw, 38px);
          grid-template-columns: minmax(0, 40%) minmax(0, 1fr) auto;
          align-items: center;
          gap: 8px;
          padding: 0 12px;
          color: #e1e1e3;
          font-size: clamp(12px, 3.125vw, 16px);
          line-height: 1;
        }
        .sg-row span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .sg-row .sg-row-amount { color: #e8c64f; font-size: clamp(11px, 2.9vw, 15px); text-align: right; }
        .sg-bottom-nav {
          position: fixed;
          z-index: 5;
          right: 0;
          bottom: 0;
          left: 0;
          height: calc(68px + env(safe-area-inset-bottom, 0px));
          padding-bottom: env(safe-area-inset-bottom, 0px);
          border-top: 1px solid #555456;
          background: #484748;
        }
        .sg-tabs {
          display: grid;
          width: 100%;
          max-width: 512px;
          height: 68px;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          align-items: stretch;
          margin: 0 auto;
        }
        .sg-tab {
          display: flex;
          min-width: 0;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          border: 0;
          padding: 2px 0 0;
          background: transparent;
          color: #a99b68;
          font: inherit;
          cursor: pointer;
        }
        .sg-tab svg { width: 33px; height: 33px; color: #a89a68; }
        .sg-tab span { font-size: 14px; line-height: 1; }
        .sg-tab.is-active { color: #f1d35e; }
        .sg-tab.is-active svg { color: #f4d45f; }
        @media (max-width: 390px) {
          .sg-frame { padding-right: 14px; padding-left: 14px; }
          .sg-top { margin-right: -14px; margin-left: -14px; }
          .sg-wordmark { left: 14px; }
          .sg-balance-side { padding-left: 20px; }
          .sg-action-grid { column-gap: clamp(10px, 3.5vw, 14px); row-gap: clamp(10px, 3.5vw, 14px); }
          .sg-action { padding-left: 12px; }
          .sg-action span { font-size: 14px; }
          .sg-activity-heading { font-size: clamp(16px, 4.3vw, 22px); }
          .sg-row { font-size: clamp(12px, 3.125vw, 16px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .sg-reference *, .sg-reference *::before, .sg-reference *::after { transition-duration: .01ms !important; }
        }
      `}),e.jsxs("div",{className:"sg-frame",children:[e.jsx("header",{className:"sg-top","aria-label":"Scotgold Resources Ltd.",children:e.jsx("img",{className:"sg-wordmark",src:`${t}wordmark.png`,alt:"Scotgold Resources Ltd"})}),e.jsxs("section",{className:"sg-content","aria-label":"Vue d’ensemble du compte",children:[e.jsxs("div",{className:"sg-balance","aria-label":"Solde et revenus des produits",children:[e.jsxs("div",{className:"sg-balance-side",children:[e.jsx("span",{className:"sg-currency",children:"FCFA"}),e.jsx("span",{className:"sg-amount",children:"50,00"}),e.jsxs("span",{className:"sg-balance-label",children:[e.jsx("img",{src:`${t}assets.png`,alt:""}),"Solde"]})]}),e.jsxs("div",{className:"sg-balance-side",children:[e.jsx("span",{className:"sg-currency",children:"FCFA"}),e.jsx("span",{className:"sg-amount",children:"0,00"}),e.jsxs("span",{className:"sg-balance-label",children:[e.jsx("img",{src:`${t}income.png`,alt:""}),"Mes revenus"]})]})]}),e.jsx("section",{className:"sg-action-grid","aria-label":"Actions du compte",children:g.map(a=>e.jsxs("button",{className:`sg-action${i===a.label?" is-selected":""}`,type:"button",onClick:()=>n(i===a.label?"":a.label),"aria-pressed":i===a.label,children:[e.jsx("img",{src:`${t}${a.image}`,alt:""}),e.jsx("span",{children:a.label})]},a.label))}),e.jsxs("section",{className:"sg-activity","aria-label":"Historique des transactions",children:[e.jsxs("div",{className:"sg-activity-heading",children:[e.jsx("span",{className:"sg-heading-mark"}),"Historique des transactions"]}),d.map(([a,o,c],p)=>e.jsxs("div",{className:"sg-row",children:[e.jsx("span",{children:a}),e.jsx("span",{children:o}),e.jsx("span",{className:"sg-row-amount",children:c})]},`${a}-${p}`))]})]})]}),e.jsx("nav",{className:"sg-bottom-nav","aria-label":"Navigation principale",children:e.jsx("div",{className:"sg-tabs",children:x.map(a=>e.jsxs("button",{type:"button",className:`sg-tab${r===a.label?" is-active":""}`,onClick:()=>l(a.label),"aria-current":r===a.label?"page":void 0,children:[e.jsx(m,{name:a.icon}),e.jsx("span",{children:a.label})]},a.label))})})]})}export{f as default};
