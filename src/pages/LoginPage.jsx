import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import { getHomeRouteForRole } from "../utils/roleHomeRoute";

import api from "../api/axios";

import Input from "../components/Input";
import Button from "../components/Button";

export default function LoginPage() {

  const navigate = useNavigate();

  const { loadUser } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const handleLogin = async (e) => {

    e?.preventDefault();

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

      const loggedInUser = await loadUser();

      navigate(getHomeRouteForRole(loggedInUser?.role));

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
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_1fr]">

      <section className="hidden lg:flex flex-col justify-between bg-ink text-white p-14 relative overflow-hidden">

        <div
          aria-hidden="true"
          className="absolute -right-24 -bottom-24 w-[28rem] h-[28rem] rounded-full border-[44px] border-signal/10"
        />

        <div className="font-display text-3xl font-extrabold tracking-wide uppercase">
          YMS<span className="text-signal">Pro</span>
        </div>

        <div className="relative max-w-md">
          <h2 className="font-display text-6xl font-extrabold leading-[0.95] uppercase">
            Sin Excel. Sin llamadas. Cada camión a su dock.
          </h2>
          <p className="mt-6 text-slate-300 text-lg">
            El proveedor reserva su turno, los viajes de salida llegan desde tu WMS y el chofer recibe el aviso del dock por WhatsApp, automáticamente.
          </p>
        </div>

        <div className="text-sm text-slate-400">
          Yard Management System
        </div>

      </section>

      <section className="flex items-center justify-center p-6">

        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-white border border-line rounded-2xl p-8 shadow-[0_10px_40px_-20px_rgba(15,27,39,.35)]"
        >

          <div className="lg:hidden font-display text-3xl font-extrabold uppercase mb-6">
            YMS<span className="text-signal-dark">Pro</span>
          </div>

          <h1 className="text-3xl uppercase mb-1">
            Ingresar
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            Accedé con tu usuario.
          </p>

          <div className="space-y-4">

            <Input
              type="email"
              placeholder="Email"
              autoComplete="username"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />

            <Input
              type="password"
              placeholder="Contraseña"
              autoComplete="current-password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

            {error && (
              <p className="text-red-600 text-sm">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
            >
              Ingresar
            </Button>

          </div>

        </form>

      </section>

    </div>
  );

}
