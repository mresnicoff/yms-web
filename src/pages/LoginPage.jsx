import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import api from "../api/axios";

import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";

export default function LoginPage() {

  const navigate = useNavigate();

  const { loadUser } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const handleLogin = async () => {

    try {

      const response =
        await api.post(
          "/auth/login",
          {
            email,
            password
          }
        );

      localStorage.setItem(
        "token",
        response.data.token
      );

      await loadUser();

      navigate("/dashboard");

    } catch (error) {

      console.error(
        "LOGIN ERROR",
        error
      );

      setError(
        error.response?.data?.message ||
        error.message ||
        "Error"
      );

    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center">

      <Card>

        <h1 className="text-2xl font-bold mb-6">
          YMS
        </h1>

        <div className="space-y-4 w-80">

          <Input
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />

          {error && (
            <p className="text-red-600">
              {error}
            </p>
          )}

          <Button
            onClick={handleLogin}
          >
            Ingresar
          </Button>

        </div>

      </Card>

    </div>
  );

}