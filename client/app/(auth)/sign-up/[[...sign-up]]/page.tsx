import { SignUp } from "@clerk/nextjs";

export function generateStaticParams() {
  return [
    { "sign-up": ["sign-up", "1"] },
    { "sign-up": ["sign-up", "2"] },
    { "sign-up": ["sign-up", "3"] },
  ];
}

export default function SignUpPage() {
  return <SignUp />;
}
