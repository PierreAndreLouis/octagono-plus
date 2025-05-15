import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Composant qui fait défiler la page vers le haut chaque fois que le chemin de l'URL change.
 */
const ScrollToTop = () => {
  // Récupère le chemin actuel de l'URL
  const { pathname } = useLocation();

  useEffect(() => {
    // Fait défiler la page vers le haut
    window.scrollTo(0, 0);
  }, [pathname]); // Dépendance : re-exécute l'effet lorsque le chemin change

  return null; // Ce composant ne rend rien
};

export default ScrollToTop;
