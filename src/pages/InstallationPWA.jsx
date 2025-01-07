import React, { useEffect, useState } from "react";
import { GrInstallOption } from "react-icons/gr";

const InstallationPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [status, setStatus] = useState("loading"); // Gère le statut global (loading, installed, unsupported, prompt)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setStatus("prompt"); // Affiche le bouton d'installation
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Vérifie si l'application est installée
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setStatus("installed");
    } else if (!window.Promise || !window.indexedDB) {
      // Vérifie si l'installation est supportée
      setStatus("unsupported");
    } else {
      setStatus("idle"); // Aucun message par défaut si aucune condition n'est remplie
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      setStatus("loading"); // Passe en mode "loading"
      deferredPrompt.prompt();

      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("Installation acceptée");
          setStatus("installed"); // Mise à jour après installation
        } else {
          console.log("Installation refusée");
          setStatus("idle"); // Retour à l'état initial si refusé
        }
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <>
      {status === "installed" && (
        <div
          className={`flex text-gray-600 border-b border-gray-300 py-4 gap-4 text-lg hover:text-orange-500 cursor-pointer items-center  dark:text-gray-300 dark:border-gray-600 dark:hover:text-orange-400`}
        >
          <p className="flex items-center gap-3 justify-center">
            <GrInstallOption />
            Application déjà installée
          </p>
        </div>
      )}

      {status === "unsupported" && (
        <div
          className={`flex text-gray-600 border-b border-gray-300 py-4 gap-4 text-lg hover:text-orange-500 cursor-pointer items-center  dark:text-gray-300 dark:border-gray-600 dark:hover:text-orange-400`}
        >
          <p
            className="flex items-center gap-3 justify-center cursor-pointer"
            //  onClick={handleInstallClick}
          >
            <GrInstallOption />
            Installation non supportée
          </p>
        </div>
      )}
      {status === "idle--" && (
        <div
          className={`flex text-gray-600 border-b border-gray-300 py-4 gap-4 text-lg hover:text-orange-500 cursor-pointer items-center  dark:text-gray-300 dark:border-gray-600 dark:hover:text-orange-400`}
        >
          <p
            className="flex items-center gap-3 justify-center cursor-pointer"
            onClick={handleInstallClick}
          >
            <GrInstallOption />
            Loading...
          </p>
        </div>
      )}
      {status === "prompt" && (
        <div
          className={`flex text-gray-600 border-b border-gray-300 py-4 gap-4 text-lg hover:text-orange-500 cursor-pointer items-center  dark:text-gray-300 dark:border-gray-600 dark:hover:text-orange-400`}
        >
          <p
            className="flex items-center gap-3 justify-center cursor-pointer"
            onClick={handleInstallClick}
          >
            <GrInstallOption />
            Installer l'application
          </p>
        </div>
      )}
      {status === "loading" && (
        <div className="flex items-center justify-center">
          <span className="text-orange-500 mr-3">Installation en cours...</span>
          <div className="border-t-4 border-orange-500 border-solid rounded-full w-4 h-4 animate-spin"></div>
        </div>
      )}
    </>
  );
};

export default InstallationPWA;

// import React, { useEffect, useState } from "react";
// import { GrInstallOption } from "react-icons/gr";

// const InstallationPWA = () => {
//   const [deferredPrompt, setDeferredPrompt] = useState(null);
//   const [isVisible, setIsVisible] = useState(false);
//   const [loading, setLoading] = useState(false); // État pour gérer le loading
//   const [isInstalled, setIsInstalled] = useState(false); // État pour vérifier si l'app est installée
//   const [isSupported, setIsSupported] = useState(true); // État pour vérifier si l'installation est supportée

//   useEffect(() => {
//     const handleBeforeInstallPrompt = (e) => {
//       e.preventDefault();
//       setDeferredPrompt(e);
//       setIsVisible(true); // Affiche le bouton
//     };

//     window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

//     // Vérifier si l'application est déjà installée
//     if (window.matchMedia("(display-mode: standalone)").matches) {
//       setIsInstalled(true);
//     }

//     // Vérifier la compatibilité pour l'installation
//     if (!window.Promise || !window.indexedDB) {
//       setIsSupported(false);
//     }

//     return () => {
//       window.removeEventListener(
//         "beforeinstallprompt",
//         handleBeforeInstallPrompt
//       );
//     };
//   }, []);

//   const handleInstallClick = () => {
//     if (deferredPrompt) {
//       setLoading(true); // Affiche le loading pendant l'installation
//       deferredPrompt.prompt(); // Montre le prompt d'installation

//       deferredPrompt.userChoice.then((choiceResult) => {
//         setLoading(false); // Cache le loading après que l'utilisateur ait fait son choix
//         if (choiceResult.outcome === "accepted") {
//           console.log("Installation acceptée");
//         } else {
//           console.log("Installation refusée");
//         }
//         setDeferredPrompt(null); // Réinitialise le prompt
//         setIsVisible(false); // Cache le bouton après l'interaction
//       });
//     }
//   };

//   return (
//     <>
//       {isInstalled && (
//         <p
//           onClick={handleInstallClick}
//           className="flex items-center gap-3 justify-center"
//         >
//           <span>
//             {" "}
//             <GrInstallOption />
//           </span>{" "}
//           Application déjà installée
//         </p>
//       )}

//       {!isSupported && (
//         <p>Installation non supportée </p> // Message lorsque l'installation n'est pas supportée
//       )}

//       {isVisible && !loading && (
//         <p
//           className="flex items-center gap-3 justify-center"
//           onClick={handleInstallClick}
//         >
//           <span>
//             {" "}
//             <GrInstallOption />
//           </span>{" "}
//           Installer l'application
//         </p>
//       )}

//       {loading && (
//         <div className="flex items-center justify-center">
//           <span className="text-orange-500 mr-3">Installation en cours...</span>
//           <div className="border-t-4 border-orange-500 border-solid rounded-full w-4 h-4 animate-spin"></div>
//         </div>
//       )}
//     </>
//   );
// };

// export default InstallationPWA;
