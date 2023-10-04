"use client";

import { AlertDestructive } from "@/components/alert_destructive";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errorIndex, setErrorIndex] = useState(0);
  const router = useRouter();

  function extractFirstWord(str: string) {
    const words = str.trim().split(/\s+/);
    return words[0];
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/login`,
        {
          email,
          password,
        }
      );
      if (!response || !response?.data) throw new Error("Invalid login");

      const sessionID = response.data.sessionID;
      document.cookie = `sessionID=${sessionID}`;
      toast.success("logged in");
      window.location.href = "/users";
    } catch (error: any) {
      setError(error.response.data.error);
      const firstWord = extractFirstWord(error.response.data.error);
      if (firstWord === "Email") setErrorIndex(1);
      else if (firstWord === "Password") setErrorIndex(2);
      else setErrorIndex(0);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center gap-10 flex-col min-h-screen bg-gray-100">
        <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
          <div className="flex justify-center">
            <Image
              src={"/chat-icon.svg"}
              alt=""
              width={70}
              height={70}
              property="0"
            />
          </div>
          <h3 className="text-2xl font-bold text-center">
            Login to your account
          </h3>
          <form onSubmit={handleLogin}>
            <div className="mt-4">
              <div>
                <label className="block">Email</label>
                <input
                  type="text"
                  placeholder="Email"
                  className={`w-full text-gray-600 px-4 py-2 mt-2 border rounded-md ${
                    errorIndex === 1 ? "border-red-600" : ""
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
                    errorIndex === 2 ? "border-red-600" : ""
                  } focus:outline-none focus:ring-1 bg-white`}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
              <div className="flex items-baseline justify-between">
                <button className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
                  Login
                </button>
                <a
                  href="/register"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Register?
                </a>
              </div>
            </div>
          </form>
        </div>
        {error && (
          <div className="bottom-0 w-[350px]">
            <AlertDestructive message={error} />
          </div>
        )}
      </div>
    </>
  );
}
