import React, { useContext } from "react";
import { TbPointFilled } from "react-icons/tb";
import { DataContext } from "../../context/DataContext";

function DocModifierVehicule() {
  const { docModifierVehiculeRef } = useContext(DataContext);

  return (
    <div
      ref={docModifierVehiculeRef}
      className="transition-all mt-[5rem]  w-full"
    >
      <div className="px-4 transition-all mx-auto max-w-[35rem]">
        <h2 className="text-orange-600 font-semibold  mt-6 text-center">
          Manuelle d'utilisation
        </h2>
        <h1 className="font-bold mt-4  text-center text-xl">
          Comment modifier ou supprimer un Appareil ?
        </h1>

        <h1 className="font-bold text-gray-200 text-center text-[5rem]">
          Draft
        </h1>
        <div className="mt-8">
          <div className="border-b pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">1- Cliquer sur l'appareil</h3>
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
              2- Cliquer sur l'icon "Modifier ou supprimer l'appareil"
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/modifier_ou_supprimer/cliquer_sur_modifier_supprimer.png"
                alt=""
              />
            </div>
          </div>
          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-2xl text-red-600 font-semibold">
              Si tu veux supprimer
            </h3>
            <h3 className="text-lg font-semibold">
              3- Cliquer sur le bouton supprimer et confirmer ton mot de passe
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/modifier_ou_supprimer/mofidier_les_infos_necessaire.png"
                alt=""
              />
            </div>
          </div>

          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-2xl text-green-600 font-semibold">
              Si tu veux Modifier
            </h3>
            <h3 className="text-lg font-semibold">
              4- Modifie les infos souhaiter et cliquer sur "Enregistrer"
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/modifier_ou_supprimer/mofidier_les_infos_necessaire2.png"
                alt=""
              />
            </div>
          </div>

          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              5- Confirmer ton mot de passe
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/modifier_ou_supprimer/confirmer_mot_passe.png"
                alt=""
              />
            </div>
          </div>

          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              6- Felicitation, tu as modifier l'appareil
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/modifier_ou_supprimer/felicitation_modifier_succes.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocModifierVehicule;

// export default DocModifierVehicule
