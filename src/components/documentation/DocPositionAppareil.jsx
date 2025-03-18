import React, { useContext } from "react";
import { TbPointFilled } from "react-icons/tb";
import { DataContext } from "../../context/DataContext";

function DocPositionAppareil() {
  const {
    docPositionAppareilRef,
    voir_position_appareil_ref,
    position_choisir_autre_appareil_ref,
    position_voir_tous_appareil_ref,
    position_type_de_vue_ref,
  } = useContext(DataContext);

  return (
    <div
      ref={docPositionAppareilRef}
      className="transition-all mt-[5rem]  w-full"
    >
      <div className="px-4 transition-all mx-auto max-w-[35rem]">
        <h2 className="text-orange-600 font-semibold  mt-6 text-center">
          Manuel d'utilisation
        </h2>
        <h1
          ref={voir_position_appareil_ref}
          className="font-bold mt-4  text-center text-xl"
        >
          Comment voir la position d'un Appareil ?
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
                src="/img/screenshot/vehicule_chosis.png"
                alt=""
              />
            </div>
          </div>
          {/*  */}

          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              2- Cliquez sur l'icône "Localisation"
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/localisation/cliquer_sur_localisation.png"
                alt=""
              />
            </div>
          </div>
          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              3- Cliquez sur le marqueur pour voir les informations sur la
              position
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/localisation/cliquer_sur_ping.png"
                alt=""
              />
            </div>
          </div>

          {/*  */}
          <h3
            ref={position_choisir_autre_appareil_ref}
            // ref={supprimer_appareil_section_ref}
            className="text-2xl text-orange-600 mb-8 mt-52 text-center font-semibold"
          >
            Comment choisir un autre appareil ?
          </h3>

          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              1- Cliquez sur le nom de l'appareil actuel, en haut de la page.
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/localisation/chosir_autre_appareil.png.png"
                alt=""
              />
            </div>
          </div>

          {/*  */}
          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              2- Tu peux filter les recherches en cliquant sur les sections en
              haut.
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/localisation/filtrer_search_appareil.png"
                alt=""
              />
            </div>
          </div>

          {/*  */}
          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              3- Tu peux rechercher dans la barre de recherche ou réinitialiser
              les filtres et recherches
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/localisation/search_or_reset.png.png"
                alt=""
              />
            </div>
          </div>

          {/*  */}
          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              4- Enfin, vous pouvez choisir l'appareil souhaité dans la liste
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/localisation/search_choose_appareil.png"
                alt=""
              />
            </div>
          </div>
          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              5- La position de l'appareil choisi sera affichée sur la carte.
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/localisation/localisation_page.png"
                alt=""
              />
            </div>
          </div>

          <h3
            ref={position_voir_tous_appareil_ref}
            // ref={supprimer_appareil_section_ref}
            className="text-2xl text-orange-600 mb-8 mt-52 text-center font-semibold"
          >
            Comment voir la position de tous les appareils a la fois ?
          </h3>

          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              1- Cliquez sur le bouton "Tous les vehicules", en haut a droite de
              la page.
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/localisation/tous_les_vehicules.png.png"
                alt=""
              />
            </div>
          </div>

          {/*  */}

          <h3
            ref={position_type_de_vue_ref}
            // ref={supprimer_appareil_section_ref}
            className="text-2xl text-orange-600 mb-8 mt-52 text-center font-semibold"
          >
            Comment modifier le type de vue de la carte ?
          </h3>

          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              1- Cliquez sur le bouton "Type de vue", en haut a gauche de la
              page.
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/localisation/type_de_vue_bouton.png.png"
                alt=""
              />
            </div>
          </div>

          {/*  */}

          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              2- Choisissez le type de vue que vous préférez dans la liste.
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/localisation/type_de_vue_liste.png"
                alt=""
              />
            </div>
          </div>

          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              3- La carte changera alors de type de vue.
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/localisation/vue_satelite.png"
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

export default DocPositionAppareil;

// export default DocPositionAppareil

// export default DocPositionAppareil

// export default DocPositionAppareil
