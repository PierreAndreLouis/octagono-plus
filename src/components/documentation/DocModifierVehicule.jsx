import React, { useContext } from "react";
import { TbPointFilled } from "react-icons/tb";
import { DataContext } from "../../context/DataContext";

function DocModifierVehicule() {
  const { docModifierVehiculeRef } = useContext(DataContext);

  return (
    <div
      ref={docModifierVehiculeRef}
      className="transition-all pt-[5rem]  w-full"
    >
      <div className="px-4 transition-all mx-auto max-w-[35rem]">
        <h2 className="text-orange-600 font-semibold  mt-6 text-center">
          Manuel d'utilisation
        </h2>
        <h1 className="font-bold mt-4  text-center text-xl">
          Comment modifier ou supprimer un Appareil ?
        </h1>

        <h1 className="font-bold text-gray-200 text-center text-[5rem]">
          Draft
        </h1>
        <div className="mt-8">
          <div className="border-b pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">1- Cliquez sur l'appareil</h3>
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
              2- Cliquez sur l'icône "Modifier ou supprimer l'appareil"
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
              Si vous voulez supprimer
            </h3>
            <h3 className="text-lg font-semibold">
              3- Cliquez sur le bouton "Supprimer" et confirmez votre mot de
              passe.
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
              Si vous voulez Modifier
            </h3>
            <h3 className="text-lg font-semibold">
              4- Modifie les informations souhaitées et cliquer sur
              "Enregistrer"
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
              5- Confirmez votre mot de passe.
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
              6- Felicitation, vous avez modifier l'appareil
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
