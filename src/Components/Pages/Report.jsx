import React, { useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AiOutlineFileExcel } from "react-icons/ai";

const Report = () => {
  const [loading, setLoading] = useState({ users: false, staff: false, import: false, computer: false });
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null); // Create a ref for the file input

  const downloadExcel = async (url, fileName, type) => {
    setLoading((prev) => ({ ...prev, [type]: true }));

    try {
      const response = await axios.get(url, { responseType: "blob" });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      Swal.fire({
        title: "Download",
        text: `${fileName} generated and downloaded successfully!`,
        icon: "success",
        confirmButtonText: "Okay",
      });
    } catch (error) {
      console.error(`Error generating ${fileName}:`, error);
      Swal.fire({
        title: "Error!",
        text: `Failed to generate ${fileName}. Please try again.`,
        icon: "error",
        confirmButtonText: "Okay",
      });
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadFile = async (url, fileType) => {
    if (!selectedFile) {
      Swal.fire({
        title: "Error!",
        text: "Please select a file before uploading.",
        icon: "error",
        confirmButtonText: "Okay",
      });
      return;
    }

    setLoading((prev) => ({ ...prev, import: true }));

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        title: "Success!",
        text: `${fileType} imported successfully!`,
        icon: "success",
        confirmButtonText: "Okay",
      });

      setSelectedFile(null);
      // Reset the file input using the ref
      fileInputRef.current.value = "";
    } catch (error) {
      console.error(`Error importing ${fileType}:`, error);
      Swal.fire({
        title: "Error!",
        text: `Failed to import ${fileType}. Please try again.`,
        icon: "error",
        confirmButtonText: "Okay",
      });
    } finally {
      setLoading((prev) => ({ ...prev, import: false }));
    }
  };

  return (
    <section className="p-4 mt-10">
      <h1 className="text-xl font-medium text-blue-800">របាយការណ៍</h1>
      <div className="mt-3 border"></div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border border-collapse border-gray-300 table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-sm font-medium text-left text-gray-700 border border-gray-300">Category</th>
              <th className="px-6 py-3 text-sm font-medium text-left text-gray-700 border border-gray-300">Export File</th>
              <th className="px-6 py-3 text-sm font-medium text-left text-gray-700 border border-gray-300">Import File</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-700 border border-gray-300">User</td>
              <td className="px-6 py-4 text-sm border border-gray-300">
                <button
                  onClick={() => downloadExcel("http://192.168.168.4:8759/user/export-users", "User_Report.xlsx", "users")}
                  disabled={loading.users}
                  className={`flex items-center px-4 py-2 text-white text-sm font-medium rounded-lg shadow-md ${loading.users ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                >
                  <AiOutlineFileExcel className="mr-2" size={20} />
                  {loading.users ? "Generating..." : "Export"}
                </button>
              </td>
              <td className="px-6 py-4 text-sm border border-gray-300">
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    ref={fileInputRef} // Attach the ref to the file input
                    onChange={handleFileChange}
                    accept=".xlsx, .xls"
                    className="block w-full text-sm border border-gray-300 rounded-lg shadow-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:ring-1 disabled:opacity-50 disabled:pointer-events-none text-neutral-400 file:border-0 file:me-4 file:py-3 file:px-4 file:bg-blue-600 file:text-white"
                  />
                  <button
                    onClick={() => uploadFile("http://192.168.168.4:8759/staffImport/import-staff", "User")}
                    disabled={loading.import}
                    className={`flex items-center px-4 py-2 text-white text-sm font-medium rounded-lg shadow-md ${loading.import ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                  >
                    <AiOutlineFileExcel className="mr-2" size={20} />
                    {loading.import ? "Uploading..." : "Import"}
                  </button>
                </div>
              </td>
            </tr>

            <tr className="bg-white hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-700 border border-gray-300">Staff</td>
              <td className="px-6 py-4 text-sm border border-gray-300">
                <button
                  onClick={() => downloadExcel("http://192.168.168.4:8759/staff/export-staffs", "Staff_Report.xlsx", "staff")}
                  disabled={loading.staff}
                  className={`flex items-center px-4 py-2 text-white text-sm font-medium rounded-lg shadow-md ${loading.staff ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                >
                  <AiOutlineFileExcel className="mr-2" size={20} />
                  {loading.staff ? "Generating..." : "Export"}
                </button>
              </td>
              <td className="px-6 py-4 text-sm border border-gray-300">
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    ref={fileInputRef} // Attach the ref to the file input
                    onChange={handleFileChange}
                    accept=".xlsx, .xls"
                    className="block w-full text-sm border border-gray-300 rounded-lg shadow-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:ring-1 disabled:opacity-50 disabled:pointer-events-none text-neutral-400 file:border-0 file:me-4 file:py-3 file:px-4 file:bg-blue-600 file:text-white"
                  />
                  <button
                    onClick={() => uploadFile("http://192.168.168.4:8759/staffImport/import-staff", "Staff")}
                    disabled={loading.import}
                    className={`flex items-center px-4 py-2 text-white text-sm font-medium rounded-lg shadow-md ${loading.import ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                  >
                    <AiOutlineFileExcel className="mr-2" size={20} />
                    {loading.import ? "Uploading..." : "Import"}
                  </button>
                </div>
              </td>
            </tr>
            <tr className="bg-white hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-700 border border-gray-300">Computer</td>
              <td className="px-6 py-4 text-sm border border-gray-300">
                <button
                  onClick={() => downloadExcel("http://192.168.168.4:8759/product/exportProduct", "Computer.xlsx", "staff")}
                  disabled={loading.computer}
                  className={`flex items-center px-4 py-2 text-white text-sm font-medium rounded-lg shadow-md ${loading.computer ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                >
                  <AiOutlineFileExcel className="mr-2" size={20} />
                  {loading.computer ? "Generating..." : "Export"}
                </button>
              </td>
              <td className="px-6 py-4 text-sm border border-gray-300">
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    ref={fileInputRef} // Attach the ref to the file input
                    onChange={handleFileChange}
                    accept=".xlsx, .xls"
                    className="block w-full text-sm border border-gray-300 rounded-lg shadow-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:ring-1 disabled:opacity-50 disabled:pointer-events-none text-neutral-400 file:border-0 file:me-4 file:py-3 file:px-4 file:bg-blue-600 file:text-white"
                  />
                  <button
                    onClick={() => uploadFile("http://192.168.168.4:8759/product/importProduct", "product")}
                    disabled={loading.import}
                    className={`flex items-center px-4 py-2 text-white text-sm font-medium rounded-lg shadow-md ${loading.import ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                  >
                    <AiOutlineFileExcel className="mr-2" size={20} />
                    {loading.import ? "Uploading..." : "Import"}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Report;
