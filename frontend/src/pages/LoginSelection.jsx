import React from "react";
import { useNavigate } from "react-router-dom";

const LoginSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-100 to-amber-100">

      <div className="bg-white shadow-xl rounded-2xl p-10 w-[420px] text-center">

        <h1 className="text-3xl font-bold mb-3 text-amber-700">
          CraftNest
        </h1>

        <p className="text-gray-600 mb-8">
          Please choose how you want to login.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl mb-4 font-semibold"
        >
          Customer Login
        </button>

        <button
          onClick={() => navigate("/admin/login")}
          className="w-full bg-gray-800 hover:bg-black text-white py-3 rounded-xl font-semibold"
        >
          Admin Login
        </button>

      </div>

    </div>
  );
};

export default LoginSelection;