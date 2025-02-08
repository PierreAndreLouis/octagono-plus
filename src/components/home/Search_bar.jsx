import React from "react";
import { IoSearch } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";

function Search_bar({}) {
  const {
    userData,
    search,
    setSearch,
    handleLogout,
    setShowSideBar,
    fetchVehicleData,
    setSearchQueryForHeader,
  } = useContext(DataContext);

  return (
    <div className="fixed top-0 left-0 right-0 bg-white">
      <div className="mt-4 px-4">
        <div className="border-2 flex gap-3 justify-center items-center rounded-lg overflow-hidden">
          <input
            className=" p-2 focus:outline-none w-full"
            type="text"
            placeholder="Rechercher"
          />
          <IoSearch className="text-3xl text-gray-500 cursor-pointer" />
          <IoMdClose
            onClick={() => {
              setSearch(false);
            }}
            className="text-3xl text-red-500 cursor-pointer mr-4 "
          />
        </div>
      </div>
    </div>
  );
}

export default Search_bar;
