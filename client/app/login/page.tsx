'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    console.log(res)
    if (res?.ok) {
      router.push("/list");
    } else {
      alert("Invalid credentials");
    }
  }

  async function handleGoogleSignIn(e: React.MouseEvent) {
    e.preventDefault();
    await signIn("google", { callbackUrl: "/list" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f7fa] px-2">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* Left image sections */}
        <div className="hidden md:flex md:w-1/2 bg-[#e6eafc] p-6 items-center justify-center">
          <Image
            src="/hero.webp"
            width={800}
            height={600}
            alt="Login Visual"
            className="rounded-xl w-full h-[400px] md:h-[500px] lg:h-[600px]"
            style={{ objectFit: 'cover', background: 'linear-gradient(135deg, #e6eafc 0%, #f7f7fa 100%)' }}
            unoptimized
            quality={100}
          />
        </div>
        {/* Right form section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-2 text-black">Welcome Back</h2>
          <p className="mb-8 text-gray-600">Enter your email and password to access your account</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="text"
                placeholder="Enter your email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
                autoComplete="current-password"
              />
            </div>
            <div className="flex items-center text-sm">
            </div>
            <button type="submit" className="w-full bg-black cursor-pointer text-white py-2 rounded-lg font-semibold hover:bg-gray-900 transition-colors">Sign In</button>
          </form>

        </div>
      </div>
    </div>
  );
}
