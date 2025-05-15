import React, { useContext } from "react";
import { IoClose } from "react-icons/io5";
import { DataContext } from "../../context/DataContext";
import { FaUserCircle } from "react-icons/fa";

function ChooseOtherAccountDashboard({
  chooseOtherAccountGestion,
  setChooseOtherAccountGestion,
  searchInputTerm,
  setSearchInputTerm,
  filterGestionAccountData,
}) {
  const {
    setCurrentAccountSelected,
    setListeGestionDesVehicules,
    currentAccountSelected,
  } = useContext(DataContext);
  return (
    <>
      {chooseOtherAccountGestion && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999999999999999999999999999999]">
          <div className="bg-white overflow-hidden w-full mx-4 max-w-[40rem] min-h-[70vh] rounded-lg">
            <div className="relative">
              <h2 className="text-center font-semibold text-lg bg-orange-100 py-4">
                Liste des Comptes
              </h2>

              <IoClose
                onClick={() => {
                  setChooseOtherAccountGestion(false);
                }}
                className="absolute text-2xl text-red-600 top-4 cursor-pointer right-4"
              />
            </div>
            <div className="flex mx-3 my-4 gap-2 justify-between items-center">
              <input
                className="w-full dark:bg-gray-800 border p-4 py-1.5 rounded-lg  dark:border-gray-600 dark:text-gray-200"
                type="text"
                placeholder="Rechercher un compte"
                value={searchInputTerm}
                onChange={(e) => {
                  setSearchInputTerm(e.target.value);
                }}
              />

              <p className="border cursor-pointer bg-gray-50 font-semibold  rounded-lg px-2 py-1.5">
                Rechercher
              </p>
              {/* </Tooltip> */}
            </div>
            <div className="flex overflow-auto h-[45vh] pb-20 flex-col gap-4 mx-3">
              <button
                onClick={() => {
                  {
                    setCurrentAccountSelected(null);
                    setChooseOtherAccountGestion(false);
                  }
                }}
                className="font-bold bg-orange-500 text-white rounded-lg py-2 shadow-lg shadow-black/10"
              >
                Tous les Comptes
              </button>{" "}
              {/*  */}
              {filterGestionAccountData?.map((account, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      console.log(account);
                      console.log(currentAccountSelected);

                      setCurrentAccountSelected(account);
                      setListeGestionDesVehicules(account?.accountDevices);
                      setChooseOtherAccountGestion(false);
                    }}
                    className="shadow-lg cursor-pointer relative overflow-hidden-- bg-orange-50/50 shadow-black/10 flex gap-3 items-center- rounded-lg py-2 px-2 "
                  >
                    <p className="absolute font-semibold top-0 right-0 text-sm rounded-bl-full p-3 pt-2 pr-2 bg-orange-400/10">
                      {index + 1}
                    </p>
                    <FaUserCircle className="text-gray-500 text-[2.5rem] mt-1" />
                    <div>
                      <p className="text-gray-600">
                        Nom du compte :{" "}
                        <span className="font-bold">
                          {account?.description}
                        </span>{" "}
                      </p>
                      <p className="text-gray-600">
                        Nombre d'appareil :{" "}
                        <span className="font-bold">
                          {account?.accountDevices?.length}
                        </span>{" "}
                      </p>
                      <p className="text-gray-600">
                        Nombre d'utilisateur :{" "}
                        <span className="font-bold">
                          {account?.accountUsers?.length}
                        </span>{" "}
                      </p>

                      <p className="text-gray-600">
                        Nombre de Groupe :{" "}
                        <span className="font-bold">
                          {account?.accountGroupes?.length}
                        </span>{" "}
                      </p>
                    </div>
                  </div>
                );
              })}
              {/*  */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChooseOtherAccountDashboard;
