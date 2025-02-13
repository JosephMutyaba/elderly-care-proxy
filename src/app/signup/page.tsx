'use client'
import { LoginForm } from "@/components/login-form"
import { createClient } from "@/supabase/client"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { getUser } from "../login/actions"
import { SignUpForm } from "@/components/signup-form"

export default function SignUpPage() {
  const router = useRouter()

  const pathname = usePathname();  // Get the current path

  useEffect(() => {
    async function obtainUser() {
      const user = await getUser();

      // Redirect based on login state
      if (user.data.user && pathname === "/signup") {
        // If logged in and currently on login page, redirect to dashboard
        router.push("/");
      } else if (!user.data.user) {
        // If not logged in and not already on login, redirect to login page
        router.push("/signup");
      }
    }

    obtainUser();
  }, [router, pathname]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4">
      <SignUpForm />
      {/* <p>Christus Semper!</p> */}
    </div>
  )
}
