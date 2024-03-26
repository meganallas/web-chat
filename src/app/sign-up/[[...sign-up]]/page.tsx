import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="h-screen flex items-center justify-center">
      <SignUp appearance={{ variables: { colorPrimary: "#6365f1" } }} />
    </div>
  );
}
