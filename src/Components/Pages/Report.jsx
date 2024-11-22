import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { GetAllStaff } from "../../api/user";
import Swal from 'sweetalert2';

const Report = () => {
  const [loading, setLoading] = useState(false);

  // Function to fetch data and save it to Excel
  const generateExcelReport = async () => {
    setLoading(true);
  
    try {
      const response = await GetAllStaff();
  
      // Log the full response for debugging
      console.log("Full Response:", response);
      console.log("Response Data:", response.data);
  
      // Extract the data array
      let computerData = response.data.data;
  
      if (!Array.isArray(computerData)) {
        console.error("Unexpected data format:", computerData);
        alert("Unexpected data format. Unable to generate report.");
        setLoading(false);
        return;
      }
  
      // Generate the Excel report
      const worksheet = XLSX.utils.json_to_sheet(computerData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Computer Report");
  
      // Save the Excel file
      XLSX.writeFile(workbook, "Computer_Report.xlsx");
    //   alert("Report generated and downloaded successfully!");
      Swal.fire({
        title: "Download",
        text: "Report generated and downloaded successfully!",
        icon: "success",
        confirmButtonText: "Okay",
    });
    } catch (error) {
      console.error("Error generating report:", error);
    //   alert("Failed to generate the report. Please try again.");
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
      <h1 className="mb-4 text-xl font-bold">Generate Computer Report</h1>

      <div className='w-full overflow-x-auto'>
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
      </div>

      {/* Generate Report Button */}
      {/* <button
        onClick={generateExcelReport}
        disabled={loading}
        className={`px-4 py-2 text-white rounded ${
          loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "Generating..." : "Download Excel Report"}
      </button> */}
    </section>
  );
};

export default Report;
