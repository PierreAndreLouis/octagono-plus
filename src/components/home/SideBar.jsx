import React, { useContext, useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import { LuMapPin } from "react-icons/lu";
import { MdLogout } from "react-icons/md";
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

        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}

        <Link
          to="/home?tab=acceuil"
          onClick={() => {
            setShowSideBar(true);
            handleTabClick("acceuil");
          }}
          className={`flex text-gray-600 border-b border-gray-300 py-4 gap-4 text-lg hover:text-orange-500 cursor-pointer items-center ${
            tab === "acceuil" ? "text-orange-500" : ""
          } dark:text-gray-300 dark:border-gray-600 dark:hover:text-orange-400`}
        >
          <IoHomeOutline />
          <h3>Accueil</h3>
        </Link>

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
          className={`flex text-gray-600 border-b border-gray-300 py-4 gap-4 text-lg hover:text-orange-500 cursor-pointer items-center ${
            tab === "profile" ? "text-orange-500" : ""
          } dark:text-gray-300 dark:border-gray-600 dark:hover:text-orange-400`}
        >
          <FaRegUser />
          <h3>Mon profil</h3>
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
            className={`flex text-gray-600 border-b border-gray-300 py-4 gap-4 text-lg hover:text-orange-500 cursor-pointer items-center ${
              tab === "ajouter" ? "text-orange-500" : ""
            } dark:text-gray-300 dark:border-gray-600 dark:hover:text-orange-400`}
          >
            <IoMdAddCircleOutline />
            <h3>Ajouter un véhicule</h3>
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
            className={`flex text-gray-600 border-b border-gray-300 py-4 gap-4 text-lg hover:text-orange-500 cursor-pointer items-center ${
              tab === "modifier" ? "text-orange-500" : ""
            } dark:text-gray-300 dark:border-gray-600 dark:hover:text-orange-400`}
          >
            <FaRegEdit />
            <h3>Modifier ou supprimer un véhicule</h3>
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
          className={`flex text-gray-600 border-b border-gray-300 py-4 gap-4 text-lg hover:text-orange-500 cursor-pointer items-center ${
            tab === "localisation" ? "text-orange-500" : ""
          } dark:text-gray-300 dark:border-gray-600 dark:hover:text-orange-400`}
        >
          <LuMapPin />
          <h3>Localisation des véhicules</h3>
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
          className={`flex text-gray-600 border-b border-gray-300 py-4 gap-4 text-lg hover:text-orange-500 cursor-pointer items-center ${
            tab === "rapport" ? "text-orange-500" : ""
          } dark:text-gray-300 dark:border-gray-600 dark:hover:text-orange-400`}
        >
          <FaCar />
          <h3>Rapport des véhicules</h3>
        </Link>

        {/* <Link
          to="/gestion_geofences?tab=geozone"
          onClick={() => {
            setShowSideBar(true);
            handleTabClick("geozone");
          }}
          className={`flex text-gray-600 border-b border-gray-300 py-4 gap-4 text-lg hover:text-orange-500 cursor-pointer items-center ${
            tab === "geozone" ? "text-orange-500" : ""
          } dark:text-gray-300 dark:border-gray-600 dark:hover:text-orange-400`}
        >
          <IoEarth />
          <h3>Gestion des Geozones</h3>
        </Link> */}

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
          className="flex text-red-600 font-semibold border-b border-gray-300 py-4 gap-4 text-lg hover:text-orange-500 cursor-pointer items-center dark:text-red-400 dark:border-gray-600 dark:hover:text-orange-400"
        >
          <MdLogout />
          <h3>Déconnexion</h3>
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
