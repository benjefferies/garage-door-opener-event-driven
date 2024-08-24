"use client";

import { useEffect } from "react";

export default function Login() {
  useEffect(() => {
    require("@passageidentity/passage-elements/passage-profil");
  }, []);
  return (
    <main>
      <passage-profile app-id="9w46eDqKDaoJcvirBLcXVXLX"></passage-profile>
    </main>
  );
}
