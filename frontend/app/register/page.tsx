"use client";

import { AlertDestructive } from "@/components/alert_destructive";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");
  const [errorIndex, setErrorIndex] = useState(0);

  function extractFirstWord(str: string) {
    const words = str.trim().split(/\s+/);
    return words[0];
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/register`,
        {
          username,
          email,
          password,
        }
      );

      setResponse(response.data);
      setInterval(() => {
        window.location.href = "/login";
      }, 3000);
    } catch (error: any) {
      setError(error.response.data.error);
      const firstWord = extractFirstWord(error.response.data.error);
      if (firstWord === "Username") setErrorIndex(1);
      else if (firstWord === "Email") setErrorIndex(2);
      else if (firstWord === "Password") setErrorIndex(3);
      else setErrorIndex(0);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center gap-10 flex-col min-h-screen bg-gray-100">
        <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
          <div className="flex justify-center">
            <Image src={"/chat-icon.svg"} alt="" width={70} height={70} />
          </div>
          <h3 className="text-2xl font-bold text-center">Register</h3>
          <form onSubmit={handleRegister}>
            <div className="mt-4">
              <div>
                <label className="block">Username</label>
                <input
                  type="text"
                  placeholder="Username"
                  className={`w-full text-gray-600 px-4 py-2 mt-2 border rounded-md ${
                    errorIndex === 1 ? "border-red-600" : ""
                  } focus:outline-none focus:ring-1 bg-white`}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />
              </div>
              <div className="mt-4">
                <label className="block">Email</label>
                <input
                  type="text"
                  placeholder="Email"
                  className={`w-full text-gray-600 px-4 py-2 mt-2 border rounded-md ${
                    errorIndex === 2 ? "border-red-600" : ""
                  } focus:outline-none focus:ring-1 bg-white`}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div className="mt-4">
                <label className="block">Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  className={`w-full text-gray-600 px-4 py-2 mt-2 border rounded-md ${
                    errorIndex === 3 ? "border-red-600" : ""
                  } focus:outline-none focus:ring-1 bg-white`}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
              <div className="flex items-baseline justify-between">
                <button
                  type="submit"
                  className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
                >
                  Register
                </button>
                <a
                  href="/login"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Login?
                </a>
              </div>
            </div>
          </form>
        </div>
        {error && (
          <div className="w-[350px]">
            <AlertDestructive message={error} />
          </div>
        )}
        {response && (
          <div className="w-[350px]">
            <Alert className="border-green-500">
              <AlertTitle className="text-green-500">Success</AlertTitle>
              <AlertDescription className="text-green-500">
                You will be redirected to login shortly!
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </>
  );
}
