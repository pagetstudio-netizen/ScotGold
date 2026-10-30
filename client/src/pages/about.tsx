import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";
export default function AboutPage() {
  return (
    <main className="flex h-[100dvh] min-h-[100dvh] w-full justify-center bg-white">
      <div
        className="flex h-full w-full max-w-[432px] flex-col overflow-hidden bg-white text-[#303039]"
        style={{ fontFamily: "Roboto, Arial, sans-serif" }}
      >
        <header className="relative z-10 flex h-[48px] shrink-0 items-center bg-[#23242f] px-4 text-white">
          <Link
            href="/account"
            className="flex h-full items-center gap-0.5 text-white"
            data-testid="button-back"
          >
            <ChevronLeft className="h-[22px] w-4" strokeWidth={1.8} />
            <span className="text-[14px] font-normal">Dos</span>
          </Link>
          <h1 className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[20px] font-normal leading-none">
            Profil de l&apos;entreprise
          </h1>
        </header>

        <section
          aria-label="Profil de l'entreprise"
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-white px-[8px] pb-6"
        >
          <div className="mb-5 mt-4 flex items-center gap-3">
            <img src="/scotgold-logo.png" alt="Scotgold Resources Ltd." className="h-16 w-16 rounded-md object-contain" />
            <h2 className="text-[18px] font-semibold leading-snug text-[#142644]">
              Scotgold Resources Ltd.
            </h2>
          </div>

          <p className="mb-[32px] text-[16px] font-normal leading-[2]">
            Scotgold Resources Ltd. est une société d’exploration et d’exploitation aurifère basée en
            Écosse. Son projet phare, la mine d’or de Cononish, se situe près de Tyndrum, dans les
            Highlands écossais.
          </p>

          <img
            src="/scotgold-home-hero.jpg"
            alt="Lingots d’or"
            className="block aspect-[1.78] w-full rounded-lg object-cover"
          />
          <img
            src="/scotgold-gold-bars-closeup.jpg"
            alt="Lingot d’or et pièces"
            className="mt-[10px] block aspect-[1.78] w-full rounded-lg object-cover"
          />

          <h2 className="mb-[18px] mt-[32px] text-[16px] font-semibold leading-[2] text-[#142644]">
            Projet Cononish et exploration
          </h2>

          <p className="mb-[34px] text-[16px] font-normal leading-[2]">
            Le projet a traversé plusieurs étapes de développement, de financement et d’études de
            faisabilité, avec l’objectif d’atteindre une production commerciale d’or et d’argent.
          </p>

          <p className="mb-[34px] text-[16px] font-normal leading-[2]">
            En plus de Cononish, Scotgold mène des activités d’exploration dans d’autres zones
            susceptibles de contenir des gisements aurifères en Écosse.
          </p>

          <img
            src="/scotgold-gold-bars-stack.jpg"
            alt="Lingots d’or empilés"
            className="mb-4 block aspect-[1.78] w-full rounded-lg object-cover"
          />
        </section>
      </div>
    </main>
  );
}
