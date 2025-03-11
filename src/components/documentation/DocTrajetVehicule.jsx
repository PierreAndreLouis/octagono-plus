import React, { useContext } from "react";
import { TbPointFilled } from "react-icons/tb";
import { DataContext } from "../../context/DataContext";

function DocTrajetVehicule() {
  const { docTrajetVehiculeRef } = useContext(DataContext);

  return (
    <div
      ref={docTrajetVehiculeRef}
      className="transition-all mt-[5rem]  w-full"
    >
      <div className="px-4 transition-all mx-auto max-w-[35rem]">
        <h2 className="text-orange-600 font-semibold  mt-6 text-center">
          Manuel d'utilisation
        </h2>
        <h1 className="font-bold mt-4  text-center text-xl">
          Comment voir le trajet d'un Appareil ?
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
              2- Cliquer sur l'icon "trajet"
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/trajet/cliquer_sur_trajet.png"
                alt=""
              />
            </div>
          </div>
          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              3- Cliquer sur n'importe quel marker pour vois les information sur
              la position
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/trajet/cliquer_marker2.png"
                alt=""
              />
            </div>
          </div>

          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-2xl text-green-600 font-semibold">
              Si tu veux retracer le trajet du véhicule
            </h3>
            <h3 className="text-lg font-semibold">
              4- Cliquer sur le bouton en haut a gauche "Retracer le trajet"
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/trajet/cliquer_marker.png"
                alt=""
              />
            </div>
          </div>

          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-2xl text-green-600 font-semibold">
              Pour voir les fonctionnalité sur l'animation du trajet
            </h3>
            <h3 className="text-lg font-semibold">
              5- Cliquer sur l'icon a droite du bouton "Retracer le trajet"
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/trajet/retracer_le_trajet.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocTrajetVehicule;

// export default DocTrajetVehicule
