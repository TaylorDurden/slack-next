import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignCardProps } from "../types";
import { useAuthActions } from "@convex-dev/auth/react";
import { FormEvent, useState } from "react";
import { AuthError } from "./auth-error";

export const SignUpCard = ({ setSignFlow }: SignCardProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const { signIn } = useAuthActions();

  const onPasswordSignUp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setPending(true);

    signIn("password", {
      name,
      email,
      password,
      flow: "signUp",
    })
      .catch(() => {
        setError("Something went wrong.");
      })
      .finally(() => {
        setPending(false);
      });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign up to continue</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <AuthError message={error} />
      <CardContent>
        <form onSubmit={onPasswordSignUp} aria-busy={pending}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Full Name</Label>
              <Input
                disabled={pending}
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Wall"
                autoComplete="name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                disabled={pending}
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m@example.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                disabled={pending}
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="new-password"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Confirm Password</Label>
              </div>
              <Input
                disabled={pending}
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                autoComplete="new-password"
                required
              />
            </div>
            <Button disabled={pending} type="submit" className="w-full">
              Sign Up
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <p className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <span className="text-sky-700 hover:underline cursor-pointer" onClick={() => setSignFlow("signIn")}>
            Sign In
          </span>
        </p>
      </CardFooter>
    </Card>
  );
};
