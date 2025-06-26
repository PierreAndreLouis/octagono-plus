import React, { useEffect, useState } from "react";
import { GrInstallOption } from "react-icons/gr";

const InstallationPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setStatus("prompt");
    };

    // Ajout de l'écouteur pour beforeinstallprompt
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Vérifie si l'application est installée
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setStatus("installed");
    } else if (!("BeforeInstallPromptEvent" in window)) {
      // Vérifie si le navigateur supporte l'installation
      setStatus("unsupported");
    } else {
      setStatus("idle");
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
      setStatus("loading");
      deferredPrompt.prompt();

      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("Installation acceptée");
          setStatus("installed");
        } else {
          console.log("Installation refusée");
          setStatus("idle");
        }
        setDeferredPrompt(null);
      });
    }
  };

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      // Simule l'événement dans un environnement local
      const fakePrompt = {
        prompt: () => {
          console.log("Simulating prompt...");
        },
        userChoice: Promise.resolve({ outcome: "accepted" }),
      };

      setDeferredPrompt(fakePrompt);
      setStatus("prompt");
    }
  }, []);

  return (
    <div className="pl-4 font-semibold ">
      {status === "installed" && (
        <div
          onClick={handleInstallClick}
          className={`flex text-gray-600 border-b border-gray-300 py-4 gap-4 text-lg hover:text-orange-500 cursor-pointer items-center  dark:text-gray-300 dark:border-gray-600 dark:hover:text-orange-400`}
        >
          <p className="flex items-center gap-3 text-[.98rem] justify-center">
            <GrInstallOption className="text-orange-500" />
            Application déjà installée
          </p>
        </div>
      )}

      {status === "unsupported" && (
        <div
          className={`flex text-gray-600 border-b border-gray-300 py-4 gap-4 text-lg hover:text-orange-500 cursor-pointer items-center  dark:text-gray-300 dark:border-gray-600 dark:hover:text-orange-400`}
        >
          <p
            className="flex items-center gap-3 text-[.98rem] justify-center cursor-pointer"
            //  onClick={handleInstallClick}
          >
            <GrInstallOption className="text-orange-500" />
            Installation non supportée
          </p>
        </div>
      )}
      {status === "idle----" && (
        <div
          className={`flex text-gray-600 border-b border-gray-300 py-4 gap-4 text-lg hover:text-orange-500 cursor-pointer items-center  dark:text-gray-300 dark:border-gray-600 dark:hover:text-orange-400`}
        >
          <p
            className="flex items-center gap-3 text-[.98rem] justify-center cursor-pointer"
            onClick={handleInstallClick}
          >
            <GrInstallOption className="text-orange-500" />
            Installation non disponible
          </p>
        </div>
      )}
      {status === "prompt" && (
        <div
          onClick={handleInstallClick}
          className={`flex text-gray-600 border-b border-gray-300 py-4 gap-4 text-lg hover:text-orange-500 cursor-pointer items-center  dark:text-gray-300 dark:border-gray-600 dark:hover:text-orange-400`}
        >
          <p className="flex items-center gap-3 text-[.98rem] justify-center cursor-pointer">
            <GrInstallOption className="text-orange-500" />
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
    </div>
  );
};

export default InstallationPWA;
