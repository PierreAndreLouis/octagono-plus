import React, { useContext, useState } from "react";
import { DataContext } from "../context/DataContext";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaPlusCircle } from "react-icons/fa";
import { MdErrorOutline, MdSwitchAccount } from "react-icons/md";
import GestionAccountOptionPopup from "../components/gestion_des_comptes/GestionAccountOptionPopup";
import LoadingPageEffectCircle from "../components/Reutilisable/LoadingPageEffectCircle";
import CreateNewAccountPage from "../components/gestion_des_comptes/CreateNewAccountPage";

function GestionDesCompts() {
  const {
    FormatDateHeure,
    account,
    TestDeRequetteDevices,
    getAllAccountsData,
    gestionAccountData,
    setCurrentAccountSelected,
    getAllAccountsDataLoading,
    setListeGestionDesVehicules,
    setCurrentSelectedUserToConnect,
    setShowAccountOptionsPopup,
  } = useContext(DataContext);

  const [showCreateNewAccountPopup, setShowCreateNewAccountPopup] =
    useState(false);

  return (
    <div>
      {account === "sysadmin" ? (
        <div>
          {/* Loading effect quand le donnee sont recherche... */}
          <LoadingPageEffectCircle
            getAllAccountsDataLoading={getAllAccountsDataLoading}
          />

          {/* Composant pour créer un nouveau Compte */}
          <CreateNewAccountPage
            showCreateNewAccountPopup={showCreateNewAccountPopup}
            setShowCreateNewAccountPopup={setShowCreateNewAccountPopup}
          />

          <div className="px-4 pb-40">
            <h2 className="mt-[10rem] text-lg text-center font-bold ">
              Gestion Des Comptes
            </h2>

            {/* <button
              onClick={() => {
                TestDeRequetteDevices(
                  "sysadmin",
                  "admin",
                  "OctagonoGPSHaitiAdmin13@1919"
                );
              }}
            >
              Test de requête Devices
            </button>{" "}
            <br />
            <button
              onClick={() => {
                getAllAccountsData(
                  "sysadmin",
                  "admin",
                  "OctagonoGPSHaitiAdmin13@1919"
                );
              }}
            >
              Tous les donnees regrouper
            </button>{" "} */}

            <div className="flex justify-center mt-4">
              <button
                onClick={() => {
                  setShowCreateNewAccountPopup(true);
                }}
                className="bg-orange-500 shadow-lg shadow-black/20 hover:px-8 transition-all text-white font-semibold rounded-lg py-2 px-6"
              >
                <div className="flex justify-center items-center gap-3">
                  <FaPlusCircle className="text-2xl" />
                  <p className="text-lg text-center">
                    Ajouter un nouveau Compte
                  </p>
                </div>
              </button>{" "}
            </div>

            {/* Liste des Comptes */}
            <div className="hidden-- flex mt-[5rem]  flex-col gap-6 max-w-[50rem] mx-auto">
              {gestionAccountData?.map((account, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      setCurrentAccountSelected(account);
                      setListeGestionDesVehicules(account?.accountDevices);
                      setShowAccountOptionsPopup(true);
                      setCurrentSelectedUserToConnect(null);
                    }}
                    className="shadow-lg cursor-pointer bg-orange-50/50 relative md:flex gap-4 justify-between rounded-lg px-2 md:px-4 py-4"
                  >
                    <div className="bg-gray-100-- pb-1 pl-2 text-sm absolute top-0 right-0 rounded-bl-full font-bold w-[2rem] h-[2rem] flex justify-center items-center">
                      {index + 1}
                    </div>
                    <div className="flex  gap-3  ">
                      <MdSwitchAccount className="text-[3rem] text-orange-500" />
                      <div className=" w-full flex flex-wrap justify-between gap-x-4 ">
                        <div>
                          <div className="flex flex-wrap">
                            <p className="font-bold- text-gray-700">
                              Nom du Compte :
                            </p>
                            <span className=" dark:text-orange-500 font-bold text-gray-600 pl-5">
                              {account?.description}
                            </span>
                          </div>{" "}
                          {/*  */}
                          <div className="flex flex-wrap mt-1">
                            <p className="font-bold- text-gray-700">
                              Nombre d'utilisateurs :
                            </p>
                            <span className=" dark:text-orange-500 font-semibold text-gray-600 pl-5">
                              {account?.accountUsers?.length}
                            </span>
                          </div>{" "}
                          {/*  */}
                          <div className="flex flex-wrap mt-1">
                            <p className="font-bold- text-gray-700">
                              Nombre d'appareils :
                            </p>
                            <span className=" dark:text-orange-500 font-semibold text-gray-600 pl-5">
                              {account?.accountDevices?.length}
                            </span>
                          </div>{" "}
                          {/*  */}
                          {/*  */}
                          <div className="flex flex-wrap mt-1">
                            <p className="font-bold- text-gray-700">
                              Nombre de Groupe :
                            </p>
                            <span className=" dark:text-orange-500 font-semibold text-gray-600 pl-5">
                              {account?.accountGroupes?.length}
                            </span>
                          </div>{" "}
                          {/*  */}
                          <div className="flex flex-wrap mt-1">
                            <p className="font-bold- text-gray-700">
                              Date de creation :
                            </p>
                            <span className=" dark:text-orange-500 font-semibold text-gray-600 pl-5">
                              {FormatDateHeure(account?.creationTime).date}
                              <span className="px-3">-</span>
                              {FormatDateHeure(account?.creationTime).time}
                            </span>
                          </div>{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/*  */}
            </div>
            {/*  */}
            <GestionAccountOptionPopup />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 justify-center items-center w-full min-h-screen">
          <h1 className="font-semibold text-2xl">
            Tu n'es pas autoriser a acceder a cette page
          </h1>
          <Link
            to="/home"
            className="px-4 py-2 rounded-lg text-white bg-orange-600"
          >
            Retour a la page d’accueil
          </Link>
        </div>
      )}
    </div>
  );
}

export default GestionDesCompts;
