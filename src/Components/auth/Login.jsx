import React, { useEffect, useState } from "react";
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "remixicon/fonts/remixicon.css";
import { Login } from "../../api/user";
import { FiXCircle } from 'react-icons/fi';

import { setToken, getToken, removeToken } from "../../utils/token/Token";
const LoginForm = () => {
    useEffect(() => {
        AOS.init();
    }, []);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); 


  //   const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (username === 'Pheakdey' && password === '123') {
  //     navigate('/main-dashboard'); 
  //   } else {
  //     setError('Invalid username or password');
  //   }
  // };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await Login({ username, password });

            if (response.status === 200) {
                const { token } = response.data; 
                setToken("token", token); 
                navigate('/main-dashboard'); 
                console.log('Login successful');
            } else {
                setError('Invalid username or password');
            }
        } catch (err) {
            setError('Invalid username or password');
        } finally {
            setLoading(false); 
        }
    };
    
    const togglePassword = () => {
        const passwordField = document.getElementById("password");
        const eyeOffIcon = document.querySelector(".ri-eye-off-line");
        const eyeOnIcon = document.querySelector(".ri-eye-line");

        if (passwordField.type === "password") {
            passwordField.type = "text";
            eyeOffIcon.classList.add("hidden");
            eyeOnIcon.classList.remove("hidden");
        } else {
            passwordField.type = "password";
            eyeOffIcon.classList.remove("hidden");
            eyeOnIcon.classList.add("hidden");
        }
    };

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 font-khmer">
        <div
          className="flex items-center justify-center min-h-screen p-4 bg-gray-100 sm:p-10"
          data-aos="zoom-in"
          data-aos-duration="2000"
        >
          <div className="flex flex-col w-full max-w-4xl bg-white shadow-2xl rounded-2xl md:flex-row">
            <div className="w-full p-6 md:w-1/2 md:p-10">
              <img
                src="/LOGO PPAP.png"
                alt="Logo"
                className="w-24 h-24 mx-auto mb-4"
              />
              <h2 className="text-[20px] md:text-[23px] font-normal mb-6 text-center">
                ប្រព័ន្ធគ្រប់គ្រងទិន្នន័យកុំព្យូទ័រ
              </h2>
             
              {error && (
                <p 
                  data-aos="zoom-in" 
                  className="flex items-center p-2 mb-4 text-red-500 bg-red-100 border border-red-300 rounded">
                  <FiXCircle className="mr-2 text-red-600" />
                  <span className="font-semibold"></span> {error}
                </p>
              )}

              <form action="#" 
              // method="POST" 
              // onSubmit={handleSubmit}
              >
                <div className="relative mb-6">
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    name="email"
                    required
                    className="peer w-full px-3 py-4 text-[16px] md:text-[15px] text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder=" "
                  />
                  <label
                    htmlFor="username"
                    className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8 left-3 mt-2 peer-focus:text-blue-500"
                  >
                    ឈ្មោះគណនីរបស់អ្នក
                  </label>
                </div>
                <div className="relative mb-6">
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    name="password"
                    required
                    className="peer w-full px-3 py-4 pr-10 text-[16px] md:text-[15px] text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder=" "
                  />
                  <label
                    htmlFor="password"
                    className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8 left-3 mt-2 peer-focus:text-blue-500"
                  >
                    បញ្ចូលពាក្យសម្ងាត់
                  </label>
                  <button
                    type="button"
                    id="togglePassword"
                    className="absolute inset-y-0 right-0 flex items-center px-3 mr-3 text-gray-500"
                    onClick={togglePassword}
                  >
                    <i className="ri-eye-off-line"></i>
                    <i className="hidden ri-eye-line"></i>
                  </button>
                </div>
                <div className="flex justify-center mb-4 text-[14px] md:text-[15px] gap-2">
                  <p>មិនទាន់មានគណនី?</p>
                  <a href="#" className="text-blue-800 hover:underline">
                    ទាក់ទងការិយាល័យព័ត៌មានវិទ្យា
                  </a>
                </div>
                <div className="flex items-center justify-center">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="relative inline-flex items-center justify-center px-6 py-2 overflow-hidden text-base text-white transition-all duration-300 ease-in-out bg-blue-500 border rounded-md font-meduim group/button backdrop-blur-lg hover:scale-110 hover:shadow-xl hover:shadow-blue-600/50 border-white/20 "
                  >
                    <span className="text-lg">បញ្ចូលគណនី</span>
                    <div
                      className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]"
                    >
                      <div className="relative w-10 h-full bg-white/30"></div>
                    </div>
                  </button>
                </div>
              </form>
            </div>
      
            <div className="relative flex flex-col items-center justify-center w-full rounded-b-lg md:w-1/2 bg-gradient-to-br md:rounded-r-lg md:rounded-bl-none">
            {/* Background Video */}
            <video
              className="absolute inset-0 object-cover w-full h-full"
              autoPlay
              muted
              loop
            >
              <source src="bg.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
      
            {/* Background Image */}
            <img
              src="/login_bg.jpg"
              alt=""
              className="object-cover w-full h-full rounded-r-2xl"
            />
      
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-white/20 opacity-80 rounded-r-2xl"></div>
      
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center px-6 text-white">
              <h1 className="text-3xl font-semibold">សូមស្វាគមន៍មកកាន់ប្រព័ន្ធកុំព្យូទ័រ</h1><br />
              <p className="text-sm font-light text-center">យើងមានសេចក្ដីរីករាយដែលបានឃើញអ្នកនៅទីនេះ។ ប្រព័ន្ធរបស់យើងត្រូវបានរចនាឡើងដើម្បីធ្វើឱ្យបទពិសោធន៍របស់អ្នកមានភាពរលូន និងមានប្រសិទ្ធភាព។ មិនថាអ្នកមកដើម្បីគ្រប់គ្រងភារកិច្ចរបស់អ្នក, រុករកមុខងារថ្មីៗ, ឬត្រឹមតែស្វែងរកវិធីប្រកបដោយប្រសិទ្ធិភាព, យើងរួសរាយដើម្បីជួយស្រួលដល់អ្នក។ បើអ្នកត្រូវការជំនួយ អាចទាក់ទងមកយើងបាន។ សូមរីករាយក្នុងការប្រើប្រាស់ប្រព័ន្ធរបស់យើង!</p>
              <div className="flex items-center justify-center gap-4 py-6 mt-4 border-t border-white/50">
                <a href="https://ppap.com.kh/" target="_blank" rel="noopener noreferrer">
                  <button className="py-3 px-3 border border-white flex gap-3 text-[13px] text-white rounded-lg font-light hover:text-green-300 duration-300 bg-white/20">
                    <img src="/chrome.png" alt="" className="w-4 h-4" />
                    គេហទំព័រ Website
                  </button>
                </a>
                <a href="https://www.facebook.com/ppap.mpwt.7?mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer">
                  <button className="py-3 px-3 border border-white flex gap-3 text-[13px] text-white rounded-lg font-light hover:text-blue-700 duration-300 bg-white/20">
                    <img src="/Facebook_Logo.png" alt="Facebook" className="w-4 h-4" />
                    គេហទំព័រ Facebook
                  </button>
                </a>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
      
        );
      };
      
      export default LoginForm;
      