export type SignInFlow = "signIn" | "signUp";

export interface SignCardProps {
  setSignFlow: (state: SignInFlow) => void;
}
