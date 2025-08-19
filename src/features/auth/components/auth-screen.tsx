"use client";

import { useState } from "react";
import { SignInFlow } from "../types";
import { SignInCard } from "./signin-card";
import { SignUpCard } from "./signup-card";

export const AuthScreen = () => {
  const [signInFlow, setSignFlow] = useState<SignInFlow>("signIn");
  return (
    <div className="h-full flex items-center justify-center bg-[#5C3B58]">
      {signInFlow === "signIn" ? <SignInCard setSignFlow={setSignFlow} /> : <SignUpCard setSignFlow={setSignFlow} />}
    </div>
  );
};
