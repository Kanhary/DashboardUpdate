import React from 'react';

const companies = [
  {
    nameEn: 'Phnom Penh Autonomous Port',
    nameKh: 'កំពង់ផែស្វយ័តភ្នំពេញ',
    phone: '+855 123 456 789',
    email: 'info@pp.com', // Added email field
    photo: '/LOGO PPAP.png',
  },
  // You can add more companies here
];



const Company = () => {
  return (
    <section className='mt-10'>
        <h1 className='text-xl font-medium text-blue-800'>តារាងក្រុមហ៊ុន</h1>
        <div className='my-3 border '></div>
        <div className="flex items-center justify-center" data-aos='fade-up'>
            <div className="w-full bg-white border border-gray-200 rounded-lg shadow-md" data-aos='fade-right'>
                <table className="w-full bg-white border-collapse table-auto">
                    <thead>
                    <tr className="bg-gray-100 border-b">
                        <th className="px-6 py-4 text-sm font-semibold tracking-wide text-left text-gray-600 uppercase">
                        Company Name (English)
                        </th>
                        <th className="px-6 py-4 text-sm font-semibold tracking-wide text-left text-gray-600 uppercase">
                        Company Name (Khmer)
                        </th>
                        <th className="px-6 py-4 text-sm font-semibold tracking-wide text-left text-gray-600 uppercase">
                        Phone Number
                        </th>
                        <th className="px-6 py-4 text-sm font-semibold tracking-wide text-left text-gray-600 uppercase">
                        Email
                        </th> {/* New email column */}
                        <th className="px-6 py-4 text-sm font-semibold tracking-wide text-left text-gray-600 uppercase">
                        Logo
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {companies.map((company, index) => (
                        <tr
                        key={index}
                        className={`${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        } hover:bg-gray-100`}
                        >
                        <td className="px-6 py-4 text-sm text-gray-800">
                            {company.nameEn}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                            {company.nameKh}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                            {company.phone}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                            {company.email} {/* Displaying email */}
                        </td>
                        <td className="px-6 py-4">
                            <img
                            src={company.photo}
                            alt={`${company.nameEn} Logo`}
                            className="object-cover w-16 h-16 border border-gray-200 rounded-lg shadow-sm"
                            />
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    </section>
  );
};

export default Company;
