import React from "react";
import { Link } from "react-router-dom";
import { MdErrorOutline } from "react-icons/md";

function FormAjouterVehicule({
  handleSubmit,
  addVéhiculeData,
  handleChange,
  errorID,
  errorImei,
  username,
  setError,
}) {
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 px-4">
        {/* Champs du formulaire */}
        {[
          { id: "deviceID", label: "ID", placeholder: "ID" },
          {
            id: "imeiNumber",
            label: "Numéro IMEI",
            placeholder: "Numéro IMEI",
          },
          {
            id: "uniqueIdentifier",
            label: "Identificateur unique",
            placeholder: " IMEI",
          },
          {
            id: "description",
            label: "Description du véhicule",
            placeholder: "Description",
          },
          {
            id: "displayName",
            label: "Nom court du véhicule",
            placeholder: "Nom du véhicule",
          },
          {
            id: "licensePlate",
            label: "Plaque du véhicule",
            placeholder: "Plaque",
          },
          {
            id: "equipmentType",
            label: "Type d'appareil",
            placeholder: "Ex. : BO, B1, B2",
          },
          {
            id: "simPhoneNumber",
            label: "Numéro SIM",
            placeholder: "Numéro SIM",
          },
        ].map((field) => (
          <div key={field.id}>
            <label
              htmlFor={field.id}
              className="block text-md font-medium leading-6 text-gray-700 dark:text-gray-300"
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
              className="block px-3 w-full border-b pb-4 py-1.5 outline-none text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900/0 shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        ))}

        {errorImei && (
          <p className="flex items-start gap-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 text-md translate-y-4 px-4 py-1 rounded-md text-center">
            <MdErrorOutline className="text-2xl mt-0.5" />
            {errorImei}
          </p>
        )}
        {errorID && (
          <p className="flex items-start gap-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 text-md translate-y-4 px-4 py-1 rounded-md text-center">
            <MdErrorOutline className="text-2xl mt-0.5" />
            {errorID}
          </p>
        )}

        {/* Boutons Enregistrer et Annuler */}
        {username === "admin" ? (
          <div className="grid grid-cols-2 gap-2 pt-10 pb-6">
            <button
              onClick={() => setError("")}
              type="submit"
              className="flex w-full justify-center rounded-md bg-orange-600 dark:bg-orange-700 px-3 py-1.5 text-md font-semibold text-white hover:bg-orange-700 dark:hover:bg-orange-800"
            >
              Enregistrer
            </button>
            <Link
              to="/home?tab=acceuil"
              className="flex w-full justify-center rounded-md border text-orange-500 dark:text-orange-400 border-orange-600 px-3 py-1.5 text-md font-semibold hover:bg-orange-100 dark:hover:bg-orange-900"
            >
              Annuler
            </Link>
          </div>
        ) : (
          <div className="flex justify-center items-center pt-10 pb-20 px-4 mx-4">
            <p className="flex items-start gap-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-white dark:border-gray-500 dark:border text-lg px-4 py-1 rounded-md text-center">
              <MdErrorOutline className="text-2xl mt-0.5" />
              Vous n'avez pas les autorisations nécessaires.
            </p>
          </div>
        )}
      </form>
    </>
  );
}

export default FormAjouterVehicule;
