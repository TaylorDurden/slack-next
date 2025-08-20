import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { SignCardProps } from "../types";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

export const SignInCard = ({ setSignFlow }: SignCardProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  const { signIn } = useAuthActions();

  const onProviderSignIn = (value: "github" | "google") => {
    setPending(true);
    signIn(value).finally(() => setPending(false));
  };
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
        <CardAction>
          <Button disabled={pending} variant="link" onClick={() => setSignFlow("signUp")}>
            Sign Up
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                disabled={pending}
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                  Forgot your password?
                </a>
              </div>
              <Input
                disabled={pending}
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button disabled={pending} type="submit" className="w-full">
              Login
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button disabled={pending} variant="outline" className="w-full" onClick={() => onProviderSignIn("google")}>
          Login with <FaGoogle />
        </Button>
        <Button disabled={pending} variant="outline" className="w-full" onClick={() => onProviderSignIn("github")}>
          Login with <FaGithub />
        </Button>
      </CardFooter>
    </Card>
  );
};
