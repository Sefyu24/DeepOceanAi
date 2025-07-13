import { Waves } from "lucide-react";
import { SignupForm } from "@/components/signup-form";

export default function SigninPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white flex size-8 items-center justify-center rounded-lg">
            <Waves className="size-5" />
          </div>
          Deep Ocean
        </a>
        <SignupForm />
      </div>
    </div>
  );
}
