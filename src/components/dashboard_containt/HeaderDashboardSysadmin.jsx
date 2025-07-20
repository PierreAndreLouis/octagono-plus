import React, { useContext } from "react";
import { FaChevronDown, FaUserCircle } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { DataContext } from "../../context/DataContext";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

function HeaderDashboardSysadmin({
  setDocumentationPage,
  setChooseOtherAccountGestion,
  setChooseOneAccountToContinue,
  setChooseAccountFromGeozoneSection,
  setReadDocumentationSideBar,
  readDocumentationSideBar,
}) {
  const [t, i18n] = useTranslation();
  const navigate = useNavigate();
  const {
    currentAccountSelected,
    isDashboardHomePage,
    account,
    username,
    appareilPourAfficherSurCarte,
  } = useContext(DataContext);
  return (
    <header className="fixed z-[999999999999999999999] top-0 left-0 right-0 bg-white">
      <div className="flex shadow-lg-- shadow-black/20 justify-between items-center md:px-6 px-4 py-2">
        <div
          onClick={() => {
            // navigate("/Dashboard");
            console.log(
              "appareilPourAfficherSurCarte",
              appareilPourAfficherSurCarte
            );
          }}
          className="flex items-center gap-2"
        >
          <img
            src="/img/cars/logo.png"
            className="w-[1.8rem] md:w-[2.11rem]"
            alt="Logo"
          />
          {/* // ) : ( */}
          <img
            src="/img/logo/octagonogpsLogo.png"
            className="w-[1.7rem] md:w-[2rem]"
            alt="Logo"
          />
          {/* // )} */}
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex cursor-pointer gap-2 items-center">
            <Link to="/userInfo">
              <FaUserCircle
                onClick={() => {
                  setDocumentationPage("userInfo");
                }}
                className="text-[1.4rem] mr-2 text-gray-600"
              />
            </Link>

            <div
              onClick={() => {
                if (isDashboardHomePage) {
                  setChooseOtherAccountGestion(true);
                  setChooseOneAccountToContinue(false);
                  setChooseAccountFromGeozoneSection(false);
                }
              }}
              className=" text-gray-800 flex flex-col gap-0"
            >
              <p className="font-semibold notranslate max-w-[8rem] whitespace-nowrap text-ellipsis overflow-hidden text-gray-600">
                {isDashboardHomePage
                  ? currentAccountSelected
                    ? currentAccountSelected?.description
                    : `${t("Tous les comptes")}`
                  : account + " / " + username}
              </p>
            </div>
            {isDashboardHomePage && (
              <FaChevronDown
                onClick={() => {
                  setChooseOtherAccountGestion(true);
                  setChooseOneAccountToContinue(false);
                  setChooseAccountFromGeozoneSection(false);
                }}
                className="mt-1"
              />
            )}
          </div>
          <div
            onClick={() => {
              setReadDocumentationSideBar(!readDocumentationSideBar);
            }}
            className="flex lg:hidden-- cursor-pointer text-gray-700 items-center gap-3 text-xl"
          >
            <IoMenu className="text-[1.6rem] min-w-[1.5rem] text-orange-600" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default HeaderDashboardSysadmin;
