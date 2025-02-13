"use client"

import Link from "next/link"
import { z } from "zod"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authenticate } from "@/app/login/actions"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {message: "Password too short!"}),
})

export function LoginForm() {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const isAuthenticated = await authenticate(values.email, values.password)
    if (isAuthenticated) {
      router.push('/')
      toast("Logged in successfully")
    } else {
      toast("Login failed! Make sure you enter the correct credentials")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 w-full">
      <Card className="w-full max-w-md shadow-xl border-gray-200 bg-white">
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="text-3xl font-bold text-blue-600 text-center">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-600 text-center">
            Enter your credentials to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="example@google.com" 
                        className="border-gray-300 text-gray-950 bg-gray-50 focus:border-blue-500 focus:ring-blue-500" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="Enter your password" 
                        className="border-gray-300 text-gray-950 bg-gray-50 focus:border-blue-500 focus:ring-blue-500" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Sign In
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-gray-600 text-sm">
            Don&apos;t have an account?{" "}
            <Link 
              href="/signup" 
              className="text-blue-600 hover:text-blue-700 font-medium underline"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
















// "use client"

// import Link from "next/link"
// import { z } from "zod"

// import { toast } from "sonner"

// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"

// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import {authenticate} from "@/app/login/actions";

// import { useRouter } from "next/navigation"

// const formSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(8, {message: "Password too short!"}),
// })

// export function LoginForm() {

//   const router = useRouter();

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   })

//   const onSubmit=async (values: z.infer<typeof formSchema>) => {
//     const isAuthenticated = await authenticate(values.email, values.password);

//     if (isAuthenticated) {
//       router.push('/');  // Perform the redirect if successful
//       toast("Logged in successfully")

//     } else {
//       toast("Login failed! Make sure you enter the correct credentials")
//     }

//   }

//   return (
//       <Card className="mx-auto max-w-sm bg-gradient-to-br">
//         <CardHeader>
//           <CardTitle className="text-2xl">Login</CardTitle>
//           <CardDescription>
//             Enter your credentials to login to your account
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//               <FormField
//                   control={form.control}
//                   name="email"
//                   render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Email</FormLabel>
//                         <FormControl>
//                           <Input placeholder="example@google.com" {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                   )}
//               />

//               <FormField
//                   control={form.control}
//                   name="password"
//                   render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Password</FormLabel>
//                         <FormControl>
//                           <Input placeholder="password" {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                   )}
//               />
//               <Button type="submit">Submit</Button>
//             </form>
//           </Form>

//           <div className="mt-4 text-center text-sm">
//             Don&apos;t have an account?{" "}
//             <Link href="/signup" className="underline">
//               Sign up
//             </Link>
//           </div>
//         </CardContent>
//       </Card>
//   );
// }
