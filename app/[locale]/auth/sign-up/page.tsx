import { SignUpForm } from "@/components/sign-up-form";

export default function Page() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen w-full flex items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  );
}
