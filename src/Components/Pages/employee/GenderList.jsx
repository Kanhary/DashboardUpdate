import React, { useState } from "react";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";

const GenderList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({ code: "", position: "" });
  const [editingGender, setEditingGender] = useState(null);

  const genderList = [
    { code: "F", gender: "ស្រី" },
    { code: "M", gender: "ប្រុស" },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;
  const filteredGender = genderList.filter(
    (gender) =>
      gender.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gender.code.includes(searchTerm)
  );
  const totalPages = Math.ceil(filteredGender.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentGenders = filteredGender.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const getPaginationItems = () => {
    let pages = [];
    if (totalPages <= 7) {
      pages = [...Array(totalPages)].map((_, index) => index + 1);
    } else {
      if (currentPage < 4) {
        pages = [1, 2, 3, 4, "...", totalPages];
      } else if (currentPage > totalPages - 3) {
        pages = [
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        ];
      } else {
        pages = [
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        ];
      }
    }
    return pages;
  };

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openEditModal = (code, gender) => {
    setEditingGender({ code, gender });
    setFormData({ code, gender });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingGender(null);
    setFormData({ code: "", gender: "" });
    setIsEditModalOpen(false);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveNew = () => {
    console.log("Save & New clicked", formData);
    setFormData({ code: "", gender: "" });
  };

  const handleSave = () => {
    console.log("Save clicked", formData);
    closeAddModal();
  };

  const handleUpdate = () => {
    console.log("Update clicked", formData);
    closeEditModal();
  };

  const deleteGender = (code) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      // Your delete logic here...
    }
  };
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <section className="mt-10 font-khmer">
      {/* <h1 className="text-md font-medium text-blue-800">
        តារាងបញ្ជីភេទបុគ្គលិក
      </h1>
      <div className="mt-3 border"></div> */}
      <div className="w-full mt-4" data-aos="fade-up">
        <div className="relative w-full overflow-hidden bg-white shadow-md sm:rounded-lg">
          <div className="flex flex-col items-center justify-between p-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4">
            <div className="w-full md:w-1/2">
              <form className="flex items-center">
                <label htmlFor="simple-search" className="sr-only">
                  Search
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4  4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="simple-search"
                    className="block w-full p-2 pl-10 text-[12px] text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 "
                    placeholder="ស្វែងរក"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    required=""
                  />
                </div>
              </form>
            </div>
            <div className="flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3">
              <button
                onClick={handleRefresh}
                className="flex items-center justify-center px-5 py-2 text-[12px] font-medium text-white transition-transform transform rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 hover:scale-105 active:scale-95"
              >
                <IoMdRefresh />
                Refresh
              </button>
              <button
                type="button"
                className="flex items-center justify-center px-5 py-2 text-[12px] font-medium text-white transition-transform transform rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 hover:scale-105 active:scale-95"
                onClick={openAddModal}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  />
                </svg>
                បន្ថែម
              </button>
            </div>
          </div>

          <div className="w-full overflow-x-auto" data-aos="fade-right">
            <table className="w-full text-[12px] text-left text-gray-500 ">
              <thead className="text-[12px] text-gray-700 uppercase bg-gray-100 ">
                <tr>
                  <th
                    scope="col"
                    className="sticky left-0 px-4 py-2 bg-gray-100 border-t border-r"
                  >
                    Action
                  </th>
                  <th scope="col" className="px-4 py-2 border-t border-r">
                    Code
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 border-t border-r"
                    style={{ minWidth: "150px" }}
                  >
                    Gender
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 border-t border-r"
                    style={{ minWidth: "150px" }}
                  >
                    Last By
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 border-t border-r"
                    style={{ minWidth: "150px" }}
                  >
                    Last Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentGenders.map((gender, index) => (
                  <tr
                    key={index}
                    className="transition-colors duration-200 border border-b-gray-200 hover:bg-indigo-50"
                  >
                    <td className="sticky left-0 flex px-6 py-2 bg-white border-r ">
                      <input type="checkbox" className="mr-1 action-checkbox" />
                      <FaPen
                        className="ml-2 text-blue-500 cursor-pointer hover:text-blue-700"
                        onClick={() =>
                          openEditModal(gender.code, gender.gender)
                        }
                      />
                      <FaTrashAlt
                        className="ml-3 text-red-500 cursor-pointer hover:text-red-700"
                        onClick={() => deleteGender(gender.code)}
                      />
                    </td>
                    <td className="px-4 py-2 border-r">{gender.code}</td>
                    <td
                      className="px-4 py-2 border-r"
                      style={{ minWidth: "250px" }}
                    >
                      {gender.gender}
                    </td>
                    <td
                      className="px-4 py-2 border-r"
                      style={{ minWidth: "150px" }}
                    >
                      Last Edited By
                    </td>
                    <td
                      className="px-4 py-2 border-r"
                      style={{ minWidth: "160px" }}
                    >
                      Last Edited Date
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-center justify-between px-4 md:flex-row">
            <span className="mb-4 text-[12px] text-gray-600 md:mb-0">
              Page {currentPage} of {totalPages}
            </span>

            <nav className="flex items-center p-4 space-x-2 md:space-x-3">
              <ul className="inline-flex items-center p-2 space-x-2 overflow-x-auto">
                {/* Previous Page Button */}
                <li>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center justify-center py-2 px-3 text-gray-500 bg-gradient-to-r from-gray-200 to-gray-300 border rounded-lg shadow-md hover:bg-gradient-to-r hover:from-gray-300 hover:to-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 ${
                      currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.293 14.707a1 1 0 01-1.414 0L6.586 10.414a1 1 0 010-1.414l4.293-4.293a1 1 0 011.414 1.414L8.414 10l3.879 3.879a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </li>

                {/* Page Number Buttons */}
                {getPaginationItems().map((page, index) =>
                  page === "..." ? (
                    <li key={index}>
                      <span className="flex items-center justify-center px-3 py-2 text-gray-500 border rounded-lg shadow-md bg-gradient-to-r from-gray-200 to-gray-300">
                        ...
                      </span>
                    </li>
                  ) : (
                    <li key={index}>
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`flex items-center text-[12px] justify-center py-2 px-3 border rounded-lg shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 ${
                          currentPage === page
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 shadow-lg"
                            : "text-gray-500 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400"
                        }`}
                      >
                        {page}
                      </button>
                    </li>
                  )
                )}

                {/* Next Page Button */}
                <li>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center justify-center py-2 px-3 text-gray-500 bg-gradient-to-r from-gray-200 to-gray-300 border rounded-lg shadow-md hover:bg-gradient-to-r hover:from-gray-300 hover:to-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 ${
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.707 14.707a1 1 0 010-1.414L11.586 10 7.707 6.121a1 1 0 111.414-1.414l4.293 4.293a1 1 010 1.414l-4.293 4.293a1 1 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      {/* Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div
            className="relative w-1/2 mx-auto transition-all transform bg-white shadow-2xl rounded-xl"
            data-aos="zoom-in"
          >
            <header className="flex items-center justify-between px-6 py-4 shadow-lg bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 rounded-t-xl">
              <h2 className="text-xl font-bold text-white md:text-2xl">
                បន្ថែមមុខតំណែងថ្មី
              </h2>
              <button
                onClick={closeAddModal}
                className="text-2xl text-white transition duration-200 hover:text-gray-300 md:text-3xl"
              >
                &times;
              </button>
            </header>
            <div className="px-6 py-6 space-y-6">
              <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                {/* Input for Code */}
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="code"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Code
                  </label>
                  <input
                    type="text"
                    id="code"
                    value={formData.code}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                  />
                </div>
                {/* Input for Position */}
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="position"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Gender
                  </label>
                  <input
                    type="text"
                    id="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                  />
                </div>
              </div>
            </div>
            <footer className="flex flex-col-reverse items-center justify-end px-6 py-4 space-y-3 space-y-reverse bg-gray-100 rounded-b-xl md:flex-row md:space-x-3 md:space-y-0">
              <button
                onClick={handleSave}
                className="w-full px-5 py-2 text-sm font-medium text-white transition duration-200 transform rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-blue-700 hover:shadow-lg hover:scale-105 md:w-auto"
              >
                Save
              </button>
              <button
                onClick={handleSaveNew}
                className="w-full px-5 py-2 text-sm font-medium text-white transition duration-200 transform rounded-lg shadow-md bg-gradient-to-r from-green-500 to-green-700 hover:shadow-lg hover:scale-105 md:w-auto"
              >
                Save & New
              </button>
              <button
                onClick={closeAddModal}
                className="w-full px-5 py-2 text-sm font-medium text-gray-700 transition duration-200 transform bg-gray-200 rounded-lg shadow-md hover:shadow-lg hover:scale-105 md:w-auto"
              >
                Cancel
              </button>
            </footer>
          </div>
        </div>
      )}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="relative w-1/2 mx-auto transition-all transform bg-white shadow-2xl rounded-xl">
            <header className="flex items-center justify-between px-6 py-4 shadow-lg bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 rounded-t-xl">
              <h2 className="text-xl font-bold text-white md:text-2xl">
                កែមុខតំណែងថ្មី
              </h2>
              <button
                onClick={closeEditModal}
                className="text-2xl text-white transition duration-200 hover:text-gray-300 md:text-3xl"
              >
                &times;
              </button>
            </header>
            <div className="px-6 py-6 space-y-6">
              <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                {/* Input for Code */}
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="code"
                    className="block mb-2 text-sm font-semibold text-gray-700 "
                  >
                    Code
                  </label>
                  <input
                    type="text"
                    id="code"
                    value={formData.code}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    disabled
                  />
                </div>
                {/* Input for Position */}
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="position"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Gender
                  </label>
                  <input
                    type="text"
                    id="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                  />
                </div>
              </div>
            </div>
            <footer className="flex flex-col-reverse items-center justify-end px-6 py-4 space-y-3 space-y-reverse bg-gray-100 rounded-b-xl md:flex-row md:space-x-3 md:space-y-0">
              <button
                onClick={handleSave}
                className="w-full px-5 py-2 text-sm font-medium text-white transition duration-200 transform rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-blue-700 hover:shadow-lg hover:scale-105 md:w-auto"
              >
                Save
              </button>
              <button
                onClick={closeEditModal}
                className="w-full px-5 py-2 text-sm font-medium text-gray-700 transition duration-200 transform bg-gray-200 rounded-lg shadow-md hover:shadow-lg hover:scale-105 md:w-auto"
              >
                Cancel
              </button>
            </footer>
          </div>
        </div>
      )}{" "}
    </section>
  );
};

export default GenderList;
