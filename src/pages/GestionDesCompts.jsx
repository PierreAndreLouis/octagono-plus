import React, { useContext, useState } from "react";
import { DataContext } from "../context/DataContext";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaPlusCircle } from "react-icons/fa";
import { MdErrorOutline, MdSwitchAccount, MdUpdate } from "react-icons/md";
import GestionAccountOptionPopup from "../components/gestion_des_comptes/GestionAccountOptionPopup";
import LoadingPageEffectCircle from "../components/Reutilisable/LoadingPageEffectCircle";
import { IoCloseOutline, IoOptions, IoSearchOutline } from "react-icons/io5";

function GestionDesCompts({ setDocumentationPage }) {
  const {
    FormatDateHeure,
    account,
    TestDeRequetteDevices,
    gestionAccountData,
    setCurrentAccountSelected,
    getAllAccountsDataLoading,
    setCurrentSelectedUserToConnect,
    setShowAccountOptionsPopup,
    ListeDesRolePourLesUserFonction,
    comptes,
    accountDevices,
    accountGroupes,
    accountUsers,
    fetchAccountDevices,
    fetchAccountGroupes,
    fetchGroupeDevices,
    fetchAccountUsers,
    fetchUserDevices,
    fetchUserGroupes,
    fetchAllComptes,
    testFonctin,
    password,
    fetchAccountGeofences,
    accountGeofences,
    adminAccount,
    adminUser,
    adminPassword,
    véhiculeDetails,
  } = useContext(DataContext);

  const [inputSearchItem, setInputSearchItem] = useState("");

  const filterListeDesCompte = inputSearchItem
    ? gestionAccountData.filter((item) =>
        item?.description.toLowerCase().includes(inputSearchItem.toLowerCase())
      )
    : gestionAccountData;

  ///////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div>
      {/* {account === "sysadmin" ? ( */}
      <div>
        {/* Loading effect quand le donnee sont recherche... */}
        <LoadingPageEffectCircle
          getAllAccountsDataLoading={getAllAccountsDataLoading}
        />

        <div className="px-4 pt-10 mt-4-- pb-40 bg-white rounded-lg">
          <h2
            onClick={() => {
              console.log("comptes", comptes);
              console.log("accountDevices", accountDevices);
              console.log("accountGroupes", accountGroupes);
              console.log("accountUsers", accountUsers);
            }}
            className="mt-[10rem]-- text-lg text-center font-bold "
          >
            Gestion Des Comptes ({filterListeDesCompte?.length})
          </h2>
          {/* <button
            onClick={() => {
              console.log(véhiculeDetails);
            }}
          >
            Test
          </button>{" "}
          <p
            onClick={() => {
              console.log(accountDevices);
            }}
          >
            accountDevices
          </p> */}
          {/*  <br />
            <button
              onClick={() => {
                testFonction2();
              }}
            >
              Test fonction 2
            </button>{" "}
            <br />
            <button
              onClick={() => {
                testFonction3();
              }}
            >
              Test fonction 3
            </button>{" "}
            <br />
            <button
              onClick={() => {
                testFonction4();
              }}
            >
              Test fonction 4
            </button>{" "}
            <br /> */}
          <div className="flex  justify-center mt-4">
            <button
              onClick={() => {
                setDocumentationPage("Ajouter_nouveau_compte");
              }}
              className="bg-orange-500 w-full max-w-[30rem] shadow-lg shadow-black/20 hover:px-8 transition-all text-white font-semibold rounded-lg py-2 px-6"
            >
              <div className="flex justify-center items-center gap-3">
                <FaPlusCircle className="text-2xl" />
                <p className="text-[1rem] text-center">
                  Ajouter un nouveau Compte
                </p>
              </div>
            </button>{" "}
          </div>
          <div className="flex mt-4 max-w-[30rem] mx-auto justify-between items-center gap-2 ">
            <div className="mx-auto border w-full border-gray-400 rounded-md flex items-center justify-between max-w-[30rem] ">
              <input
                id="text"
                name="text"
                type="text"
                placeholder="Rechercher un compte"
                required
                value={inputSearchItem}
                onChange={(e) => setInputSearchItem(e.target.value)}
                className=" px-3 w-full focus:outline-0  dark:text-white rounded-md dark:bg-gray-800 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400   sm:text-sm sm:leading-6"
              />
              {/* <IoCloseOutline
                  onClick={() => setInputSearchItem("")}
                  className="text-2xl min-w-[2rem] mr-2 cursor-pointer text-red-500"
                /> */}
              <IoSearchOutline className="text-2xl text-gray-500 border-l cursor-pointer border-l-gray-400 min-w-[3rem]" />
            </div>
            {/* <div
                onClick={() => {
                  // deviceUpdateFonction();
                }}
                className="border cursor-pointer px-3   py-2 border-gray-300 rounded-md bg-orange-100"
              >
                <MdUpdate className="text-xl " />
              </div> */}
          </div>
          {/* Liste des Comptes */}
          <div className="hidden-- flex mt-[5rem]  flex-col gap-6 max-w-[50rem] mx-auto">
            {filterListeDesCompte
              ?.slice()
              .sort(
                (a, b) => b?.accountDevices?.length - a?.accountDevices?.length
                // b?.creationTime - a?.creationTime
              )
              ?.map((account, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      setCurrentAccountSelected(account);
                      setShowAccountOptionsPopup(true);
                      setCurrentSelectedUserToConnect(null);
                    }}
                    className="shadow-lg-- shadow-inner shadow-black/10 bg-gray-50 /50 relative md:flex gap-4 justify-between rounded-lg px-2 md:px-4 py-4"
                  >
                    <div className="bg-gray-100-- pb-1 pl-2 text-sm absolute top-0 right-0 rounded-bl-full font-bold w-[2rem] h-[2rem] flex justify-center items-center">
                      {index + 1}
                    </div>
                    <div className="flex  gap-3  w-full">
                      <MdSwitchAccount className="text-[3rem] hidden sm:block text-orange-500" />
                      <div className=" w-full  flex flex-wrap sm:flex-nowrap justify-between items-end gap-x-4 ">
                        <div className="w-full ">
                          <MdSwitchAccount className="text-[3rem] sm:hidden text-orange-500" />
                          <div className="flex flex-wrap">
                            <p className="font-bold- text-gray-700">
                              Nom du Compte :
                            </p>
                            <span className=" dark:text-orange-500 font-bold text-gray-600 pl-5">
                              {account?.description}
                            </span>
                          </div>{" "}
                          <div className="flex flex-wrap">
                            <p className="font-bold- text-gray-700">
                              ID du Compte :
                            </p>
                            <span className=" dark:text-orange-500 font-bold text-gray-600 pl-5">
                              {account?.accountID}
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
                          <div className="flex flex-wrap mt-1">
                            <p className="font-bold- text-gray-700">
                              Nombre de Geofences :
                            </p>
                            <span className=" dark:text-orange-500 font-semibold text-gray-600 pl-5">
                              {account?.accountGeofences?.length}
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
                        <div className="flex sm:justify-end w-full xs:justify-start justify-center">
                          <button
                            onClick={() => {
                              setShowAccountOptionsPopup(true);
                            }}
                            className={`  bg-orange-500 text-white w-full cursor-pointer xs:w-auto mt-4 md:mt-0 text-sm- border-[0.02rem] border-gray-300- text-sm  font-semibold rounded-lg py-2 px-4 flex gap-2 justify-center items-center`}
                          >
                            <p className="text-[.8rem]">Options</p>
                            <IoOptions className="text-xl" />
                          </button>{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

            {/*  */}
          </div>
          {/*  */}
          <GestionAccountOptionPopup
            setDocumentationPage={setDocumentationPage}
          />
        </div>
      </div>
      {/* // ) : (
      //   <div className="flex flex-col gap-6 justify-center items-center w-full min-h-screen">
      //     <h1 className="font-semibold text-2xl">
      //       Tu n'es pas autoriser a acceder a cette page
      //     </h1>
      //     <Link
      //       to="/home"
      //       className="px-4 py-2 rounded-lg text-white bg-orange-600"
      //     >
      //       Retour a la page d’accueil
      //     </Link>
      //   </div>
      // )} */}
    </div>
  );
}

export default GestionDesCompts;
