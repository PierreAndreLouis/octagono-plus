import React from "react";
import { Link } from "react-router-dom";

function SuccessAjoutervehiculePupupComponent({
  successAddVéhiculePopup,
  addVéhiculeData,
  setSuccessAddVéhiculePopup,
}) {
  return (
    <>
      {successAddVéhiculePopup && (
        <div className="fixed z-10 flex justify-center items-center inset-0 bg-black/50">
          <div className="bg-green-50 max-w-[25rem] p-6 rounded-xl w-[80vw]">
            <div>
              <h3 className="block text-lg  text-center leading-6 text-green-600 mb-3">
                Vous avez ajouté le véhicule avec succès.
              </h3>
              <h4 className="text-center text-lg text-gray-600">
                {addVéhiculeData.description}
              </h4>
            </div>
            <div className="flex justify-center gap-2 mt-5">
              <Link
                onClick={() => {
                  setSuccessAddVéhiculePopup(false);
                }}
                to="/home?tab=acceuil"
                className="cursor-pointer py-1 text-center px-10 bg-green-500 rounded-lg text-white"
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

export default SuccessAjoutervehiculePupupComponent;
