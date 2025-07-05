import React, { useContext, useState } from "react";
import { DataContext } from "../context/DataContext";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaPlusCircle } from "react-icons/fa";
import { MdErrorOutline, MdSwitchAccount, MdUpdate } from "react-icons/md";
import GestionAccountOptionPopup from "../components/gestion_des_comptes/GestionAccountOptionPopup";
import LoadingPageEffectCircle from "../components/Reutilisable/LoadingPageEffectCircle";
import { IoCloseOutline, IoOptions, IoSearchOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

function GestionDesRoles({ setDocumentationPage }) {
  const {
    
    gestionAccountData,
    getAllAccountsDataLoading,
 
  } = useContext(DataContext);
  const [t, i18n] = useTranslation();

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
          <h2 className="mt-[10rem]-- text-lg text-center font-bold ">
            {t("Gestion Des Role")}
            {/* ({filterListeDesCompte?.length}) */}
          </h2>
          <div className="flex  justify-center mt-4">
            <button
              onClick={() => {
                setDocumentationPage("Ajouter_nouveau_role");
              }}
              className="bg-orange-500 w-full max-w-[30rem] shadow-lg shadow-black/20 hover:px-8 transition-all text-white font-semibold rounded-lg py-2 px-6"
            >
              <div className="flex justify-center items-center gap-3">
                <FaPlusCircle className="text-2xl" />
                <p className="text-[1rem] text-center">
                  {t("Ajouter un nouveau Role")}
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
                placeholder={`${t("Rechercher un Role")}`}
                required
                value={inputSearchItem}
                onChange={(e) => setInputSearchItem(e.target.value)}
                className=" px-3 w-full focus:outline-0  dark:text-white rounded-md dark:bg-gray-800 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400   sm:text-sm sm:leading-6"
              />
            
            
              <IoSearchOutline className="text-2xl text-gray-500 border-l cursor-pointer border-l-gray-400 min-w-[3rem]" />
            </div>
       
       
          </div>
          {/* Liste des Comptes */}
          <div className="hidden-- flex mt-[5rem] min-h-[50vh] flex-col gap-6 max-w-[50rem] mx-auto">
          
          

            {/*  */}
          </div>
          {/*  */}
          <GestionAccountOptionPopup
            setDocumentationPage={setDocumentationPage}
          />
        </div>
      </div>
  
    </div>
  );
}

// export default GestionDesRoles;

export default GestionDesRoles;
