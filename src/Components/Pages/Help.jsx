import React from 'react';
import { Link } from 'react-router-dom';

const Help = () => {
  const handleSubmit = (e) => {
    e.preventDefault();

    // Get the input values
    const name = e.target.elements.name.value;
    const email = e.target.elements.email.value;
    const message = e.target.elements.message.value;

    // Create the email body
    const emailBody = `
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `;

    // Create a mailto link with the email address and body
    const mailtoLink = `mailto:ukkanhary04@gmail.com?subject=Contact Form Submission&body=${encodeURIComponent(emailBody)}`;

    // Open the mail client with the pre-filled email
    window.location.href = mailtoLink;

    // Clear the form inputs
    e.target.reset();
  };

  return (
    <div className="min-h-screen mt-10 font-khmer">
      <h1 className='text-xl font-medium text-blue-800 font-khmer'>ជំនួយ</h1>
      <div className='mt-3 mb-3 border'></div>
      <div className="p-8 mx-auto bg-white shadow-xl rounded-2xl">
        <p className="mb-10 text-lg text-gray-700">
          Welcome to the Help Center. Here you can find answers to frequently asked questions and troubleshoot common issues.
        </p>

        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-semibold text-gray-800">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <div className="p-3 transition-shadow duration-300 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg">
              <div className="flex items-center mb-3 text-indigo-600">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8h18M3 12h18m-6 4H3"></path>
                </svg>
                <h3 className="text-xl font-semibold">How do I reset my password?</h3>
              </div>
              <p className="text-gray-600">
                To reset your password, please contact directly to <a href="https://t.me/Kagnary_Uk/" className='font-medium text-blue-800'>ICT Team</a> and follow the instructions to reset your password.
              </p>
            </div>

            <div className="p-3 transition-shadow duration-300 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg">
              <div className="flex items-center mb-3 text-indigo-600">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8h18M3 12h18m-6 4H3"></path>
                </svg>
                <h3 className="text-xl font-semibold">Who should I contact for technical support?</h3>
              </div>
              <p className="text-gray-600">
                For technical support, please contact our support team at support@example.com. Include as much detail as possible about your issue to receive prompt assistance.
              </p>
            </div>
          </div>
        </section>
        
        <section>
          <div className='sm:px-6 lg:px-8'>
            <div className='grid grid-cols-1 lg:grid-cols-2'>
              <div className='mb-10 lgmb-10'>
                <div className='w-full h-full group'>
                  <div className='relative h-full'>
                    <img src="/login_bg.jpg" alt="" className='w-full h-full bg-indigo-700 rounded-2xl lg:rounded-l-2xl bg-blend-multiply' />
                    <h1 className='absolute text-4xl font-bold leading-10 text-white top-11 left-11'>Contact Us</h1>
                    <div className='absolute bottom-0 w-full p-5 lg:p-11'> 
                      <div className='block p-6 rounded-md backdrop-blur-sm bg-white/30'>
                        <a href="tel:0965117722" className='flex items-center mb-6'>
                          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.3092 18.3098C22.0157 18.198 21.8689 18.1421 21.7145 18.1287C21.56 18.1154 21.4058 18.1453 21.0975 18.205L17.8126 18.8416C17.4392 18.9139 17.2525 18.9501 17.0616 18.9206C16.8707 18.891 16.7141 18.8058 16.4008 18.6353C13.8644 17.2551 12.1853 15.6617 11.1192 13.3695C10.9964 13.1055 10.935 12.9735 10.9133 12.8017C10.8917 12.6298 10.9218 12.4684 10.982 12.1456L11.6196 8.72559C11.6759 8.42342 11.7041 8.27233 11.6908 8.12115C11.6775 7.96998 11.6234 7.82612 11.5153 7.5384L10.6314 5.18758C10.37 4.49217 10.2392 4.14447 9.95437 3.94723C9.6695 3.75 9.29804 3.75 8.5551 3.75H5.85778C4.58478 3.75 3.58264 4.8018 3.77336 6.06012C4.24735 9.20085 5.64674 14.8966 9.73544 18.9853C14.0295 23.2794 20.2151 25.1426 23.6187 25.884C24.9335 26.1696 26.0993 25.1448 26.0993 23.7985V21.2824C26.0993 20.5428 26.0993 20.173 25.9034 19.8888C25.7076 19.6046 25.362 19.4729 24.6708 19.2096L22.3092 18.3098Z" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <h5 className='ml-5 text-base font-normal leading-6 text-black'>0123456789</h5>
                        </a>
                        <a href="mailto:ukkanhary04@gmail.com" className='flex items-center mb-6'>
                          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.81501 8.75L10.1985 13.6191C12.8358 15.2015 14.1544 15.9927 15.6032 15.9582C17.0519 15.9237 18.3315 15.0707 20.8905 13.3647L27.185 8.75M12.5 25H17.5C22.214 25 24.5711 25 26.0355 23.5355C27.5 22.0711 27.5 19.714 27.5 15C27.5 10.286 27.5 7.92893 26.0355 6.46447C24.5711 5 22.214 5 17.5 5H12.5C7.78595 5 5.42893 5 3.96447 6.46447C2.5 7.92893 2.5 10.286 2.5 15C2.5 19.714 2.5 22.0711 3.96447 23.5355C5.42893 25 7.78595 25 12.5 25Z" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          <h5 className='ml-5 text-base font-normal leading-6 text-black'>Kagnary@gmail.com</h5>
                        </a>
                        <a href="https://maps.app.goo.gl/6zzT5yudsrCd4YqS9" className='flex items-center mb-6'>
                          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M25 12.9169C25 17.716 21.1939 21.5832 18.2779 24.9828C16.8385 26.6609 16.1188 27.5 15 27.5C13.8812 27.5 13.1615 26.6609 11.7221 24.9828C8.80612 21.5832 5 17.716 5 12.9169C5 10.1542 6.05357 7.5046 7.92893 5.55105C9.8043 3.59749 12.3478 2.5 15 2.5C17.6522 2.5 20.1957 3.59749 22.0711 5.55105C23.9464 7.5046 25 10.1542 25 12.9169Z" stroke="#4F46E5" strokeWidth="2"/>
                            <path d="M17.5 11.6148C17.5 13.0531 16.3807 14.219 15 14.219C13.6193 14.219 12.5 13.0531 12.5 11.6148C12.5 10.1765 13.6193 9.01058 15 9.01058C16.3807 9.01058 17.5 10.1765 17.5 11.6148Z" stroke="#4F46E5" strokeWidth="2"/>
                          </svg>
                          <h5 className='ml-5 text-base font-normal leading-6 text-black'>Phnom Penh</h5>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
              <form action="#" 
                className='p-5 bg-gray-50 lg:p-11 lg:rounded-r-2xl rounded-2xl​' 
                onSubmit={handleSubmit}>
                   <h2 className='text-4xl font-semibold leading-10 text-indigo-900 font-manrope mb-11'>Send Us A Messange If You Need Help</h2>
                  <div className="relative mb-6">
                    <input
                      type="text"
                      id="name"
                      // value={name}
                      //onChange={(e) => setUsername(e.target.value)}
                      name="name"
                      required
                      className="peer w-full px-3 py-4 text-[16px] md:text-[18px] text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder=" "
                    />
                    <label
                      htmlFor="name"
                      className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8 left-3 mt-2 peer-focus:text-blue-500"
                    >
                      ឈ្មោះរបស់អ្នក
                    </label>
                  </div>
                  <div className="relative mb-6">
                    <input
                      type="email"
                      id="email"
                      // value={password}
                      //onChange={(e) => setEmail(e.target.value)}
                      name="email"
                      required
                      className="peer w-full px-3 py-4 pr-10 text-[16px] md:text-[18px] text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder=" "
                    />
                    <label
                      htmlFor="email"
                      className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8 left-3 mt-2 peer-focus:text-blue-500"
                    >
                      អ៊ីម៉ែលរបស់អ្នក
                    </label>
                  </div>
                  <div className='relative mb-6'>
                  <textarea
                      id="message"
                      name="message"
                      rows="4"
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                      // placeholder="Enter your message here"
                      required
                      //onChange={(e) => setMessage(e.target.value)}

                    ></textarea>
                    <label
                      htmlFor="message"
                      className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8 left-3 mt-2 peer-focus:text-blue-500"
                    >
                      សារ
                    </label>
                  </div>
                  <div className="flex items-center justify-center">
                  <button className="w-full h-12 mt-2 text-base font-semibold leading-6 text-white transition-all duration-700 bg-indigo-900 rounded-full shadow-sm hover:bg-indigo-800">Send</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Help;
