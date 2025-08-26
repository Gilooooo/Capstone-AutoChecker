"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Provider from "./Provider";

const inter = Inter({ subsets: ["latin"] });
const metadata = {
  title: "Auto Checker",
  description: "Created by EOS",
};

export default function RootLayout({ children }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);
  return (
    <>
      <head>
        <title>{metadata.title}</title>
      </head>
      <html lang="en">
        <body className={inter.className}>
          <Provider>
            {children}
          </Provider>
        </body>
      </html>
    </>
  );
}
