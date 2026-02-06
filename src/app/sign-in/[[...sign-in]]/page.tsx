import { SignIn } from "@clerk/nextjs";
import Image from "next/image";


export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-[#0d1117] to-slate-900 p-6">
      <div className="relative group w-full max-w-md">
        {/* Decorative Glow */}
        <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20 blur-2xl transition duration-1000 group-hover:opacity-30"></div>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-2xl">
          <div className="mb-8 text-center text-white">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-white/20 relative overflow-hidden shadow-lg">
              <Image
                src="/logo.png"
                alt="TextForge Logo"
                fill
                className="object-contain p-2"
              />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
            <p className="mt-2 text-xs text-slate-400">Continue to TextForge Studio</p>
          </div>

          <SignIn
            appearance={{
              elements: {
                formButtonPrimary: "bg-slate-100 hover:bg-white text-slate-900 text-xs font-bold uppercase tracking-widest",
                card: "bg-transparent shadow-none p-0",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "bg-white/5 border-white/10 text-white hover:bg-white/10",
                socialButtonsBlockButtonText: "text-white font-medium",
                formFieldLabel: "text-slate-400 text-[10px] font-bold uppercase tracking-widest",
                formFieldInput: "bg-white/5 border-white/10 text-white placeholder-slate-600",
                footerActionText: "text-slate-400",
                footerActionLink: "text-blue-400 hover:text-blue-300",
                dividerLine: "bg-white/10",
                dividerText: "text-slate-500",
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
