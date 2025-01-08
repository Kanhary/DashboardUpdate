import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { GetAllStaff , ExportUserExcel} from "../../api/user";
import Swal from 'sweetalert2';
import { AiOutlineFileExcel } from "react-icons/ai";

const Report = () => {
  const [loading, setLoading] = useState(false);

  // Function to fetch data and save it to Excel
  const generateExcelReport = async () => {
    setLoading(true);
  
    try {
      const response = await axios.get("http://192.168.168.4:8888/user/export-users", {
        responseType: "blob", // Important to handle binary data
      });
  
      console.log("API Response:", response);
  
      // Create a blob from the response data
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
  
      // Extract file name from headers (optional)
      const contentDisposition = response.headers["content-disposition"];
      const fileName = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : "User_Report.xlsx";
  
      // Create a link element to trigger download
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
  
      // Append to DOM and trigger download
      document.body.appendChild(link);
      link.click();
  
      // Clean up
      document.body.removeChild(link);
  
      // Show success message
      Swal.fire({
        title: "Download",
        text: "Report generated and downloaded successfully!",
        icon: "success",
        confirmButtonText: "Okay",
      });
    } catch (error) {
      console.error("Error generating report:", error);
  
      Swal.fire({
        title: "Error!",
        text: "Failed to generate the report. Please try again.",
        icon: "error",
        confirmButtonText: "Okay",
      });
    } finally {
      setLoading(false);
    }
  };
  
  
  

  return (
    <section className="p-4 mt-10">
      <h1 className='text-xl font-medium text-blue-800'>របាយការណ៍</h1>
      <div className='mt-3 border'></div>

      {/* <div className='w-full overflow-x-auto'>
        <table className='w-full text-sm text-left text-gray-500'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-100'>
                <tr>
                    <th scope="col">No</th>
                    <th scope="col">reports</th>
                    <th scope="col">File Excel</th>
                </tr>
            </thead>
            <tbody>
                <tr className='transition-colors duration-200 border border-b-gray-200 hover:bg-indigo-50'>
                        <td>1</td>
                        <td>staff Resports</td>
                        <td>
                        <button
                            onClick={generateExcelReport}
                            disabled={loading}
                            className={`px-4 py-2 text-white rounded ${
                            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                            }`}
                        >
                            {loading ? "Generating..." : "Download Excel Report"}
                        </button>
                        </td>

                </tr>
            </tbody>
        </table>
      </div> */}

      {/* Generate Report Button */}
      <button
        onClick={generateExcelReport}
        disabled={loading}
        className={`mt-4 flex items-center px-4 py-2 text-white text-sm font-medium rounded-lg shadow-md ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
      >
        <AiOutlineFileExcel className="mr-2" size={20} />
        {loading ? "Generating..." : "Download Excel Report"}
      </button>
    </section>
  );
};

export default Report;
