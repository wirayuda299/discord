import { SignIn } from "@clerk/nextjs";

export function generateStaticParams() {
  return [
    { "sign-in": ["sign-in", "1"] },
    { "sign-in": ["sign-in", "2"] },
    { "sign-in": ["sign-in", "3"] },
  ];
}
export default function SignInPage() {
  return <SignIn />;
}
