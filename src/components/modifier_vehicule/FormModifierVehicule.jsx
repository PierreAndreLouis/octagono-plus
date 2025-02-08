import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";

function FormModifierVehicule({
  handleSubmit,
  addVéhiculeData,
  handleChange,
  error,
  errorID,
  errorImei,
  currentVéhicule,
  setError,
  delVehicule,
  username,
}) {
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 px-4 pb-4">
        {/* Champs du formulaire */}
        {[
          {
            id: "imeiNumber",
            label: "Numéro IMEI",
            placeholder: "Numéro IMEI",
          },
          {
            id: "uniqueIdentifier",
            label: "Identifiant unique",
            placeholder: "Exemple : tk + IMEI",
          },
          {
            id: "description",
            label: "Description du véhicule",
            placeholder: "Description",
          },
          {
            id: "displayName",
            label: "Nom du véhicule",
            placeholder: "Nom du véhicule",
          },
          {
            id: "licensePlate",
            label: "Plaque d'immatriculation",
            placeholder: "Plaque",
          },
          {
            id: "equipmentType",
            label: "Type d'appareil",
            placeholder: "Exemple : BO, B1, B2",
          },
          {
            id: "simPhoneNumber",
            label: "Numéro de la carte SIM",
            placeholder: "Numéro SIM",
          },
        ].map((field) => (
          <div key={field.id}>
            <label
              htmlFor={field.id}
              className="block text-md font-medium leading-6 text-gray-700 dark:text-gray-200"
            >
              {field.label}
            </label>
            <input
              id={field.id}
              name={field.id}
              type="text"
              placeholder={field.placeholder}
              value={addVéhiculeData[field.id]}
              onChange={handleChange}
              required
              className="block px-3 outline-none w-full border-b border-gray-200 pb-3 py-1.5 text-gray-700 shadow-sm dark:border-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800"
            />
          </div>
        ))}

        {/* Gestion des erreurs */}

        {errorID && (
          <p className="flex items-start gap-3 bg-red-100 text-red-700 text-md translate-y-4 px-4 py-1 rounded-md text-center dark:bg-red-900 dark:text-red-400">
            <span>
              <MdErrorOutline className="text-2xl mt-0.5" />
            </span>
            {errorID}
          </p>
        )}
        {errorImei && (
          <p className="flex items-start gap-3 bg-red-100 text-red-700 text-md translate-y-4 px-4 py-1 rounded-md text-center dark:bg-red-900 dark:text-red-400">
            <span>
              <MdErrorOutline className="text-2xl mt-0.5" />
            </span>
            {errorImei}
          </p>
        )}

        {/* Actions pour l'utilisateur admin */}
        {username === "admin" ? (
          <div className="pt-10">
            {!currentVéhicule?.description && (
              <p className="flex items-start gap-3 bg-red-100 text-red-700 text-lg px-4 py-1 rounded-md text-center dark:bg-red-900 dark:text-red-50">
                <span>
                  <MdErrorOutline className="text-2xl mt-0.5" />
                </span>
                Veuillez sélectionner un véhicule à modifier.
              </p>
            )}
            <div className="relative grid grid-cols-2 gap-2 pt-5 pb-8">
              {!currentVéhicule?.description && (
                <div className="absolute inset-0 bg-black/0 "></div>
              )}
              <button
                onClick={() => setError("")}
                type="submit"
                className="flex w-full justify-center rounded-md bg-orange-600 px-3 py-1.5 text-md font-semibold text-white dark:bg-orange-500"
              >
                Enregistrer
              </button>
              <div
                onClick={delVehicule}
                className="flex cursor-pointer w-full justify-center items-center gap-2 rounded-md border text-orange-500 border-orange-600 px-3 py-1.5 text-md font-semibold dark:text-orange-400 dark:border-orange-500"
              >
                <FaTrashAlt />
                <p>Supprimer</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center pt-10 pb-20 px-4 mx-4">
            <p className="flex items-start gap-3 bg-red-100 text-red-700 text-lg px-4 py-1 rounded-md text-center dark:bg-red-900 dark:text-red-400">
              <span>
                <MdErrorOutline className="text-2xl mt-0.5" />
              </span>
              Vous n'avez pas les autorisations nécessaires pour modifier ce
              véhicule.
            </p>
          </div>
        )}
      </form>
    </>
  );
}

export default FormModifierVehicule;
