import{a as D,b as P,o as E,r as f,u as H,c as y,j as e,L as $,k as V}from"./index-Dy1xoY1s.js";import{u as K}from"./useMutation-Sid_58Mb.js";import{g as O}from"./countries-CHSHL_Jy.js";import{w as B}from"./home1_1793173083402-C5jEIYFo.js";import{L as R}from"./loader-circle-Dvy15daU.js";import{C as Q}from"./chevron-left-CdB8o86t.js";import"./createLucideIcon-ChyVTEl4.js";function te(){const{user:i,refreshUser:T}=D(),{toast:s}=P(),F=E(),[a,v]=f.useState(""),[n,h]=f.useState(null),[,S]=H(),k=(i?O(i.country):null)?.currency||"XOF",g=k==="FCFA"?"XOF":k,c=g==="XOF"||g==="FCFA"?"FCFA":g,x=r=>r.toLocaleString("fr-FR",{minimumFractionDigits:2,maximumFractionDigits:2}),{data:l}=y({queryKey:["/api/settings/withdrawal"]}),p=l?.minWithdrawal??1500,z=l?.withdrawalFees??18,u=l?.withdrawalStartHour??9,m=l?.withdrawalEndHour??17,C=l?.maxWithdrawalsPerDay??2,j=a?Math.round(Number(a)*(1-z/100)):0,G=a?Number(a)-j:0,N=new Date().getHours(),A=N>=u&&N<m,{data:t=[],isLoading:I}=y({queryKey:["/api/wallets"]}),{data:W=[]}=y({queryKey:["/api/user/products"]}),L=W.some(r=>r.status==="active"&&r.daysRemaining>0&&r.productType==="stable");f.useEffect(()=>{if(i?.country.trim().toUpperCase()==="BJ"){if(t.length===0)return;const o=localStorage.getItem("selectedWalletId");if(o){const d=t.find(w=>w.id===Number(o));if(localStorage.removeItem("selectedWalletId"),d){h(d);return}}h(d=>d&&t.some(w=>w.id===d.id)?d:t.find(w=>w.isDefault)??null);return}const r=localStorage.getItem("selectedWalletId");if(r&&t.length>0){const o=t.find(d=>d.id===parseInt(r));o&&h(o),localStorage.removeItem("selectedWalletId")}},[t,i?.country]),f.useEffect(()=>{if(i?.country.trim().toUpperCase()!=="BJ"&&!n&&t.length>0){const r=t.find(o=>o.isDefault);r&&h(r)}},[t,n,i?.country]);const b=K({mutationFn:async r=>(await V("POST","/api/withdrawals",r)).json(),onSuccess:()=>{s({title:"Demande envoyée",description:"Votre demande de retrait a été envoyée."}),T(),F.invalidateQueries({queryKey:["/api/withdrawals"]}),v("")},onError:r=>s({title:"Erreur",description:r.message,variant:"destructive"})}),M=()=>{if(!A){s({title:"Horaires de retrait",description:`Les retraits sont disponibles de ${u}h à ${m}h`,variant:"destructive"});return}if(!L){s({title:"Produit requis",description:"Vous devez avoir un produit stable actif pour effectuer un retrait.",variant:"destructive"});return}if(!a||a<p){s({title:"Montant invalide",description:`Le montant minimum est de ${p} ${c}`,variant:"destructive"});return}if(!n){s({title:"Compte requis",description:"Veuillez sélectionner un compte bancaire",variant:"destructive"});return}b.mutate({amount:Number(a),walletId:n.id})};if(I)return e.jsx("div",{className:"min-h-screen bg-black flex items-center justify-center",children:e.jsx(R,{className:"w-8 h-8 animate-spin text-[#efc85a]"})});if(!i)return null;const q=parseFloat(i?.balance||"0");return e.jsxs("main",{className:"withdraw-reference",children:[e.jsx("style",{children:`
        .withdraw-reference {
          color: #151515;
          font-family: Inter, Arial, sans-serif;
        }
        .withdraw-reference .withdraw-screen {
          width: 100%;
          max-width: 500px;
          min-height: 100vh;
          margin: 0 auto;
          overflow: hidden;
          background: #f7f4f2;
        }
        .withdraw-reference .withdraw-hero {
          position: relative;
          height: min(70.7vw, 354px);
          min-height: 283px;
          background: #ffca2b;
        }
        .withdraw-reference .history-button {
          position: absolute;
          z-index: 3;
          top: 14px;
          right: 16px;
          display: grid;
          width: 44px;
          height: 44px;
          place-items: center;
          border: 0;
          border-radius: 12px;
          background: rgba(255,255,255,.24);
        }
        .withdraw-reference .history-icon {
          position: relative;
          width: 30px;
          height: 30px;
          border: 2px solid #367c2b;
          border-radius: 4px;
          background: transparent;
        }
        .withdraw-reference .history-icon::before {
          position: absolute;
          top: 6px;
          left: 5px;
          width: 16px;
          height: 2px;
          content: "";
          background: #367c2b;
          box-shadow: 0 6px 0 #367c2b;
        }
        .withdraw-reference .history-icon::after {
          position: absolute;
          right: -7px;
          bottom: -7px;
          width: 11px;
          height: 11px;
          border: 2px solid #367c2b;
          border-radius: 50%;
          content: "";
          background: #ffde00;
        }
        .withdraw-reference .hero-art {
          position: relative;
          width: 100%;
          height: min(36.65vw, 183px);
          overflow: hidden;
        }
        .withdraw-reference .hero-art::before,
        .withdraw-reference .hero-art::after {
          position: absolute;
          content: "";
          border-radius: 42% 58% 52% 48%;
          background: #fdb900;
          transform: rotate(-12deg);
        }
        .withdraw-reference .hero-art::before {
          top: -24px;
          left: -25px;
          width: 168px;
          height: 128px;
          box-shadow:
            84px 23px 0 -20px #fdb900,
            330px 18px 0 5px rgba(255,255,255,.14);
        }
        .withdraw-reference .hero-art::after {
          top: 33px;
          right: 58px;
          width: 121px;
          height: 92px;
          background: rgba(255,255,255,.16);
          transform: rotate(18deg);
        }
        .withdraw-reference .hero-pattern {
          position: absolute;
          top: 10px;
          right: -24px;
          width: 205px;
          height: 145px;
          border-radius: 50%;
          background: rgba(255,255,255,.12);
          transform: rotate(-18deg);
        }
        .withdraw-reference .withdraw-title {
          position: absolute;
          z-index: 2;
          top: 82px;
          right: 0;
          left: 0;
          margin: 0;
          color: #111;
          font-size: 28px;
          font-weight: 500;
          line-height: 1;
          text-align: center;
        }
        .withdraw-reference .receipt-icon {
          position: absolute;
          z-index: 2;
          top: 15px;
          right: 25px;
          width: 25px;
          height: 31px;
          border: 3px solid #40b9cf;
          border-radius: 4px;
          transform: rotate(2deg);
        }
        .withdraw-reference .receipt-icon::before,
        .withdraw-reference .receipt-icon::after {
          position: absolute;
          left: 5px;
          content: "";
          width: 10px;
          height: 3px;
          border-radius: 3px;
          background: #367c2b;
        }
        .withdraw-reference .receipt-icon::before {
          top: 8px;
          box-shadow: 0 7px 0 #367c2b;
        }
        .withdraw-reference .receipt-icon::after {
          top: 20px;
          left: 12px;
          width: 6px;
          height: 6px;
          border: 2px solid #367c2b;
          border-radius: 50%;
          background: transparent;
        }
        .withdraw-reference .withdraw-back {
          position: absolute;
          z-index: 3;
          top: 85px;
          left: 24px;
          width: 40px;
          height: 40px;
          border: 0;
          background: transparent;
        }
        .withdraw-reference .withdraw-back::before {
          position: absolute;
          top: 14px;
          left: 9px;
          width: 14px;
          height: 14px;
          border-bottom: 3px solid #111;
          border-left: 3px solid #111;
          content: "";
          transform: rotate(45deg);
        }
        .withdraw-reference .balance-card {
          position: absolute;
          top: min(36.45vw, 182px);
          right: 16px;
          left: 16px;
          height: 160px;
          overflow: hidden;
          border: 2px solid rgba(255,255,255,.88);
          border-radius: 10px;
          background: linear-gradient(110deg, #ffde00 0%, #fff6bf 100%);
          box-shadow: 0 1px 2px rgba(202,151,0,.1);
        }
        .withdraw-reference .balance-label {
          margin: 29px 0 0 15px;
          color: #25591c;
          font-size: 23px;
          font-weight: 800;
          line-height: 1;
        }
        .withdraw-reference .balance-value {
          margin: 20px 0 0 15px;
          color: #25591c;
          font-size: 43px;
          font-weight: 800;
          line-height: .9;
        }
        .withdraw-reference .balance-value span {
          margin-left: 3px;
          font-size: 28px;
        }
        .withdraw-reference .wallet-mark {
          position: absolute;
          top: 14px;
          right: 14px;
          display: grid;
          width: 109px;
          height: 109px;
          place-items: center;
          border-radius: 50%;
          background: white;
        }
        .withdraw-reference .wallet-mark img {
          width: 67px;
          height: 67px;
          object-fit: contain;
        }
        .withdraw-reference .amount-panel {
          min-height: 154px;
          padding: 25px 35px 16px;
          background: white;
        }
        .withdraw-reference .amount-label {
          margin: 0 0 7px 9px;
          color: #c98e41;
          font-size: 16px;
          font-weight: 400;
        }
        .withdraw-reference .amount-field {
          display: flex;
          height: 54px;
          align-items: center;
          overflow: hidden;
          border-radius: 12px;
          background: #f3f0ee;
        }
        .withdraw-reference .amount-field input {
          width: 100%;
          min-width: 0;
          height: 100%;
          padding: 0 21px;
          border: 0;
          outline: 0;
          background: transparent;
          color: #656565;
          font-size: 19px;
        }
        .withdraw-reference .amount-field input::placeholder { color: #777; opacity: 1; }
        .withdraw-reference .amount-currency {
          padding-right: 20px;
          color: #767676;
          font-size: 24px;
        }
        .withdraw-reference .amount-details {
          display: flex;
          justify-content: space-between;
          margin-top: 14px;
          color: #191919;
          font-size: 14px;
        }
        .withdraw-reference .wallet-choice {
          display: flex;
          width: calc(100% - 32px);
          height: 53px;
          align-items: center;
          margin: 12px 16px 0;
          padding: 0 17px;
          border-radius: 5px;
          background: linear-gradient(112deg, #367c2b 0%, #25591c 100%);
          color: white;
          text-align: left;
          box-shadow: 0 1px 2px rgba(214,153,0,.15);
        }
        .withdraw-reference .wallet-choice img {
          width: 34px;
          height: 34px;
          margin-right: 10px;
          object-fit: contain;
        }
        .withdraw-reference .wallet-choice svg:last-child {
          width: 22px;
          height: 22px;
          margin-left: auto;
        }
        .withdraw-reference .wallet-copy {
          overflow: hidden;
          font-size: 16px;
          font-weight: 400;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .withdraw-reference .instructions {
          padding: 28px 9px 20px;
        }
        .withdraw-reference .instructions-title {
          margin-bottom: 29px;
          font-size: 17px;
          font-weight: 800;
        }
        .withdraw-reference .instructions-title::before {
          content: "💸";
          margin-right: 8px;
          font-size: 17px;
        }
        .withdraw-reference .instruction {
          position: relative;
          margin: 0 0 26px 28px;
          font-size: 17px;
          font-weight: 500;
          line-height: 1.65;
        }
        .withdraw-reference .instruction::before {
          content: "◆";
          position: absolute;
          top: 2px;
          left: -19px;
          color: #367c2b;
          font-size: 9px;
        }
        .withdraw-reference .instruction strong { font-weight: 800; }
        .withdraw-reference .submit {
          display: flex;
          width: calc(100% - 48px);
          min-height: 57px;
          align-items: center;
          justify-content: center;
          margin: 4px 24px 35px;
          border-radius: 29px;
          background: linear-gradient(112deg, #367c2b 0%, #25591c 100%);
          color: white;
          font-size: 17px;
          font-weight: 600;
        }
        .withdraw-reference .submit:disabled { opacity: .6; }
        @media (max-width: 360px) {
          .withdraw-reference .balance-card { right: 10px; left: 10px; }
          .withdraw-reference .wallet-mark { transform: scale(.82); transform-origin: top right; }
          .withdraw-reference .balance-label { font-size: 20px; }
          .withdraw-reference .balance-value { font-size: 37px; }
          .withdraw-reference .amount-panel { padding-right: 25px; padding-left: 25px; }
          .withdraw-reference .instruction { font-size: 15px; }
        }

        /* Light Scotgold layout matching the supplied withdrawal reference. */
        .withdraw-reference {
          --withdrawal-green: var(--jd-green, #367c2b);
          --withdrawal-green-dark: var(--jd-green-dark, #25591c);
          --withdrawal-yellow: var(--jd-yellow, #ffde00);
          --withdrawal-yellow-soft: var(--jd-yellow-soft, #fff6bf);
          min-height: 100dvh;
          background: #edf4e6;
          color: #20251f;
        }
        .withdraw-reference .withdraw-screen {
          width: min(100%, 500px);
          min-height: 100dvh;
          padding-bottom: 20px;
          background: #edf4e6;
        }
        .withdraw-reference .withdraw-hero {
          display: grid;
          height: 72px;
          min-height: 72px;
          place-items: center;
          border-bottom: 3px solid var(--withdrawal-green);
          background: var(--withdrawal-yellow);
        }
        .withdraw-reference .hero-art { display: none; }
        .withdraw-reference .withdraw-title {
          position: static;
          color: #1f2d1b;
          font-size: 23px;
          font-weight: 700;
          line-height: 1.1;
        }
        .withdraw-reference .history-button,
        .withdraw-reference .withdraw-back {
          top: 50%;
          display: grid;
          width: 44px;
          height: 44px;
          min-width: 44px;
          max-width: 44px;
          place-items: center;
          transform: translateY(-50%);
          border: 0;
          border-radius: 13px;
          background: var(--withdrawal-green);
          box-shadow: 0 2px 5px rgba(31, 65, 24, .2);
          color: #fff;
          text-decoration: none;
        }
        .withdraw-reference .history-button {
          right: 14px;
        }
        .withdraw-reference .history-button:hover,
        .withdraw-reference .withdraw-back:hover {
          opacity: .92;
          transform: translateY(-50%);
        }
        .withdraw-reference .history-button:focus-visible,
        .withdraw-reference .withdraw-back:focus-visible,
        .withdraw-reference .wallet-choice:focus-visible,
        .withdraw-reference .submit:focus-visible {
          outline: 3px solid #f4b33d;
          outline-offset: 3px;
        }
        .withdraw-reference .history-button img {
          display: block;
          width: 24px;
          height: 29px;
          object-fit: contain;
          filter: brightness(0) invert(1);
        }
        .withdraw-reference .withdraw-back {
          left: 14px;
          color: #fff;
        }
        .withdraw-reference .withdraw-back::before {
          display: none;
        }
        .withdraw-reference .withdraw-back svg {
          width: 25px;
          height: 25px;
          stroke-width: 2.8;
        }
        .withdraw-reference .balance-card {
          position: relative;
          top: auto;
          right: auto;
          left: auto;
          display: flex;
          min-height: 108px;
          height: auto;
          align-items: center;
          gap: 16px;
          margin: 12px 16px 0;
          padding: 16px 18px;
          border: 1px solid rgba(54, 124, 43, .16);
          border-radius: 14px;
          background: linear-gradient(110deg, var(--withdrawal-yellow) 0%, var(--withdrawal-yellow-soft) 100%);
          box-shadow: 0 3px 8px rgba(25, 70, 22, .1);
        }
        .withdraw-reference .wallet-mark {
          position: static;
          display: grid;
          width: 64px;
          height: 64px;
          flex: 0 0 64px;
          place-items: center;
          border-radius: 14px;
          background: #fff;
        }
        .withdraw-reference .wallet-mark img {
          width: 46px;
          height: 44px;
          object-fit: contain;
          filter: brightness(0) saturate(100%) invert(30%) sepia(25%) saturate(1071%) hue-rotate(65deg) brightness(94%) contrast(91%);
        }
        .withdraw-reference .balance-label {
          margin: 0;
          color: #486643;
          font-size: 15px;
          font-weight: 600;
          line-height: 1.2;
        }
        .withdraw-reference .balance-value {
          margin: 7px 0 0;
          color: var(--withdrawal-green-dark);
          font-size: clamp(29px, 8vw, 38px);
          font-weight: 800;
          letter-spacing: -.035em;
          line-height: 1;
          white-space: nowrap;
        }
        .withdraw-reference .wallet-panel {
          margin: 20px 20px 0;
        }
        .withdraw-reference .wallet-prompt {
          margin: 0 0 10px;
          color: #252c23;
          font-size: 17px;
          font-weight: 600;
          line-height: 1.4;
        }
        .withdraw-reference .wallet-choice {
          width: 100%;
          min-height: 54px;
          height: auto;
          gap: 12px;
          margin: 0;
          padding: 8px 13px;
          border: 1.5px solid rgba(54, 124, 43, .58);
          border-radius: 10px;
          background: #fff;
          box-shadow: 0 1px 3px rgba(25, 70, 22, .08);
          color: #273326;
        }
        .withdraw-reference .wallet-choice img {
          width: 32px;
          height: 31px;
          flex: 0 0 32px;
          margin: 0;
          object-fit: contain;
          filter: brightness(0) saturate(100%) invert(30%) sepia(25%) saturate(1071%) hue-rotate(65deg) brightness(94%) contrast(91%);
        }
        .withdraw-reference .wallet-choice svg:last-child {
          color: var(--withdrawal-green);
        }
        .withdraw-reference .wallet-copy {
          min-width: 0;
          font-size: 15px;
        }
        .withdraw-reference .amount-panel {
          min-height: 0;
          margin: 20px 20px 0;
          padding: 0;
          background: transparent;
        }
        .withdraw-reference .amount-label {
          margin: 0 0 8px;
          color: #252c23;
          font-size: 18px;
          font-weight: 700;
        }
        .withdraw-reference .amount-field {
          height: 58px;
          gap: 14px;
          padding: 0 14px;
          border: 1px solid rgba(54, 124, 43, .24);
          border-bottom: 2px solid var(--withdrawal-green);
          border-radius: 10px 10px 3px 3px;
          background: #fff;
        }
        .withdraw-reference .amount-field input {
          order: 2;
          flex: 1;
          padding: 0;
          color: #252c23;
          font-size: 17px;
        }
        .withdraw-reference .amount-field input::placeholder {
          color: #7a8078;
        }
        .withdraw-reference .amount-currency {
          order: 1;
          flex: 0 0 auto;
          padding: 0;
          color: var(--withdrawal-green);
          font-size: 25px;
          font-weight: 700;
        }
        .withdraw-reference .amount-details {
          flex-wrap: wrap;
          gap: 5px 14px;
          margin-top: 8px;
          color: #606a5d;
          font-size: 12px;
        }
        .withdraw-reference .submit {
          width: calc(100% - 56px);
          min-height: 56px;
          margin: 22px 28px 0;
          border-radius: 13px;
          background: linear-gradient(112deg, var(--withdrawal-green) 0%, var(--withdrawal-green-dark) 100%);
          box-shadow: 0 3px 8px rgba(25, 70, 22, .18);
          color: #fff;
          font-size: 19px;
          font-weight: 700;
        }
        .withdraw-reference .submit:hover:not(:disabled) {
          background: var(--withdrawal-green-dark);
        }
        .withdraw-reference .instructions {
          padding: 22px 20px 4px;
        }
        .withdraw-reference .instructions-title {
          margin: 0 0 12px;
          color: var(--withdrawal-green-dark);
          font-size: 16px;
          font-weight: 700;
        }
        .withdraw-reference .instructions-title::before {
          display: none;
        }
        .withdraw-reference .instructions-list {
          display: grid;
          gap: 9px;
          margin: 0;
          padding-left: 22px;
          color: #3f493c;
        }
        .withdraw-reference .instructions-list li {
          padding-left: 3px;
          font-size: 13px;
          font-weight: 400;
          line-height: 1.5;
        }
        .withdraw-reference .instructions-list li::marker {
          color: var(--withdrawal-green);
          font-weight: 700;
        }
        @media (max-width: 360px) {
          .withdraw-reference .balance-card {
            margin-right: 10px;
            margin-left: 10px;
            padding-right: 12px;
            padding-left: 12px;
          }
          .withdraw-reference .wallet-mark {
            transform: none;
          }
          .withdraw-reference .wallet-panel,
          .withdraw-reference .amount-panel,
          .withdraw-reference .instructions {
            margin-right: 14px;
            margin-left: 14px;
          }
        }

        /* Dark charcoal and gold layout from the supplied mobile reference. */
        .withdraw-reference {
          --withdrawal-gold: #efc85a;
          min-height: 100dvh;
          overflow-x: hidden;
          background: #111;
          color: #f4f1eb;
          font-family: Georgia, "Times New Roman", serif;
        }
        .withdraw-reference .withdraw-screen {
          width: min(100%, 432px);
          min-height: 100dvh;
          margin: 0 auto;
          padding: 30px 0 28px;
          overflow-x: hidden;
          background: #111;
        }
        .withdraw-reference .withdraw-header {
          height: 40px;
          margin: 0;
          padding-left: 10px;
        }
        .withdraw-reference .withdraw-back {
          position: static;
          display: grid;
          width: 40px;
          height: 40px;
          min-width: 40px;
          max-width: 40px;
          place-items: center;
          transform: none;
          border: 0;
          border-radius: 0;
          background: transparent;
          box-shadow: none;
          color: #f2f2f2;
        }
        .withdraw-reference .withdraw-back:hover {
          transform: none;
          opacity: .8;
        }
        .withdraw-reference .withdraw-back svg {
          width: 28px;
          height: 28px;
          stroke-width: 2.5;
        }
        .withdraw-reference .withdraw-top-row {
          display: grid;
          width: 100%;
          min-height: 140px;
          grid-template-columns: 34.5% 57.5%;
          column-gap: 4%;
          align-items: start;
          margin: 13px 0 21px 4%;
        }
        .withdraw-reference .balance-card {
          position: static;
          display: block;
          min-height: 0;
          height: auto;
          margin: 0;
          padding: 18px 0 0;
          overflow: visible;
          border: 0;
          border-radius: 0;
          background: transparent;
          box-shadow: none;
        }
        .withdraw-reference .balance-label {
          margin: 0;
          color: #aaa8a5;
          font-size: 17px;
          font-weight: 400;
          line-height: 1.15;
        }
        .withdraw-reference .balance-value {
          margin: 8px 0 0;
          color: #f6f4ef;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 0;
          line-height: 1.1;
          white-space: nowrap;
        }
        .withdraw-reference .wallet-edit {
          display: flex;
          width: 112px;
          height: 40px;
          align-items: center;
          justify-content: center;
          margin-top: 14px;
          padding: 0 10px;
          border: 0;
          border-radius: 23px;
          background: #252525;
          color: #f4f1eb;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 18px;
          font-weight: 700;
          white-space: nowrap;
        }
        .withdraw-reference .amount-panel {
          box-sizing: border-box;
          width: 92%;
          min-height: 0;
          margin: 0 0 0 4%;
          padding: 23px 11px 24px;
          border-radius: 18px;
          background: #24232f;
          color: #f4f1eb;
        }
        .withdraw-reference .amount-field {
          height: 56px;
          gap: 14px;
          padding: 0 16px;
          border: 0;
          border-radius: 30px;
          background: #fff0c9;
        }
        .withdraw-reference .amount-field input {
          order: 2;
          flex: 1;
          min-width: 0;
          padding: 0;
          color: #151515;
          font-family: Arial, sans-serif;
          font-size: 17px;
          font-weight: 700;
        }
        .withdraw-reference .amount-field input::placeholder {
          color: #74716c;
          opacity: 1;
        }
        .withdraw-reference .amount-currency {
          order: 1;
          flex: 0 0 auto;
          padding: 0;
          color: #16130d;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 20px;
          font-weight: 700;
        }
        .withdraw-reference .amount-details {
          display: none;
        }
        .withdraw-reference .wallet-panel {
          margin: 28px 0 0;
        }
        .withdraw-reference .wallet-prompt {
          margin: 0;
          color: #f5f3ee;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 18px;
          font-weight: 700;
          line-height: 1.25;
        }
        .withdraw-reference .wallet-account-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 82px;
          gap: 10px;
          margin-top: 10px;
        }
        .withdraw-reference .wallet-account-number {
          display: flex;
          min-width: 0;
          height: 56px;
          align-items: center;
          overflow: hidden;
          padding: 0 18px;
          border-radius: 30px;
          background: #fff0c9;
          color: #171717;
          font-family: Arial, sans-serif;
          font-size: 17px;
          font-weight: 700;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .withdraw-reference .wallet-choice {
          display: flex;
          width: 82px;
          min-height: 56px;
          height: 56px;
          align-items: center;
          justify-content: center;
          margin: 0;
          padding: 0 5px;
          border: 0;
          border-radius: 6px;
          background: #1f1f20;
          box-shadow: none;
          color: #fff;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 17px;
          font-weight: 700;
          white-space: nowrap;
        }
        .withdraw-reference .wallet-choice:hover {
          background: #2c2c2d;
        }
        .withdraw-reference .wallet-choice:focus-visible,
        .withdraw-reference .wallet-edit:focus-visible,
        .withdraw-reference .submit:focus-visible {
          outline: 2px solid #fff0c9;
          outline-offset: 3px;
        }
        .withdraw-reference .submit {
          width: 100%;
          min-height: 56px;
          height: 56px;
          margin: 50px 0 0;
          border-radius: 30px;
          background: var(--withdrawal-gold);
          box-shadow: none;
          color: #211b10;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 18px;
          font-weight: 700;
        }
        .withdraw-reference .submit:hover:not(:disabled) {
          background: #f5d46d;
        }
        .withdraw-reference .instructions {
          padding: 23px 0 0;
        }
        .withdraw-reference .rules-heading {
          margin: 0 0 9px;
          color: #f4f1eb;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 20px;
          font-weight: 700;
          line-height: 1.2;
        }
        .withdraw-reference .instructions-title {
          display: flex;
          align-items: center;
          gap: 7px;
          margin: 0;
          color: #ffe000;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 19px;
          font-weight: 700;
          line-height: 1.25;
        }
        .withdraw-reference .instructions-title::before {
          display: none;
          content: none;
        }
        .withdraw-reference .instructions-list {
          display: block;
          margin: 22px 0 0;
          padding-left: 22px;
          color: #f6f4ef;
        }
        .withdraw-reference .instructions-list li {
          margin: 0 0 14px;
          padding-left: 0;
          color: #f6f4ef;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 18px;
          font-weight: 400;
          line-height: 1.45;
        }
        .withdraw-reference .instructions-list li::marker {
          color: #ffe000;
          font-weight: 700;
        }
        .withdraw-reference .instructions-list strong {
          color: #ffe000;
          font-weight: 700;
        }
        @media (max-width: 360px) {
          .withdraw-reference .withdraw-screen {
            padding-top: 28px;
          }
          .withdraw-reference .wallet-account-row {
            grid-template-columns: minmax(0, 1fr) 74px;
            gap: 8px;
          }
          .withdraw-reference .wallet-choice {
            width: 74px;
            font-size: 16px;
          }
          .withdraw-reference .amount-panel {
            padding-right: 9px;
            padding-left: 9px;
          }
          .withdraw-reference .instructions-list li {
            font-size: 16px;
          }
        }

        .withdraw-reference {
          min-height: 100vh;
          overflow-x: hidden;
          background: #000;
          color: #f4f1eb;
          font-family: Georgia, "Times New Roman", serif;
        }
        .withdraw-reference .withdraw-screen {
          position: relative;
          isolation: isolate;
          width: min(100%, 432px);
          min-height: 100vh;
          margin: 0 auto;
          padding: 0 0 28px;
          overflow: hidden;
          background:
            radial-gradient(ellipse at 100% 78%, rgba(108, 75, 26, .18), transparent 34%),
            #000;
        }
        .withdraw-reference .withdraw-screen::before {
          position: absolute;
          z-index: 0;
          top: 0;
          right: 0;
          left: 0;
          height: 250px;
          background:
            repeating-linear-gradient(90deg, transparent 0 28px, rgba(231, 209, 170, .08) 29px 30px, transparent 31px 57px),
            repeating-linear-gradient(90deg, transparent 0 8px, rgba(231, 209, 170, .13) 9px, transparent 10px 16px),
            linear-gradient(151deg, transparent 0 40%, rgba(203, 171, 111, .08) 40.2%, transparent 41%),
            radial-gradient(ellipse at 76% 0%, rgba(124, 87, 41, .42), transparent 47%),
            linear-gradient(180deg, #191309 0%, #090806 79%, transparent 100%);
          pointer-events: none;
          content: "";
        }
        .withdraw-reference .withdraw-screen > * {
          position: relative;
          z-index: 1;
        }
        .withdraw-reference .withdraw-header {
          position: relative;
          display: flex;
          height: 44px;
          align-items: center;
          justify-content: center;
          margin: 0;
          padding: 0;
          background: transparent;
        }
        .withdraw-reference .withdraw-back {
          position: absolute;
          top: 2px;
          left: 6px;
          width: 38px;
          height: 40px;
          min-width: 38px;
          max-width: 38px;
          transform: none;
          border: 0;
          border-radius: 0;
          background: transparent;
          box-shadow: none;
          color: #f5f2eb;
        }
        .withdraw-reference .withdraw-back:hover {
          opacity: .82;
          transform: none;
        }
        .withdraw-reference .withdraw-back svg {
          width: 25px;
          height: 25px;
          stroke-width: 2;
        }
        .withdraw-reference .withdraw-page-title {
          position: absolute;
          top: 50%;
          left: 50%;
          margin: 0;
          transform: translate(-50%, -50%);
          color: #f5f2eb;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 20px;
          font-weight: 700;
          line-height: 1;
        }
        .withdraw-reference .withdraw-balance-card {
          display: flex;
          min-height: 85px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          margin: 16px 3% 0;
          border: 0;
          border-radius: 11px;
          padding: 8px 12px;
          background: linear-gradient(105deg, #dfb332 0%, #ffdc79 100%);
          color: #17130b;
        }
        .withdraw-reference .withdraw-balance-value {
          color: #15120d;
          font-size: clamp(21px, 5.3vw, 24px);
          font-weight: 700;
          line-height: 1.1;
          white-space: nowrap;
        }
        .withdraw-reference .withdraw-balance-label {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #332917;
          font-size: clamp(14px, 3.6vw, 16px);
          line-height: 1.1;
        }
        .withdraw-reference .withdraw-balance-label img {
          display: block;
          width: 18px;
          height: 18px;
          object-fit: contain;
        }
        .withdraw-reference .amount-panel {
          width: auto;
          min-height: 0;
          margin: 18px 16px 0;
          padding: 0;
          background: transparent;
          color: #f4f1eb;
        }
        .withdraw-reference .withdraw-amount-heading {
          display: flex;
          min-height: 28px;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin: 0 0 15px;
          color: #e0bb50;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(16px, 4.35vw, 19px);
          font-weight: 400;
          line-height: 1.15;
        }
        .withdraw-reference .withdraw-amount-heading span:last-child {
          flex: 0 0 auto;
          font-size: clamp(14px, 3.9vw, 17px);
        }
        .withdraw-reference .withdraw-account-button {
          display: flex;
          width: 100%;
          height: 50px;
          align-items: center;
          overflow: hidden;
          margin: 0 0 15px;
          border: 1px solid #34322e;
          border-radius: 12px;
          padding: 0 21px;
          background: rgba(0, 0, 0, .72);
          color: #e3bd51;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 15px;
          font-weight: 400;
          text-align: left;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
          transition: border-color 120ms ease, background-color 120ms ease;
        }
        .withdraw-reference .withdraw-account-button:hover {
          border-color: rgba(224, 187, 80, .7);
          background: #100e0a;
        }
        .withdraw-reference .amount-field {
          display: flex;
          width: 100%;
          height: 49px;
          align-items: center;
          gap: 10px;
          overflow: hidden;
          margin: 0;
          border: 0;
          border-radius: 12px;
          padding: 0 17px;
          background: #f2f1ef;
        }
        .withdraw-reference .amount-field input {
          order: 2;
          flex: 1;
          width: 100%;
          min-width: 0;
          height: 100%;
          padding: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #24211d;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 17px;
          font-weight: 400;
        }
        .withdraw-reference .amount-field input::placeholder {
          color: #85827c;
          opacity: 1;
        }
        .withdraw-reference .amount-currency {
          order: 1;
          flex: 0 0 auto;
          padding: 0;
          color: #dcb43f;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 15px;
          font-weight: 700;
          white-space: nowrap;
        }
        .withdraw-reference .amount-details {
          display: flex;
          flex-direction: column;
          gap: 1px;
          margin: 11px 18px 0;
          color: #999795;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.18;
        }
        .withdraw-reference .submit {
          display: flex;
          width: 100%;
          min-height: 47px;
          height: 47px;
          align-items: center;
          justify-content: center;
          margin: 23px 0 0;
          border: 0;
          border-radius: 11px;
          background: linear-gradient(105deg, #dfb332 0%, #ffdc79 100%);
          box-shadow: none;
          color: #17130b;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 17px;
          font-weight: 700;
          cursor: pointer;
          transition: filter 120ms ease, transform 120ms ease;
        }
        .withdraw-reference .submit:hover:not(:disabled) {
          filter: brightness(1.05);
          background: linear-gradient(105deg, #dfb332 0%, #ffdc79 100%);
        }
        .withdraw-reference .submit:active:not(:disabled) {
          transform: translateY(1px);
        }
        .withdraw-reference .submit:disabled {
          cursor: wait;
          opacity: .72;
        }
        .withdraw-reference .instructions {
          min-height: 295px;
          margin: 44px 0 0;
          border: 0;
          border-radius: 12px;
          padding: 16px 16px 20px;
          background: #414143;
          color: #e8e6e1;
        }
        .withdraw-reference .instructions-list {
          display: block;
          margin: 0;
          padding-left: 18px;
          color: #e8e6e1;
        }
        .withdraw-reference .instructions-list li {
          margin: 0 0 16px;
          padding: 0;
          color: #e8e6e1;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(14px, 3.85vw, 16px);
          font-weight: 400;
          line-height: 1.24;
        }
        .withdraw-reference .instructions-list li::marker {
          color: #e8e6e1;
          font-weight: 400;
        }
        .withdraw-reference .instructions-list strong {
          color: #f2d370;
          font-weight: 700;
        }
        .withdraw-reference :is(button, input, a):focus-visible {
          outline: 2px solid #e3c362;
          outline-offset: 2px;
        }
        @media (max-width: 380px) {
          .withdraw-reference .withdraw-screen {
            padding-bottom: 20px;
          }
          .withdraw-reference .amount-panel {
            margin-right: 14px;
            margin-left: 14px;
          }
          .withdraw-reference .instructions {
            min-height: 300px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .withdraw-reference .withdraw-account-button,
          .withdraw-reference .submit {
            transition: none;
          }
        }
      `}),e.jsxs("div",{className:"withdraw-screen",children:[e.jsxs("header",{className:"withdraw-header",children:[e.jsx($,{href:"/account",className:"withdraw-back","data-testid":"button-back","aria-label":"Retour",children:e.jsx(Q,{"aria-hidden":"true"})}),e.jsx("h1",{className:"withdraw-page-title",children:"Retrait"})]}),e.jsxs("section",{className:"withdraw-balance-card","aria-label":"Actifs totaux",children:[e.jsxs("strong",{className:"withdraw-balance-value","data-testid":"text-balance",children:[x(q)," ",c]}),e.jsxs("span",{className:"withdraw-balance-label",children:[e.jsx("img",{src:B,alt:"","aria-hidden":"true"}),"Actifs totaux"]})]}),e.jsxs("section",{className:"amount-panel","aria-label":"Faire un retrait",children:[e.jsxs("div",{className:"withdraw-amount-heading",children:[e.jsx("span",{children:"Montant du retrait"}),e.jsx("span",{children:"Actifs totaux"})]}),e.jsx("button",{type:"button",onClick:()=>S("/wallet"),className:"withdraw-account-button","data-testid":"button-select-wallet","aria-label":n?`Modifier le compte de retrait ${n.accountName}, ${n.accountNumber}`:"Ajouter un compte de retrait",children:n?.accountNumber||"Ajouter un compte de retrait"}),e.jsxs("label",{className:"amount-field",children:[e.jsx("span",{className:"amount-currency",children:c}),e.jsx("input",{type:"number",inputMode:"numeric",min:p,value:a,onChange:r=>v(r.target.value?Number(r.target.value):""),placeholder:"Montant du retrait","data-testid":"input-withdrawal-amount","aria-label":"Montant de retrait"})]}),e.jsxs("div",{className:"amount-details","aria-live":"polite",children:[e.jsxs("span",{children:["Taxe de retrait : ",x(G)," ",c]}),e.jsxs("span",{children:["Montant reçu : ",x(j)," ",c]})]}),e.jsx("button",{type:"button",onClick:M,disabled:b.isPending,className:"submit","data-testid":"button-submit-withdrawal",children:b.isPending?e.jsx(R,{className:"h-5 w-5 animate-spin"}):"Retrait immédiat"}),e.jsx("section",{className:"instructions","aria-label":"Instructions de retrait",children:e.jsxs("ol",{className:"instructions-list",children:[e.jsxs("li",{children:["Montant minimum de retrait : ",e.jsxs("strong",{children:[p.toLocaleString("fr-FR")," ",c]}),"."]}),e.jsxs("li",{children:["Frais de retrait : ",e.jsxs("strong",{children:[z," %"]}),"."]}),e.jsxs("li",{children:["Les retraits sont disponibles de"," ",e.jsxs("strong",{children:[String(u).padStart(2,"0"),"h00 à"," ",String(m).padStart(2,"0"),"h00"]})," ","selon les horaires configurés."]}),e.jsxs("li",{children:["Vous pouvez effectuer jusqu’à ",e.jsxs("strong",{children:[C," demande(s) par jour"]}),"."]}),e.jsx("li",{children:"Vous devez disposer d’au moins un produit stable actif pour effectuer un retrait."})]})})]})]})]})}export{te as default};
