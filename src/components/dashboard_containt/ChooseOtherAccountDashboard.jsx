import React, { useContext, useState } from "react";
import { IoClose, IoSearchOutline } from "react-icons/io5";
import { DataContext } from "../../context/DataContext";
import { FaUserCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function ChooseOtherAccountDashboard({
  chooseOtherAccountGestion,
  setChooseOtherAccountGestion,

  filterGestionAccountData,
  setAllDevices,
  chooseOneAccountToContinue,
  setChooseOneAccountToContinue,
  documentationPage,
  chooseAccountFromGeozoneSection,
  setAccountIdFromRole,
}) {
  const {
    setCurrentAccountSelected,
    setListeGestionDesVehicules,
    currentAccountSelected,
    setListeGestionDesGeofences,
    scrollToTop,
    accountGeofences,
    updateAppareilsEtGeofencesPourCarte,
    gestionAccountData,
    chooseAccountID,
    setChooseAccountID,
  } = useContext(DataContext);

  const [searchInputTerm, setSearchInputTerm] = useState("");

  const filterListeDesCompte = searchInputTerm
    ? gestionAccountData?.filter(
        (item) =>
          item?.description
            ?.toLowerCase()
            ?.includes(searchInputTerm.toLowerCase()) ||
          item?.accountID.toLowerCase().includes(searchInputTerm.toLowerCase())
      )
    : gestionAccountData;

  const [t, i18n] = useTranslation();

  const nombreDeRésultatParClique = 10;

  // const [voir10RésultatPlus, setVoir10RésultatPlus] = useState(1);
  const [voir10DePlus, setVoir10DePlus] = useState(1);

  const filterGestionAccountDataPagination =
    filterListeDesCompte &&
    filterListeDesCompte
      ?.sort((a, b) => b?.accountDevices?.length - a?.accountDevices?.length)
      ?.slice(0, voir10DePlus * nombreDeRésultatParClique);

  //     const filterListeDesComptePagination =
  // filterListeDesCompte &&
  // filterListeDesCompte
  //   .sort((a, b) => b?.accountDevices?.length - a?.accountDevices?.length)
  //   ?.slice(0, voir10RésultatPlus * nombreDeRésultatParClique);

  const afficherPlusDeRésultat = () => {
    setVoir10DePlus((prev) => prev + 1);
  };

  return (
    <>
      {chooseOtherAccountGestion && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[99999999999999999999999999999999999999999999999999999]">
          <div className="bg-white overflow-hidden w-full mx-0 max-w-[40rem] min-h-[70vh] rounded-lg">
            <div className="relative">
              <h2 className="text-center font-semibold text-lg bg-orange-100 py-3">
                {t("Liste des Comptes")}
              </h2>

              <IoClose
                onClick={() => {
                  setChooseOtherAccountGestion(false);
                  setVoir10DePlus(1);
                }}
                className="absolute text-2xl text-red-600 top-4 cursor-pointer right-4"
              />
            </div>
            <div className="flex pb-2 mx-3 mt-4 gap-2 justify-between items-center">
              <input
                className="w-full dark:bg-gray-800 border p-4 py-1.5 rounded-lg  dark:border-gray-600 dark:text-gray-200"
                type="text"
                placeholder={`${t("Rechercher un compte")}`}
                value={searchInputTerm}
                onChange={(e) => {
                  setSearchInputTerm(e.target.value);
                }}
              />

              <div className="border cursor-pointer px-3  py-2 border-gray-300 rounded-md bg-gray-100">
                <IoSearchOutline className="text-xl " />
              </div>
            </div>
            {chooseOneAccountToContinue && (
              <div className="mx-4 flex items-center cursor-pointer justify-between  px-3 py-1 rounded-md bg-yellow-200 text-yellow-700 border border-yellow-700 font-semibold text-sm text-center mb-2">
                <p className="w-full">
                  {t("Veuillez choisir un compte pour continuer")}
                </p>
                <IoClose
                  onClick={() => {
                    setChooseOneAccountToContinue(false);
                  }}
                />
              </div>
            )}
            <div className="flex overflow-auto h-[55vh] md:h-[60vh] pb-20 flex-col gap-4 mx-3">
              {documentationPage !== "Ajouter_nouveau_role" && (
                <button
                  onClick={() => {
                    {
                      if (chooseAccountFromGeozoneSection) {
                        setListeGestionDesGeofences(accountGeofences);
                        setChooseOtherAccountGestion(false);
                      } else {
                        setCurrentAccountSelected(null);
                        // setAllDevices(accountDevices);
                        setChooseOtherAccountGestion(false);
                        setListeGestionDesGeofences(accountGeofences);
                      }
                    }
                  }}
                  className="font-bold bg-orange-500 text-white rounded-lg py-2 shadow-lg shadow-black/10"
                >
                  {t("Tous les Comptes")}
                </button>
              )}
              {/*  */}
              {filterGestionAccountDataPagination?.map((account, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      setChooseAccountID(account?.accountID);
                      setCurrentAccountSelected(account);
                      setListeGestionDesVehicules(account?.accountDevices);
                      setListeGestionDesGeofences(account?.accountGeofences);
                      setVoir10DePlus(1);
                      // setAllDevices(account?.accountDevices);

                      setChooseOtherAccountGestion(false);
                      scrollToTop();
                    }}
                    className="shadow-lg cursor-pointer relative overflow-hidden-- bg-orange-50/50 shadow-black/10 flex gap-3 items-center- rounded-lg py-2 px-2 "
                  >
                    <p className="absolute font-semibold top-0 right-0 text-sm rounded-bl-full p-3 pt-2 pr-2 bg-orange-400/10">
                      {index + 1}
                    </p>
                    <FaUserCircle className="text-gray-500 text-[2.5rem] mt-1" />
                    <div>
                      <p className="text-gray-600">
                        {t("Nom du compte")} :{" "}
                        <span className="font-bold notranslate">
                          {account?.description}
                        </span>{" "}
                      </p>
                      <p className="text-gray-600">
                        {t("accountID")} :{" "}
                        <span className="font-bold notranslate">
                          {account?.accountID}
                        </span>{" "}
                      </p>
                      <p className="text-gray-600">
                        {t("Nombre d'appareil")} :{" "}
                        <span className="font-bold">
                          {account?.accountDevices?.length}
                        </span>{" "}
                      </p>
                      <p className="text-gray-600">
                        {t("Nombre d'utilisateur")} :{" "}
                        <span className="font-bold">
                          {account?.accountUsers?.length}
                        </span>{" "}
                      </p>

                      <p className="text-gray-600">
                        {t("Nombre de Groupe")} :{" "}
                        <span className="font-bold">
                          {account?.accountGroupes?.length}
                        </span>{" "}
                      </p>
                      <p className="text-gray-600">
                        {t("Nombre de geozones")} :{" "}
                        <span className="font-bold">
                          {account?.accountGeofences?.length}
                        </span>{" "}
                      </p>
                      <p className="text-gray-600">
                        {t("Nombre de Roles")} :{" "}
                        <span className="font-bold">
                          {account?.accountRules?.length}
                        </span>{" "}
                      </p>
                    </div>
                  </div>
                );
              })}
              {(filterListeDesCompte?.length ||
                filterGestionAccountData?.length) >
                filterGestionAccountDataPagination?.length && (
                <div className="w-full flex justify-center mt-[4rem]">
                  <button
                    onClick={() => {
                      afficherPlusDeRésultat();
                    }}
                    className="bg-orange-600 text-white rounded-lg px-8 py-2 font-bold"
                  >
                    {t("Voir plus de Résultat")}
                  </button>
                </div>
              )}
              {/*  */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChooseOtherAccountDashboard;
