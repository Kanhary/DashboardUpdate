import React, { useState } from "react";
import Product from "./Product";
import Category from "./Category";
import SubCategory from "./SubCategory";

const Computer = () => {
  const [activeTab, setActiveTab] = useState("Product");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="py-6 mt-7 rounded-lg ">
      {/* Page Header */}
      <h1 className="text-[15px] font-medium text-blue-800">តារាងទិន្នន័យកុំព្យូទ័រ</h1>
      <div className="mt-3 border"></div>
      {/* Tab Menu */}
      <div className="flex gap-4 border-b ">
        {["Product", "Category", "Subcategory"].map((tab) => (
          <button
            key={tab}
            className={`px-5 py-2 text-[12px] font-medium transition-all duration-200 border-b-2 ${
              activeTab === tab
                ? "text-blue-600 border-blue-600"
                : "text-gray-500 border-transparent hover:text-blue-500 hover:border-gray-300"
            }`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-2">
        {activeTab === "Product" && <Product />}
        {activeTab === "Category" && <Category />}
        {activeTab === "Subcategory" && <SubCategory />}
      </div>
    </div>
  );
};

export default Computer;
