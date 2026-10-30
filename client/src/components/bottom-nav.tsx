import { useLocation } from "wouter";

const navItems = [
  { path: "/", label: "Accueil", icon: "/navigation-icons/home.png", testId: "nav-accueil" },
  { path: "/my-products", label: "Produits", icon: "/navigation-icons/products.png", testId: "nav-produits" },
  { path: "/tasks", label: "Partage", icon: "/navigation-icons/share.png", testId: "nav-partage" },
  { path: "/team", label: "Équipe", icon: "/navigation-icons/team.png", testId: "nav-equipe" },
  { path: "/account", label: "Compte", icon: "/navigation-icons/account.png", testId: "nav-compte" },
];

export default function BottomNav() {
  const [location, navigate] = useLocation();
  const isHomeDashboard = location === "/";
  const isProductsPage = location === "/invest" || location === "/my-products";
  const isSharePage = location === "/tasks";
  const isTeamPage = location === "/team";
  const isAccountPage = location === "/account";
  const isWarmNavPage = isSharePage || isTeamPage || isAccountPage;

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 border-t text-white ${
        isHomeDashboard || isProductsPage
          ? "border-[#4A4A4A] bg-[#454545]"
          : isWarmNavPage
            ? "border-[#555555] bg-[#4A4848]"
            : "border-[#343434] bg-[#1D1D1D]"
      }`}
      aria-label="Navigation principale"
      style={{
        paddingBottom: isSharePage
          ? "max(37px, env(safe-area-inset-bottom, 0px))"
          : "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="mx-auto grid h-[68px] max-w-[512px] grid-cols-5 items-center">
        {navItems.map(({ path, label, icon, testId }) => {
          const isActive = (location === "/team-details" && path === "/team") ||
            (location === "/gift-code" && path === "/account") ||
            location === path ||
            (location === "/service" && path === "/account") ||
            (path === "/my-products" && location === "/invest") ||
            (path !== "/" && location.startsWith(`${path}/`));
          const iconFilter = isHomeDashboard
            ? "none"
            : isActive
              ? "brightness(0) saturate(100%) invert(79%) sepia(48%) saturate(710%) hue-rotate(4deg) brightness(101%) contrast(96%)"
                : isWarmNavPage
                ? path === "/"
                  ? "brightness(.72) saturate(.9)"
                  : "none"
                : "grayscale(1) brightness(.62)";

          return (
            <button
              key={label}
              type="button"
              onClick={() => {
                navigate(path);
                if (path === "/") window.dispatchEvent(new Event("home-tab-clicked"));
              }}
              className="flex h-full min-w-0 flex-col items-center justify-center gap-[3px] rounded-none bg-transparent px-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#F3C244] active:opacity-75"
              data-testid={testId}
              aria-current={isActive ? "page" : undefined}
            >
              <img
                src={icon}
                className="h-9 w-auto max-w-[41px] object-contain"
                style={{ filter: iconFilter }}
                alt=""
                aria-hidden="true"
              />
              <span
                className={`${isAccountPage ? "text-[14px]" : "text-[12px]"} font-medium leading-none`}
                style={{
                  color: isActive
                    ? "#F3C244"
                    : isHomeDashboard || isWarmNavPage
                      ? "#A99B68"
                      : "#A0A0A0",
                  fontWeight: isWarmNavPage ? 400 : 500,
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
