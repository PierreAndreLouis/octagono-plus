import React, { useContext } from "react";
import { FaChevronDown, FaUserCircle } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { DataContext } from "../../context/DataContext";
import { useTranslation } from "react-i18next";

function HeaderDashboardSysadmin({
  setDocumentationPage,
  setChooseOtherAccountGestion,
  setChooseOneAccountToContinue,
  setChooseAccountFromGeozoneSection,
  setReadDocumentationSideBar,
  readDocumentationSideBar,
}) {
  const [t, i18n] = useTranslation();

  const { currentAccountSelected, isDashboardHomePage, account, username } =
    useContext(DataContext);
  return (
    <header className="fixed z-[999999999999999999999] top-0 left-0 right-0 bg-white">
      <div className="flex shadow-lg-- shadow-black/20 justify-between items-center md:px-10 px-4 py-2">
        <div className="flex items-center gap-3">
          <img src="/img/cars/logo.png" className="w-7" alt="Logo" />
          <h2 className="text-md hidden md:block sm:text-xl font-bold opacity-70">
            Octagono<span className="text-orange-600">PLus</span>
          </h2>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex cursor-pointer gap-2 items-center">
            <FaUserCircle
              onClick={() => {
                setDocumentationPage("userInfo");
              }}
              className="text-[1.4rem] mr-2 text-gray-600"
            />

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
                {/* {currentAccountSelected?.description ||
                  `${t("Tous les comptes")}`} */}
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
