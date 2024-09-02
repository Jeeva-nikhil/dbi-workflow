import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import { useNavigate, useParams } from 'react-router-dom';
import 'tailwindcss/tailwind.css';

function Login() {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { bearerToken } = useParams();

  useEffect(() => {
    if (bearerToken) {
      setLoading(true);
      setTimeout(() => {
        sessionStorage.setItem("uid", bearerToken);
        const token = sessionStorage.getItem("uid");
        console.log('token', token);

        if (!bearerToken) {
          setLoading(false);
          navigate('/error_403');
        } else {
          setLoading(false);
          navigate('/zylerworkflowlist');
        }
      }, 2000);
    }
  }, [bearerToken, navigate]);

  return (
    loading ? (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Spin size="large" />
      </div>
    ) : null
  );
}

export default Login;
