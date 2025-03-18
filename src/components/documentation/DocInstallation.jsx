import React, { useContext } from "react";
import { TbPointFilled } from "react-icons/tb";
import { DataContext } from "../../context/DataContext";

function DocInstallation() {
  const {
    docInstallationRef,
    installation_sur_application_ref,
    installation_sur_chrome_ref,
  } = useContext(DataContext);

  return (
    <div ref={docInstallationRef} className="transition-all mt-[5rem]  w-full">
      <div className="px-4 transition-all mx-auto max-w-[35rem]">
        <h2 className="text-orange-600 font-semibold  mt-6 text-center">
          Manuel d'utilisation
        </h2>
        <h1 className="font-bold mt-4  text-center text-xl">
          Comment installer l'application ?
        </h1>

        <h1 className="font-bold text-gray-200 text-center text-[5rem]">
          Draft
        </h1>
        <div className="mt-8">
          <div
            ref={installation_sur_application_ref}
            className="border-b pb-5 border-b-orange-300"
          >
            <h3 className="text-2xl text-orange-600 mb-8 mt-12 text-center font-semibold">
              Si vous n'êtes  pas encore connecté
            </h3>
            <h3 className="text-lg font-semibold">
              1- Clique sur le bouton "Installer l'application", si c'est
              visible :
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/installation/bouton_installation_login.png"
                alt=""
              />
            </div>
          </div>
          {/*  */}
          <div className="border-b pt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              2- Confirmer l'installation de l'application :
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/installation/confirmer_installation_seconecter.png"
                alt=""
              />
            </div>
          </div>
          {/*  */}

          <h3 className="text-2xl text-orange-600 mb-8 mt-52 text-center font-semibold">
            Si vous êtes déjà connecté{" "}
          </h3>

          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              1- Clique sur l'icône du menu, en haut à droite
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/ajouter_nouveau_appareil/cliquer_sur_menu.png"
                alt=""
              />
            </div>
          </div>
          {/*  */}

          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              2- Cliquez sur le menu "Installer l'application"
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/installation/cliquer_sur_installer_application.png"
                alt=""
              />
            </div>
          </div>
          {/*  */}

          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              3- Cliquez sur "Install" pour confirmer l’installation
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/installation/confirmer_installation.png"
                alt=""
              />
            </div>
          </div>
          {/*  */}

          <h3
            ref={installation_sur_chrome_ref}
            className="text-2xl text-orange-600 mb-8 mt-52 text-center font-semibold"
          >
            Installation avec Google Chrome
          </h3>
          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              1- Clique sur les 3 points du navigateur, en haut à droite
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/installation/cliquer_sur_les_3_points.png"
                alt=""
              />
            </div>
          </div>
          {/*  */}
          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              2- Clique sur le menu "Cast, Save and Share"
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/installation/cliquer_sur_cast_save_share.png"
                alt=""
              />
            </div>
          </div>
          {/*  */}
          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              3- Cliquez sur le menu "Install Octagono-PLus"
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/installation/cliquer_sur_install_octagonoplus.png"
                alt=""
              />
            </div>
          </div>
          {/*  */}
          {/*  */}

          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              4- Cliquez sur "Install" pour confirmer l’installation
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/installation/confirmer_installation.png"
                alt=""
              />
            </div>
          </div>
          {/*  */}
        </div>
      </div>
    </div>
  );
}

export default DocInstallation;

// export default DocInstallation

// export default DocInstallation
