import React, { useContext } from "react";
import { TbPointFilled } from "react-icons/tb";
import { DataContext } from "../../context/DataContext";

function SeConnecter() {
  const { seConnecterRef } = useContext(DataContext);
  return (
    <div ref={seConnecterRef} className="transition-all mt-[5rem]  w-full">
      <div className="px-4 transition-all mx-auto max-w-[35rem]">
        <h2 className="text-orange-600 font-semibold  mt-6 text-center">
          Manuelle d'utilisation
        </h2>
        <h1 className="font-bold mt-4  text-center text-xl">
          Comment se connecter ?
        </h1>

        <h1 className="font-bold text-gray-200 text-center text-[5rem]">
          Draft
        </h1>
        <div className="mt-8">
          <div className="border-b pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              1- Installer l'application si l'icon est visible (optionel) :
            </h3>
            <p className="text-white">.</p>

            <div className="flex h-[15rem]-- justify-center w-full-">
              <img
                className="w-full- object-cover-"
                src="/img/screenshot/installation.png"
                alt=""
              />
            </div>
          </div>
          {/*  */}
          <div className="mt-8 pb-10 border-b border-b-orange-300">
            <h3 className="text-lg font-semibold">
              2- Entrer les Informations nécessaire :
            </h3>
            <div className="ml-14">
              <div className="flex gap-4 items-center">
                <TbPointFilled />
                <p>Compte</p>
              </div>
              <div className="flex gap-4 items-center">
                <TbPointFilled />
                <p>Nom d'utilisateur</p>
              </div>
              <div className="flex gap-4 items-center">
                <TbPointFilled />
                <p>Mot de passe</p>
              </div>
            </div>
            <div className="flex mt-5 h-[15rem]-- justify-center w-full">
              <img
                className="w-full object-cover-- bg-red-400 ml-10"
                src="/img/screenshot/login.png"
                alt=""
              />
            </div>
          </div>
          {/*  */}
          <div className="border-b mt-10 pb-5 border-b-orange-300">
            <h3 className="text-lg font-semibold">
              4- CLiquer sur le bouton : "Se connecter"
            </h3>
            <h3 className="ml-6 font-">
              Activer se souvenir de moi (si souhaiter)
            </h3>
            <div className="flex mt-8 justify-center w-full">
              <img
                className="w-full object-contain"
                src="/img/screenshot/connect.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeConnecter;
