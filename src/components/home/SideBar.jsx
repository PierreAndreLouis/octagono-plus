import React, { useContext, useState, useEffect } from "react";
import { FaAddressBook, FaBook, FaRegEdit } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import { LuMapPin } from "react-icons/lu";
import {
  MdGTranslate,
  MdLogout,
  MdSpaceDashboard,
  MdSupervisorAccount,
} from "react-icons/md";
import { DataContext } from "../../context/DataContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logout from "../login/Logout";
import { IoHomeOutline } from "react-icons/io5";
import { FaCar } from "react-icons/fa";
import InstallationPWA from "../../pages/InstallationPWA";
import { IoEarth } from "react-icons/io5";

function SideBar() {
  const {
    showSideBar,
    setShowSideBar,
    logOutPopup,
    setLogOutPopup,
    handleTabClick,
    tab,
    username,
    setHistoriqueSelectedLocationIndex,
    readDocumentation,
    setReadDocumentation,
    account,
    adminUsername,
    adminAccount,
    setIsDashboardHomePage,
    clearDataIndexedbStore,
    setMergedDataHome,
    setGeofenceData,
    setDonneeFusionnéForRapport,
    setChooseOtherLanguagePopup,
  } = useContext(DataContext);
  let x;
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  x;

  return (
    <div
      className={`${
        showSideBar ? "-translate-x-[100%]" : ""
      } md:hidden--- transition-all bg-black/50-- fixed z-10 inset-0`}
    >
      <div className="overflow-auto transition-all pt-20 relative px-8 max-w-[25rem] h-screen z-20 bg-white shadow-2xl dark:bg-gray-800">
        {/* Popup pour se déconnecter */}
        {logOutPopup && (
          <div className="z-40">
            <Logout setLogOutPopup={setLogOutPopup} />
          </div>
        )}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}

        {/* Close icon */}
        <IoCloseSharp
          onClick={() => setShowSideBar(true)}
          className="absolute top-20 right-5 text-2xl text-red-500 cursor-pointer"
        />

        <Link
          to="/home?tab=acceuil"
          onClick={() => {
            setShowSideBar(true);
            handleTabClick("acceuil");
          }}
          className={`flex text-gray-600 border-b border-gray-300 py-3 gap-4 text-lg hover:text-orange-500 cursor-pointer items-center ${
            tab === "acceuil" ? "text-orange-500" : ""
          } dark:text-gray-300 dark:border-gray-600 dark:hover:text-orange-400`}
        >
          <IoHomeOutline />
          <h3 className="font-semibold text-[1.1rem]">Accueil</h3>
        </Link>

        {(account === "sysadmin" || adminAccount === "sysadmin") && (
          // {adminAccount === "sysadmin" && (
          <Link
            to="/dashboard_admin_page"
            onClick={() => {
              setShowSideBar(true);
              handleTabClick("dashboard");
              setIsDashboardHomePage(true);

              clearDataIndexedbStore("mergedDataHome");
              clearDataIndexedbStore("geofenceData");
              clearDataIndexedbStore("donneeFusionnéForRapport");

              // setMergedDataHome();
              // setGeofenceData();
              // setDonneeFusionnéForRapport();
            }}
            className={`flex text-gray-600 border-b border-gray-300 py-3 gap-4 text-lg hover:text-orange-500 cursor-pointer items-center ${
              tab === "dashboard" ? "text-orange-500" : ""
            } dark:text-gray-300 dark:border-gray-600 dark:hover:text-orange-400`}
          >
            <MdSpaceDashboard />
            <h3 className="font-semibold text-[1.1rem]">Dashboard</h3>
          </Link>
        )}

        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}

        <Link
          to="/User_Profile?tab=profile"
          onClick={() => {
            setShowSideBar(true);
            handleTabClick("profile");
          }}
          className={`flex text-gray-600 border-b border-gray-300 py-3 gap-4 text-lg hover:text-orange-500 cursor-pointer items-center ${
            tab === "profile" ? "text-orange-500" : ""
          } dark:text-gray-300 dark:border-gray-600 dark:hover:text-orange-400`}
        >
          <FaRegUser />
          <h3 className="font-semibold text-[1.1rem]">Mon profil</h3>
        </Link>

        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}

        {username === "admin" && (
          <Link
            to="/ajouter_vehicule?tab=ajouter"
            onClick={() => {
              setShowSideBar(true);
              handleTabClick("ajouter");
            }}
            className={`flex text-gray-600 border-b border-gray-300 py-3 gap-4 text-lg hover:text-orange-500 cursor-pointer items-center ${
              tab === "ajouter" ? "text-orange-500" : ""
            } dark:text-gray-300 dark:border-gray-600 dark:hover:text-orange-400`}
          >
            <IoMdAddCircleOutline />
            <h3 className="font-semibold text-[1.1rem]">Ajouter un véhicule</h3>
          </Link>
        )}

        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}

        {username === "admin" && (
          <Link
            to="/modifier_vehicule?tab=modifier"
            onClick={() => {
              setShowSideBar(true);
              handleTabClick("modifier");
            }}
            className={`flex text-gray-600 border-b border-gray-300 py-3 gap-4 text-lg hover:text-orange-500 cursor-pointer items-center ${
              tab === "modifier" ? "text-orange-500" : ""
            } dark:text-gray-300 dark:border-gray-600 dark:hover:text-orange-400`}
          >
            <FaRegEdit />
            <h3 className="font-semibold text-[1.1rem]">
              Modifier ou supprimer un véhicule
            </h3>
          </Link>
        )}

        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}

        <Link
          to="/Groupe_vehicule_location?tab=localisation"
          onClick={() => {
            setHistoriqueSelectedLocationIndex(0);
            setShowSideBar(true);
            handleTabClick("localisation");
          }}
          className={`flex text-gray-600 border-b border-gray-300 py-3 gap-4 text-lg hover:text-orange-500 cursor-pointer items-center ${
            tab === "localisation" ? "text-orange-500" : ""
          } dark:text-gray-300 dark:border-gray-600 dark:hover:text-orange-400`}
        >
          <LuMapPin />
          <h3 className="font-semibold text-[1.1rem]">
            Localisation des véhicules
          </h3>
        </Link>

        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}

        <Link
          to="/rapport_page_details?tab=rapport"
          onClick={() => {
            setShowSideBar(true);
            handleTabClick("rapport");
          }}
          className={`flex text-gray-600 border-b border-gray-300 py-3 gap-4 text-lg hover:text-orange-500 cursor-pointer items-center ${
            tab === "rapport" ? "text-orange-500" : ""
          } dark:text-gray-300 dark:border-gray-600 dark:hover:text-orange-400`}
        >
          <FaCar />
          <h3 className="font-semibold text-[1.1rem]">Rapport des véhicules</h3>
        </Link>

        <Link
          to="/gestion_geofences?tab=geozone"
          onClick={() => {
            setShowSideBar(true);
            handleTabClick("geozone");
          }}
          className={`flex text-gray-600 border-b border-gray-300 py-3 gap-4 text-lg hover:text-orange-500 cursor-pointer items-center ${
            tab === "geozone" ? "text-orange-500" : ""
          } dark:text-gray-300 dark:border-gray-600 dark:hover:text-orange-400`}
        >
          <IoEarth />
          <h3 className="font-semibold text-[1.1rem]">Gestion des Geozones</h3>
        </Link>
        {account === "sysadmin" && (
          <Link
            to="/gestion_des_comptes?tab=comptes"
            onClick={() => {
              setShowSideBar(true);
              handleTabClick("comptes");
            }}
            className={`flex text-gray-600 border-b border-gray-300 py-3 gap-4 text-lg hover:text-orange-500 cursor-pointer items-center ${
              tab === "comptes" ? "text-orange-500" : ""
            } dark:text-gray-300 dark:border-gray-600 dark:hover:text-orange-400`}
          >
            <MdSupervisorAccount />
            <h3 className="font-semibold text-[1.1rem]">Gestion des Comptes</h3>
          </Link>
        )}

        <Link
          // to="/gestion_geofences?tab=geozone"
          onClick={() => {
            setReadDocumentation(true);
            setShowSideBar(true);
            // handleTabClick("geozone");
          }}
          className={`flex text-gray-600 border-b border-gray-300 py-3 gap-4 text-lg hover:text-orange-500 cursor-pointer items-center $ dark:text-gray-300 dark:border-gray-600 dark:hover:text-orange-400`}
        >
          <FaBook />
          <h3 className="font-semibold text-[1.1rem]">Manuel d'utilisation</h3>
        </Link>

        <Link
          // to="/gestion_geofences?tab=geozone"
          onClick={() => {
            // setReadDocumentation(true);
            setShowSideBar(true);
            setChooseOtherLanguagePopup(true);

            // handleTabClick("geozone");
          }}
          className={`flex text-gray-600 border-b border-gray-300 py-3 gap-4 text-lg hover:text-orange-500 cursor-pointer items-center $ dark:text-gray-300 dark:border-gray-600 dark:hover:text-orange-400`}
        >
          <MdGTranslate />
          <h3 className="font-semibold text-[1.1rem]">Traduction</h3>
        </Link>

        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}

        <div>
          <InstallationPWA />
        </div>

        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}

        <div
          onClick={() => {
            setLogOutPopup(true);
          }}
          className="flex text-red-600 font-semibold border-b border-gray-300 py-3 gap-4 text-lg hover:text-orange-500 cursor-pointer items-center dark:text-red-400 dark:border-gray-600 dark:hover:text-orange-400"
        >
          <MdLogout />
          <h3 className="font-semibold text-[1.1rem]">Déconnexion</h3>
        </div>

        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
      </div>
    </div>
  );
}

export default SideBar;
