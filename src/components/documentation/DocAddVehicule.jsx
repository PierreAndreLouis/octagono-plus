import React, { useContext } from "react";
import { TbPointFilled } from "react-icons/tb";
import { DataContext } from "../../context/DataContext";

function DocAddVehicule() {
  const { docAddVehiculeRef, testRef } = useContext(DataContext);

  return (
    <div ref={docAddVehiculeRef} className="transition-all mt-[5rem]  w-full">
      <div className="px-4 transition-all mx-auto max-w-[35rem]">
        <h2 className="text-orange-600 font-semibold  mt-6 text-center">
          Manuel d'utilisation
        </h2>
        <h1 className="font-bold mt-4  text-center text-xl">
          Comment ajouter un véhicule ?
        </h1>

        <h1 className="font-bold text-gray-200 text-center text-[5rem]">
          Draft
        </h1>
        <div className="mt-8">
          <div className="border-b pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              1- Cliquez sur l'icône menu, en haut à droite
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
              2- Cliquez sur "Ajouter un véhicule"
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/ajouter_nouveau_appareil/cliquer_sur_ajouter.png"
                alt=""
              />
            </div>
          </div>
          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 ref={testRef} className="text-lg font-semibold">
              3- Ajouter toutes les informations demandées
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/ajouter_nouveau_appareil/ajouter_tous_les_infos.png"
                alt=""
              />
            </div>
          </div>

          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              4- Cliquez sur le bouton "Enregistrer"
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/ajouter_nouveau_appareil/cliquer_sur_enregistrer.png"
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
                src="/img/screenshot/ajouter_nouveau_appareil/confirmer_ton_mot_passe.png"
                alt=""
              />
            </div>
          </div>

          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              6- Félicitations, tu as ajouté un nouveau véhicule
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/ajouter_nouveau_appareil/felicitation_ajout_reussi.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocAddVehicule;
