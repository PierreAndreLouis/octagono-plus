import React from "react";
import { IoMdHome } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";
import { FaListUl } from "react-icons/fa";
import { Link } from "react-router-dom";




function Navigation_bar({setAddVehicule, setModifierVehicule}) {
  const handleClick = () => {
    window.scrollTo({
        top: 0,
        behavior: 'auto'
        // behavior: 'smooth'
    });
};
  return (
    <div className="md:hidden z-20 grid grid-cols-5 gap-4 justify-between px-4 bg-gray-200 py-0 fixed bottom-0 left-0 right-0 ">
      <Link
      to="/home"
      onClick={() => (handleClick())}
      className="flex flex-col cursor-pointer hover:text-orange-500 justify-center items-center text-gray-600">
        <IoMdHome className="text-xl" />
        <h3 className="text-sm">Home</h3>
      </Link>


      <Link
      to="/modifier_vehicule"   
      onClick={() => (handleClick())}   
      className="flex flex-col cursor-pointer hover:text-orange-500 justify-center items-center text-gray-600">
        <FaRegEdit className="text-xl" />
        <h3 className="text-sm">Modifier</h3>
      </Link>
      <div className="flex justify-center items-center">
        <Link 
        to="/ajouter_vehicule"
        onClick={() => (handleClick())}
        className="w-14 h-14 cursor-pointer -translate-y-3 border-4 border-gray-200 bg-orange-500 flex justify-center items-center rounded-full ">
          <FaPlus className="text-white text-xl"/>
        </Link>
      </div>
      <Link 
      to="/historique"
      onClick={() => (handleClick())}
      className="flex flex-col cursor-pointer hover:text-orange-500 justify-center items-center text-gray-600">
        <FaListUl className="text-xl" />
        <h3 className="text-sm">Historique</h3>
      </Link>
      <Link
      to="/paiement"
      onClick={() => (handleClick())}
      className="flex flex-col cursor-pointer hover:text-orange-500 justify-center items-center text-gray-600">
        <MdAttachMoney className="text-xl" />
        <h3 className="text-sm">Paiement</h3>
      </Link>
    </div>
  );
}

export default Navigation_bar;
