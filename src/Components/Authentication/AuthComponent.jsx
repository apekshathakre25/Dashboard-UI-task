import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, UserPlus, LogIn } from "lucide-react";
import Loader from "../Utiles/Loader";
import {notify} from "../Utiles/Notification"
import axios from "axios";
import { UserState } from "../Context/UserContext";

const AuthComponents = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const {setUser} = UserState()
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLoginSubmit = async(e) => {
    e.preventDefault();
    const newErrors = {};
  
    if (!validateEmail(loginForm.email)) {
      newErrors.loginEmail = "Please enter a valid email";
    }
    
    if (!loginForm.password.trim()) {
      newErrors.loginPassword = "Password is required";
    }
  
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const response = await axios.post(`${baseUrl}/api/login`, {
          email: loginForm.email,
          password: loginForm.password,
        });
        localStorage.setItem("userToken", JSON.stringify(response.data.token));
        setUser(response.data.token);
        notify("success", "Login successful")
      } catch (error) {
        notify("error", error.response?.data?.message || "Login failed");
        console.log(error)
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSignupSubmit = async(e) => {
    e.preventDefault();
    const newErrors = {};
  
    if (!signupForm.name?.trim()) {
      newErrors.name = "Name is required";
    }
  
    if (!validateEmail(signupForm.email)) {
      newErrors.email = "Please enter a valid email";
    }
  
    if (!signupForm.password) {
      newErrors.password = "Password is required";
    } 
  
    if (!signupForm.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (signupForm.password !== signupForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
  
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const response = await axios.post(`${baseUrl}/api/register`, {
          name: signupForm.name,
          email: signupForm.email,
          password: signupForm.password,
        });
        localStorage.setItem("userToken", JSON.stringify(response.data.token));
        setUser(response.data.token);
        notify("success", "Signup successful");
      } catch (error) {
        notify("error", error.response?.data?.message || "Signup failed");
        console.log(error)
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="relative flex items-center justify-center min-h-screen bg-white overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-yellow-400 via-orange-300 to-pink-500 rounded-full opacity-70 blur-3xl -translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-600 via-violet-400 to-indigo-400 rounded-full opacity-70 blur-3xl translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cyan-400 via-blue-300 to-purple-500 rounded-full opacity-70 blur-3xl -translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-teal-400 via-green-300 to-cyan-500 rounded-full opacity-70 blur-3xl translate-x-1/4 translate-y-1/4"></div>
        
        <div className="w-full border  border-pink-300 max-w-md p-8 space-y-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl z-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="mt-2 text-gray-500">
              {isLogin
                ? "Sign in to access your account"
                : "Sign up to get started with our service"}
            </p>
          </div>

          <div className="flex p-1 space-x-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setIsLogin(true)}
              className={`w-1/2 py-2 text-sm font-medium rounded-md transition-all duration-300 flex items-center justify-center space-x-1 ${
                isLogin
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 cursor-pointer"
              }`}
            >
              <LogIn size={16} />
              <span>Login</span>
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`w-1/2 py-2 text-sm font-medium rounded-md transition-all duration-300 flex items-center justify-center space-x-1 ${
                !isLogin
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <UserPlus size={16} />
              <span>Sign Up</span>
            </button>
          </div>

          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, email: e.target.value })
                      }
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Email address"
                    />
                  </div>
                  {errors.loginEmail && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.loginEmail}
                    </p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, password: e.target.value })
                      }
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.loginPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.loginPassword}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-3 cursor-pointer text-white font-medium rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Sign in
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      value={signupForm.email}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, email: e.target.value })
                      }
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Email address"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={signupForm.password}
                      onChange={(e) =>
                        setSignupForm({
                          ...signupForm,
                          password: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute cursor-pointer inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={signupForm.confirmPassword}
                      onChange={(e) =>
                        setSignupForm({
                          ...signupForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
                />
                <label
                  htmlFor="terms"
                  className="block ml-2 text-sm text-gray-700"
                >
                  I agree to the{" "}
                  <a href="#" className="text-purple-600 hover:text-purple-500">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-purple-600 hover:text-purple-500">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button
                type="submit"
                className="w-full cursor-pointer px-4 py-3 text-white font-medium rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Create Account
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium text-purple-600 hover:text-purple-500 cursor-pointer"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthComponents;