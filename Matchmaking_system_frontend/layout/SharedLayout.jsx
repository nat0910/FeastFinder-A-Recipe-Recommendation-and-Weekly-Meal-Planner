import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Header from "../src/components/layout/header";

export default function SharedLayout() {
  return (
    <>
      <Header />
      <main
        id="main"
        style={{
          paddingBottom: "2rem",
        }}
      >
        <Suspense>
          <Outlet />
        </Suspense>
      </main>
    </>
  );
}
