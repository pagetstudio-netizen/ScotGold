import { useEffect } from "react";

export function useViewportBackground(color: string) {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const previousRootBackground = root.style.backgroundColor;
    const previousBodyBackground = body.style.backgroundColor;

    root.style.backgroundColor = color;
    body.style.backgroundColor = color;

    return () => {
      root.style.backgroundColor = previousRootBackground;
      body.style.backgroundColor = previousBodyBackground;
    };
  }, [color]);
}
