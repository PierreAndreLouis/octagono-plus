import React, { useContext } from "react";
import { TbPointFilled } from "react-icons/tb";
import { DataContext } from "../../context/DataContext";

function DocRapportUnite() {
  const {
    docRapportUniteRef,
    aller_page_rapport_unite_ref,
    rapport_unite_autre_appareil_ref,
    rapport_unite_recherche_ref,
    rapport_unite_telecherche_pdf_ref,
  } = useContext(DataContext);

  return (
    <div ref={docRapportUniteRef} className="transition-all mt-[5rem]  w-full">
      <div className="px-4 transition-all mx-auto max-w-[35rem]">
        <h2 className="text-orange-600 font-semibold  mt-6 text-center">
          Manuel d'utilisation
        </h2>
        <h1
          ref={aller_page_rapport_unite_ref}
          className="font-bold mt-4  text-center text-xl"
        >
          Comment aller a la page rapport unite ?
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
              2- Cliquez sur l'icône "Rapport"
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/rapport/rapport_bouton.png"
                alt=""
              />
            </div>
          </div>
          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              3- Tu arrives maintenant a la page rapport unite
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/rapport/rapport_unite_page.png"
                alt=""
              />
            </div>
          </div>

          {/*  */}
          <h3
            ref={rapport_unite_autre_appareil_ref}
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
                src="/img/screenshot/rapport/cliquer_sur_nom_vehicule.png"
                alt=""
              />
            </div>
          </div>

          {/*  */}
          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              2- Tu peux filter les recherches en cliquant sur les section en
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
              3- Tu peux recherche dans la bar de recherche ou réinitialiser les
              filtres et recherches
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
              4- Enfin, vous pouvez choisir l'appareil souhaiter dans la liste
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
              5- Les informations de l'appareil choisis seront afficher dans la
              page.
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/rapport/rapport_unite_page.png"
                alt=""
              />
            </div>
          </div>

          <h3
            ref={rapport_unite_recherche_ref}
            className="text-2xl text-orange-600 mb-8 mt-52 text-center font-semibold"
          >
            Comment faire une recherche ?
          </h3>

          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              1- Cliquez sur l'icon "calendrier", en haut a droite de la page.
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/rapport/icon_calendrier.png"
                alt=""
              />
            </div>
          </div>

          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              2- Pour une recherche pour seulement une journée, choisis la date
              ici, et cliquer sur "Recherche"
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/rapport/Recherche_une_journee.png"
                alt=""
              />
            </div>
          </div>

          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              3- Pour une recherche pour plus d'une journée, cliquer sur
              "Sélectionner une intervale de date"
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/rapport/recherche_plus_dune_journee.png"
                alt=""
              />
            </div>
          </div>

          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              4- Choisis les dates, puis cliquer sur "Appliquer"
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/rapport/recherche_unite_long.png"
                alt=""
              />
            </div>
          </div>

          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              5- Les informations de recherche de l'appareil choisis seront
              afficher dans la page.
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/rapport/rapport_unite_page.png"
                alt=""
              />
            </div>
          </div>

          {/*  */}

          <h3
            ref={rapport_unite_telecherche_pdf_ref}
            className="text-2xl text-orange-600 mb-8 mt-52 text-center font-semibold"
          >
            Comment télécharger le rapport en PDF ?
          </h3>

          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              1- Cliquez sur l'icon "télécharger", en haut a droite de la page.
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/rapport/icon_telecharger.png"
                alt=""
              />
            </div>
          </div>

          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              2- Cliquez "Télécharger le rapport en PDF", puis attendez quelque
              secondes.
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/rapport/pdf_unite.png"
                alt=""
              />
            </div>
          </div>

          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/* v */}

          {/*  */}
        </div>
      </div>
    </div>
  );
}

export default DocRapportUnite;
