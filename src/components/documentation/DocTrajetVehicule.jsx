import React, { useContext } from "react";
import { TbPointFilled } from "react-icons/tb";
import { DataContext } from "../../context/DataContext";

function DocTrajetVehicule() {
  const {
    docTrajetVehiculeRef,
    voir_trajet_ref,
    trajet_recentrer_ref,
    trajet_choix_autre_appareil_ref,
    trajet_type_de_vue_ref,
    trajet_recherche_ref,
    trajet_retracer_trajet_ref,
  } = useContext(DataContext);

  return (
    <div
      ref={docTrajetVehiculeRef}
      className="transition-all mt-[5rem]  w-full"
    >
      <div className="px-4 transition-all mx-auto max-w-[35rem]">
        <h2 className="text-orange-600 font-semibold  mt-6 text-center">
          Manuel d'utilisation
        </h2>
        <h1
          ref={voir_trajet_ref}
          className="font-bold mt-4  text-center text-xl"
        >
          Comment voir le trajet d'un Appareil ?
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
              2- Cliquez sur l'icon "trajet"
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
              3- Tu verras alors le trajet de l'appareil
            </h3>
            <p className="text-white">.</p>

            <div className="flex-- h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/trajet/trajet vehicule_header.png"
                alt=""
              />
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/trajet/trajet vehicule.png"
                alt=""
              />
            </div>
          </div>

          {/*  */}

          <h3
            ref={trajet_recentrer_ref}
            // ref={supprimer_appareil_section_ref}
            className="text-2xl text-orange-600 mb-8 mt-52 text-center font-semibold"
          >
            Comment recentrer la carte ?
          </h3>

          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              1- Cliquez sur l'icon "recentrer", en haut a droite de la page.
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/trajet/recentrer_la_carte.png.png"
                alt=""
              />
            </div>
          </div>

          {/*  */}

          <h3
            ref={trajet_choix_autre_appareil_ref}
            // ref={supprimer_appareil_section_ref}
            className="text-2xl text-orange-600 mb-8 mt-52 text-center font-semibold"
          >
            Comment choisir un autre appareil ?
          </h3>

          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              1- Cliquez le nom de l'appareil actuel en haut de la page.
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/trajet/choisir_autre_appareil.png"
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
              4- Enfin, tu peux choisir l'appareil souhaiter dans la liste
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
              5- Le trajet de l'appareil choisis sera afficher sur la carte.
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/trajet/trajet_appareil_2.png"
                alt=""
              />
            </div>
          </div>

          {/*  */}

          <h3
            ref={trajet_type_de_vue_ref}
            className="text-2xl text-orange-600 mb-8 mt-52 text-center font-semibold"
          >
            Comment modifier le type de vue de la carte ?
          </h3>

          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              1- Cliquez sur l'icon en haut a droite de la page.
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/trajet/type_de_vue_icon_1.png.png"
                alt=""
              />
            </div>
          </div>

          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              2- Cliquez sur le bouton "Type de vue", en haut du popup.
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/trajet/type_de_vue_icon_2.png"
                alt=""
              />
            </div>
          </div>

          {/*  */}

          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              3- Choisis le type de vue que tu veux parmi la liste
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
              4- La carte changera alors de type de vue.
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/trajet/vue_satelit.png"
                alt=""
              />
            </div>
          </div>

          {/*  */}

          <h3
            ref={trajet_recherche_ref}
            className="text-2xl text-orange-600 mb-8 mt-52 text-center font-semibold"
          >
            Comment faire une recherche par intervale de date ?
          </h3>

          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              1- Cliquez sur l'icon en haut a droite de la page.
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/trajet/type_de_vue_icon_1.png.png"
                alt=""
              />
            </div>
          </div>

          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              2- Cliquez sur l'icon "filtrer par date".
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/trajet/icon_filtrer_par_date.png.png"
                alt=""
              />
            </div>
          </div>

          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              3- Choisis les dates, puis clique sur le bouton "Appliquer".
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/trajet/choisir_la_date.png"
                alt=""
              />
            </div>
          </div>
          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              4- Tu peux filtrer par status, si tu le souhaites.
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/trajet/filtrer_par_status.png.png"
                alt=""
              />
            </div>
          </div>
          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              5- Enfin, cliquer sur "Appliquer" pour lancer la recherche
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/trajet/lancer_la_recherche.png.png"
                alt=""
              />
            </div>
          </div>

          <h3
            ref={trajet_retracer_trajet_ref}
            className="text-2xl text-orange-600 mb-8 mt-52 text-center font-semibold"
          >
            Comment retracer le trajet d'un appareil ?
          </h3>

          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              1- Cliquez le bouton "Retracer le trajet" en haut, a gauche.
              l’animation va commencer automatiquement.
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/trajet/cliquer_sur_retracer_trajet.png.png"
                alt=""
              />
            </div>
          </div>
          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              2- Pour modifier les paramètres des l'animation, cliquer sur
              l'icon a droite du bouton "Retracer le trajet"
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/trajet/parametre_retracer_trajet.png"
                alt=""
              />
            </div>
          </div>
          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              3- Roles des différentes fonctionnalités
            </h3>
            <div className="ml-4--">
              <div className="flex gap-4 items-center">
                <TbPointFilled className="min-w-[1rem]" />
                <p>
                  {" "}
                  <span className="font-bold text-orange-600 mr-4">
                    Icône #1:
                  </span>{" "}
                  Pour pause et play l’animation
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <TbPointFilled className="min-w-[1rem]" />
                <p>
                  {" "}
                  <span className="font-bold text-orange-600 mr-4">
                    Icône #2:
                  </span>{" "}
                  Pour activer ou désactiver le centrage automatique de la carte
                  lors de l'animation
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <TbPointFilled className="min-w-[1rem]" />
                <p>
                  {" "}
                  <span className="font-bold text-orange-600 mr-4">
                    Icône #3:
                  </span>{" "}
                  Pour redémarrer l'animation depuis le debut
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <TbPointFilled className="min-w-[1rem]" />
                <p>
                  {" "}
                  <span className="font-bold text-orange-600 mr-4">
                    Icône #4:
                  </span>{" "}
                  Pour ajuster la vitesse de l'animation
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <TbPointFilled className="min-w-[1rem]" />
                <p>
                  {" "}
                  <span className="font-bold text-orange-600 mr-4">
                    Icône #5:
                  </span>{" "}
                  Pour ajuster le zoom lors de l'animation
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <TbPointFilled className="min-w-[1rem]" />
                <p>
                  {" "}
                  <span className="font-bold text-orange-600 mr-4">
                    Icône #6:
                  </span>{" "}
                  Pour afficher les information du trajet lors de l'animation
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <TbPointFilled className="min-w-[1rem]" />
                <p>
                  {" "}
                  <span className="font-bold text-orange-600 mr-4">
                    Icône #7:
                  </span>{" "}
                  Pour activer ou désactiver l'affichage des geozones
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <TbPointFilled className="min-w-[1rem]" />
                <p>
                  {" "}
                  <span className="font-bold text-orange-600 mr-4">
                    Icône #8:
                  </span>{" "}
                  Pour fermer la bare du paramètre
                </p>
              </div>
            </div>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/trajet/fonctionalites_trajet.png"
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
