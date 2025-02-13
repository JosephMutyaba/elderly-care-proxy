'use client'
import { LoginForm } from "@/components/login-form"
import { createClient } from "@/supabase/client"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { getUser } from "./actions"

export default function Page() {
  const router = useRouter()

  const pathname = usePathname();  // Get the current path

  useEffect(() => {
    async function obtainUser() {
      const user = await getUser();

      // Redirect based on login state
      if (user.data.user && pathname === "/login") {
        // If logged in and currently on login page, redirect to dashboard
        router.push("/");
      } else if (!user.data.user && pathname !== "/login") {
        // If not logged in and not already on login, redirect to login page
        router.push("/login");
      }
    }

    obtainUser();
  }, [router, pathname]);

  return (
    <div className="flex min-h-dvh w-full items-center justify-center">
      <LoginForm />
    </div>
  )
}
