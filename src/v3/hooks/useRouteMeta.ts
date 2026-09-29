import { useEffect } from "react";
import { applyRouteMeta } from "../lib/meta";
import type { V3Route } from "../routes";

/** Keeps the document title, description, canonical and social tags in sync with the route. */
export const useRouteMeta = (route: V3Route | undefined) => {
  useEffect(() => {
    applyRouteMeta(route);
  }, [route]);
};
