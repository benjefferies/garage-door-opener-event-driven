"use client";
import { useEffect } from "react";

export default function Login() {
  useEffect(() => {
    require("@passageidentity/passage-elements/passage-auth");
  }, []);

  return (
    <main>
      <passage-auth app-id="9w46eDqKDaoJcvirBLcXVXLX"></passage-auth>
    </main>
  );
}
