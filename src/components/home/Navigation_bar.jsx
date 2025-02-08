import React, { useContext } from "react";
import { IoMdHome } from "react-icons/io";
import { FaPlus, FaRegEdit, FaCar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import { DataContext } from "../../context/DataContext";
import { MdOutlineStickyNote2 } from "react-icons/md";
import { MdLocationPin } from "react-icons/md";
import { GiPathDistance } from "react-icons/gi";

function NavigationBar() {
  const {
    handleTabClick,
    tab,
    username,
    setHistoriqueSelectedLocationIndex,
    setShowHistoriqueInMap,
    currentVéhicule,
    setCurrentVéhicule,
    setVéhiculeHistoriqueDetails,
    véhiculeNotActiveToday,
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
  x;

  // Pour définir un véhicule par défaut
  const chooseFirstVéhicule = () => {
    if (
      !currentVéhicule &&
      véhiculeNotActiveToday &&
      véhiculeNotActiveToday.length > 0
    ) {
      setCurrentVéhicule(véhiculeNotActiveToday[0]);
      setVéhiculeHistoriqueDetails(véhiculeNotActiveToday[0].véhiculeDetails);
    }
  };
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
    <div className="bg-red fixed bottom-0 left-0 right-0 dark:bg-slate-800 lg:hidden z-[1] ">
      <div className="grid grid-cols-5 gap-4 justify-between px-4 bg-gray-200 dark:bg-gray-900/50 py-0 ">
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}

        <Link
          to="/home?tab=acceuil"
          onClick={() => handleTabClick("acceuil")}
          className={`${
            tab === "acceuil"
              ? "text-orange-500 dark:text-orange-300"
              : "text-gray-600 dark:text-gray-400"
          } flex flex-col cursor-pointer hover:text-orange-500 dark:hover:text-orange-300 justify-center items-center`}
        >
          <IoMdHome className="text-xl" />
          <h3 className="text-sm">Accueil</h3>
        </Link>

        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}

        {username === "admin" ? (
          <Link
            to="/modifier_vehicule?tab=modifier"
            onClick={() => handleTabClick("modifier")}
            className={`${
              tab === "modifier"
                ? "text-orange-500 dark:text-orange-300"
                : "text-gray-600 dark:text-gray-400"
            } flex flex-col cursor-pointer hover:text-orange-500 dark:hover:text-orange-300 justify-center items-center`}
          >
            <FaRegEdit className="text-xl" />
            <h3 className="text-sm">Modifier</h3>
          </Link>
        ) : (
          <Link
            to="/voiture_historique"
            onClick={() => {
              handleTabClick("trajet_Vehicule");
              chooseFirstVéhicule();
              setShowHistoriqueInMap(true);
            }}
            className={`${
              tab === "trajet_Vehicule"
                ? "text-orange-500 dark:text-orange-300"
                : "text-gray-600 dark:text-gray-400"
            } flex flex-col cursor-pointer hover:text-orange-500 dark:hover:text-orange-300 justify-center items-center`}
          >
            <GiPathDistance className="text-xl" />
            {/* <FaCar className="text-xl" /> */}
            <h3 className="text-sm">Trajet</h3>
          </Link>
        )}

        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}

        {username === "admin" ? (
          <div className="flex justify-center items-center">
            <Link
              to="/ajouter_vehicule?tab=ajouter"
              onClick={() => handleTabClick("ajouter")}
              className="min-w-14 h-14 cursor-pointer -translate-y-3 border-4 border-gray-200 dark:border-slate-800 bg-orange-500 dark:bg-orange-600 flex justify-center items-center rounded-full"
            >
              <FaPlus className="text-white text-xl" />
            </Link>
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <Link
              to="/Groupe_vehicule_location?tab=location"
              onClick={() => {
                handleTabClick("location");
                setHistoriqueSelectedLocationIndex(0);
              }}
              className="min-w-14 h-14 cursor-pointer -translate-y-3 border-4 border-gray-200 dark:border-slate-800 bg-orange-500 dark:bg-orange-600 flex justify-center items-center rounded-full"
            >
              <MdLocationPin className="text-white text-[1.7rem]" />
            </Link>
          </div>
        )}

        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}

        <Link
          to="/rapport_page_details?tab=rapport"
          onClick={() => handleTabClick("rapport")}
          className={`${
            tab === "rapport"
              ? "text-orange-500 dark:text-orange-300"
              : "text-gray-600 dark:text-gray-400"
          } flex flex-col cursor-pointer hover:text-orange-500 dark:hover:text-orange-300 justify-center items-center`}
        >
          <MdOutlineStickyNote2 className="text-xl" />
          {/* <FaCar className="text-xl" /> */}

          <h3 className="text-sm">Rapport</h3>
        </Link>

        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}

        <Link
          to="/User_Profile?tab=profile"
          onClick={() => handleTabClick("profile")}
          className={`${
            tab === "profile"
              ? "text-orange-500 dark:text-orange-300"
              : "text-gray-600 dark:text-gray-400"
          } flex flex-col cursor-pointer hover:text-orange-500 dark:hover:text-orange-300 justify-center items-center`}
        >
          <FaRegCircleUser className="text-xl" />
          <h3 className="text-sm">Profil</h3>
        </Link>

        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
      </div>
    </div>
  );
}

export default NavigationBar;
