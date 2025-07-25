import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { DataContext } from "../../context/DataContext";
import { useTranslation } from "react-i18next";

function SuccèsÉchecMessagePopup({
  message,
  setMessage,
  véhiculeData,
  composant_from,
}) {
  const {
    showConfirmationMessagePopup,
    setShowConfirmationMessagePopup,
    confirmationMessagePopupTexte,
    setConfirmationMessagePopupTexte,
    confirmationMessagePopupName,
    setConfirmationMessagePopupName,
  } = useContext(DataContext);

  const [t, i18n] = useTranslation();

  //

  //
  //
  //
  let body_bg;
  let header_bg;
  let button_bg;
  let text_color;

  if (
    confirmationMessagePopupTexte?.includes(`${t("succès")}`) ||
    confirmationMessagePopupTexte?.includes("Successfully")
  ) {
    body_bg = "bg-green-50";
    header_bg = "bg-green-600";
    button_bg = "bg-green-500";
    text_color = "text-green-600";
  } else if (
    confirmationMessagePopupTexte?.includes(`${t("échec")}`) ||
    confirmationMessagePopupTexte?.includes(`${t("Échec")}`)
  ) {
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
      {showConfirmationMessagePopup && (
        <div className="fixed z-[9999999999999999999999999999999999999999999999999] flex justify-center items-center inset-0 bg-black/50">
          <div
            className={` ${body_bg} max-w-[25rem] pb-6 overflow-hidden  rounded-xl w-[80vw] `}
          >
            <div
              className={` ${header_bg} flex justify-center items-center py-4 px-4  mb-8 `}
            >
              <h2 className="font-bold text-white text-xl">
                {confirmationMessagePopupTexte?.includes(`${t("succès")}`)
                  ? `${t("Succès")}`
                  : `${t("Échec")}`}

                {confirmationMessagePopupTexte === "Redémarrer l'application"
                  ? "Redémarrer l'application"
                  : ""}
              </h2>
            </div>
            <div>
              <h3
                className={`${text_color}  block font-semibold text-lg  text-center leading-6  mb-3 `}
              >
                {confirmationMessagePopupTexte
                  ? confirmationMessagePopupTexte
                  : ""}

                {composant_from === "Redémarrer l'application" &&
                  "Etes vous sur de redémarrer l'application ?"}
              </h3>

              <h4 className="text-center text-lg text-gray-600 font-semibold">
                {confirmationMessagePopupName
                  ? confirmationMessagePopupName
                  : ""}
              </h4>
            </div>
            <div className="flex justify-center gap-2 mt-5">
              <Link
                onClick={() => {
                  setShowConfirmationMessagePopup(false);
                }}
                className={` ${button_bg} cursor-pointer py-1 text-center px-10  rounded-lg text-white`}
              >
                {t("Ok")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SuccèsÉchecMessagePopup;
