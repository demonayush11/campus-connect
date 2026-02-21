
"use client";

import * as React from "react";
import {
  useState,
} from "react";
import { Instagram, Linkedin, Facebook } from "lucide-react";
import { HoverButton } from "@/components/ui/hover-glow-button";

const AppInput = (props) => {
  const { label, placeholder, icon, ...rest } = props;
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="w-full min-w-[200px] relative">
      {label && <label className="block mb-2 text-sm">{label}</label>}
      <div className="relative w-full">
        <input
          type="text"
          className="peer relative z-10 border-2 border-[var(--color-border)] h-13 w-full rounded-md bg-[var(--color-surface)] px-4 font-thin outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-[var(--color-bg)] placeholder:font-medium"
          placeholder={placeholder}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          {...rest}
        />
        {isHovering && (
          <>
            <div
              className="absolute pointer-events-none top-0 left-0 right-0 h-[2px] z-20 rounded-t-md overflow-hidden"
              style={{
                background: `radial-gradient(30px circle at ${mousePosition.x}px 0px, var(--color-text-primary) 0%, transparent 70%)`,
              }}
            />
            <div
              className="absolute pointer-events-none bottom-0 left-0 right-0 h-[2px] z-20 rounded-b-md overflow-hidden"
              style={{
                background: `radial-gradient(30px circle at ${mousePosition.x}px 2px, var(--color-text-primary) 0%, transparent 70%)`,
              }}
            />
          </>
        )}
        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

const Page = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    const leftSection = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - leftSection.left,
      y: e.clientY - leftSection.top,
    });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const socialIcons = [
    {
      icon: <Instagram />,
      href: "#",
      gradient: "bg-[var(--color-bg)]",
    },
    {
      icon: <Linkedin />,
      href: "#",
      bg: "bg-[var(--color-bg)]",
    },
    {
      icon: <Facebook />,
      href: "#",
      bg: "bg-[var(--color-bg)]",
    },
  ];

  return (
    <div className="h-screen w-[100%] bg-[var(--color-bg)] flex items-center justify-center p-4">
      <div className="card w-[80%] lg:w-[70%] md:w-[55%] flex justify-between h-[600px]">
        <div
          className="w-full lg:w-1/2 px-4 lg:px-16 left h-full relative overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={`absolute pointer-events-none w-[500px] h-[500px] bg-gradient-to-r from-purple-300/30 via-blue-300/30 to-pink-300/30 rounded-full blur-3xl transition-opacity duration-200 ${
              isHovering ? "opacity-100" : "opacity-0"
            }`}
            style={{
              transform: `translate(${mousePosition.x - 250}px, ${
                mousePosition.y - 250
              }px)`,
              transition: "transform 0.1s ease-out",
            }}
          />
          <div className="form-container sign-in-container h-full z-10">
            <form
              className="text-center py-10 md:py-20 grid gap-2 h-full"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="grid gap-4 md:gap-6 mb-2">
                <h1
                  className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 bg-clip-text text-transparent"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  Sign in
                </h1>
                <div className="social-container">
                  <div className="flex items-center justify-center">
                    <ul className="flex gap-3 md:gap-4">
                      {socialIcons.map((social, index) => {
                        return (
                          <li key={index} className="list-none">
                            <a
                              href={social.href}
                              className={`w-[2.5rem] md:w-[3rem] h-[2.5rem] md:h-[3rem] bg-[var(--color-bg-2)] rounded-full flex justify-center items-center relative z-[1] border-3 border-[var(--color-text-primary)] overflow-hidden group`}
                            >
                              <div
                                className={`absolute inset-0 w-full h-full ${
                                  social.gradient || social.bg
                                } scale-y-0 origin-bottom transition-transform duration-500 ease-in-out group-hover:scale-y-100`}
                              />
                              <span className="text-[1.5rem] text-[hsl(203,92%,8%)] transition-all duration-500 ease-in-out z-[2] group-hover:text-[var(--color-text-primary)] group-hover:rotate-y-360">
                                {social.icon}
                              </span>
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
              <span className="text-sm">or use your account</span>
              <div className="grid gap-4 items-center">
                <AppInput placeholder="Email" type="email" />
                <AppInput placeholder="Password" type="password" />
              </div>
              <a href="#" className="font-light text-sm md:text-md">
                Forgot your password?
              </a>
              <div className="flex gap-4 justify-center items-center">
                <HoverButton
                  glowColor="#a855f7"
                  backgroundColor="#6366F1"
                  className="text-sm px-2 py-1"
                >
                  Sign In
                </HoverButton>
              </div>
            </form>
          </div>
        </div>
        <div className="hidden lg:block w-1/2 right h-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=2787&auto=format&fit=crop"
            width={1000}
            height={1000}
            alt="Carousel image"
            className="w-full h-full object-cover transition-transform duration-300 opacity-30"
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
