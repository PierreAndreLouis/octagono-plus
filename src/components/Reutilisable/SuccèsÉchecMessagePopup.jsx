import React from "react";
import { Link } from "react-router-dom";

function SuccèsÉchecMessagePopup({
  message,
  setMessage,
  véhiculeData,
  composant_from,
}) {
  let body_bg;
  let header_bg;
  let button_bg;
  let text_color;

  if (composant_from.includes("succès")) {
    body_bg = "bg-green-50";
    header_bg = "bg-green-600";
    button_bg = "bg-green-500";
    text_color = "text-green-600";
  } else if (composant_from.includes("échec")) {
    body_bg = "bg-red-50";
    header_bg = "bg-red-600";
    button_bg = "bg-red-500";
    text_color = "text-red-600";
  } else {
    body_bg = "bg-gray-50";
    header_bg = "bg-gray-600";
    button_bg = "bg-gray-500";
    text_color = "text-gray-600";
  }

  return (
    <>
      {message && (
        <div className="fixed z-[9999999999999999999999] flex justify-center items-center inset-0 bg-black/50">
          <div
            className={` ${body_bg} max-w-[25rem] pb-6 overflow-hidden  rounded-xl w-[80vw] `}
          >
            <div
              className={` ${header_bg} flex justify-center items-center py-4 px-4  mb-8 `}
            >
              <h2 className="font-bold text-white text-xl">
                {(composant_from === "succès modification timezone" &&
                  "Mise à jour réussie") ||
                composant_from.includes("succès")
                  ? "Succès"
                  : "Échec"}

                {composant_from === "Redémarrer l'application"
                  ? "Redémarrer l'application"
                  : ""}
              </h2>
            </div>
            <div>
              <h3
                className={`${text_color}  block font-semibold text-lg  text-center leading-6  mb-3 `}
              >
                {composant_from === "succès ajout de véhicule" &&
                  "Vous avez ajouté le véhicule avec succès."}
                {composant_from === "échec ajout de véhicule" &&
                  "Échec de l'ajout du véhicule."}
                {composant_from === "succès modification de véhicule" &&
                  "Vous avez modifié le véhicule avec succès."}
                {composant_from === "succès suppression de véhicule" &&
                  "Vous avez supprimé le véhicule avec succès."}
                {composant_from === "échec suppression de véhicule" &&
                  "Échec de la suppression du véhicule."}
                {composant_from === "échec modification de véhicule" &&
                  "Échec de la modification du véhicule."}
                {composant_from === "succès modification timezone" &&
                  "Le fuseau horaire prendra automatiquement effet lors de la prochaine mise à jour des véhicules."}
                {composant_from === "Redémarrer l'application" &&
                  "Etes vous sur de redémarrer l'application ?"}
                {composant_from === "échec de la creation du geozone" &&
                  "Échec de la creation du geozone "}
                {composant_from === "succès de creation du geozone" &&
                  "Creation du geozone avec succès "}
                {composant_from === "succès de modification du geozone" &&
                  "Modification du geozone avec succès "}
                {composant_from === "échec de la modification du geozone" &&
                  "Échec de la modification du geozone "}
                {composant_from === "succès de suppression du geozone" &&
                  "Suppression du geozone avec succès"}
                {composant_from === "échec de la suppression du geozone" &&
                  "Échec de la suppression du geozone"}
                {composant_from === "succès ajout de Groupe" &&
                  "Creation du groupe avec succès"}
                {composant_from === "échec ajout la creation du groupe" &&
                  "Échec de la creation du groupe"}
                {composant_from === "succès modification de Groupe" &&
                  "Modification du Groupe avec succès"}
                {composant_from === "échec modification du groupe" &&
                  "Échec de la modification du groupe"}

                {composant_from === "succès suppression de Groupe" &&
                  "Suppression du groupe avec succès"}

                {composant_from === "échec suppression du groupe" &&
                  "Échec de la suppression du groupe"}

                {composant_from === "succès creation de nouveau compte" &&
                  "Creation du compte avec succès"}
                {composant_from === "échec de creation de nouveau compte" &&
                  "Échec de creation du nouveau compte"}

                {composant_from === "succès modification de nouveau compte" &&
                  "Modification du compte avec succès"}

                {composant_from === "échec de modification de nouveau compte" &&
                  "Échec de la modification du nouveau compte"}

                {composant_from === "succès creation nouveau user" &&
                  "Creation de l'utilisateur avec succès"}

                {composant_from === "échec creation nouveau user" &&
                  "Échec de la creation de l'utilisateur"}

                {composant_from === "succès modification du user" &&
                  "Modification de l'utilisateur avec succès"}

                {composant_from === "échec modification du user" &&
                  "Échec de la modification de l'utilisateur"}
              </h3>

              {composant_from ===
                ("succès ajout de véhicule" ||
                  "échec ajout de véhicule" ||
                  "succès suppression de véhicule" ||
                  "Échec de la modification du véhicule" ||
                  "Échec de la suppression du véhicule" ||
                  "succès modification de véhicule") && (
                <h4 className="text-center text-lg text-gray-600 font-semibold">
                  {véhiculeData?.description}
                </h4>
              )}
            </div>
            <div className="flex justify-center gap-2 mt-5">
              <Link
                onClick={() => {
                  setMessage(false);
                }}
                // to="/home?tab=acceuil"
                className={` ${button_bg} cursor-pointer py-1 text-center px-10  rounded-lg text-white`}
              >
                OK
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// export default SuccèsÉchecMessagePopup;

export default SuccèsÉchecMessagePopup;
