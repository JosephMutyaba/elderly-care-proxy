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
import signup from "@/app/signup/actions"

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(4, {message: "Name must be at least 4 characters"}),
  password: z.string().min(8, {message: "Password must be at least 8 characters"}),
  confirmPassword: z.string().min(8, {message: "Password must be at least 8 characters"})
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export function SignUpForm() {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const isSignedUp = await signup(values.email, values.password, values.name)
    if (isSignedUp) {
      router.push('/')
      toast("Signed up successfully")
    } else {
      toast("Sign up failed! Make sure you enter the correct credentials")
    }
  }

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 via-gray-50 to-blue-50 p-4 w-full">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[100%] animate-[spin_20s_linear_infinite] opacity-30">
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
          <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-blue-300 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gray-300 rounded-full blur-3xl" />
        </div>
      </div>

      <Card className="w-full max-w-md shadow-xl border-gray-200 bg-white/95 backdrop-blur-sm relative">
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="text-3xl font-bold text-blue-600 text-center">
            Create Account
          </CardTitle>
          <CardDescription className="text-gray-600 text-center">
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Full name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Your name" 
                        className="border-gray-300 text-gray-950 bg-gray-50 focus:border-blue-500 focus:ring-blue-500" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm font-medium mt-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="example@google.com" 
                        className="border-gray-300 text-gray-950 bg-gray-50 focus:border-blue-500 focus:ring-blue-500" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm font-medium mt-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="Enter your password" 
                        className="border-gray-300 text-gray-950 bg-gray-50 focus:border-blue-500 focus:ring-blue-500" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm font-medium mt-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Confirm Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="Confirm your password" 
                        className="border-gray-300 text-gray-950 bg-gray-50 focus:border-blue-500 focus:ring-blue-500" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm font-medium mt-1" />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Create Account
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link 
              href="/login" 
              className="text-blue-600 hover:text-blue-700 font-medium underline"
            >
              Sign in
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
// import { useRouter } from "next/navigation"
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
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import signup from "@/app/signup/actions"

// const formSchema = z.object({
//   email: z.string().email(),
//   name: z.string().min(4, {message: "Name atleat 4 characters!"}),
//   password: z.string().min(8, {message: "Password too short!"}),
//   confirmPassword: z.string().min(8, {message: "Password too short!"})
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords do not match!!!",
//   path: ["confirmPassword"],
// })

// export function SignUpForm() {
//   const router = useRouter()

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: "",
//       name: "",
//       password: "",
//       confirmPassword: "",
//     },
//   })

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     const isSignedUp = await signup(values.email, values.password, values.name)
//     if (isSignedUp) {
//       router.push('/')
//       toast("Signedup successfully")
//     } else {
//       toast("Sign up failed! Make sure you enter the correct credentials")
//     }
//   }

//   return (
//     <div className="overflow-y-auto flex items-center justify-center bg-gradient-to-br from-blue-50 via-gray-50 to-blue-50 p-4 w-full my-4">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -inset-[100%] animate-[spin_20s_linear_infinite] opacity-30">
//           <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
//           <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-blue-300 rounded-full blur-3xl" />
//           <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gray-300 rounded-full blur-3xl" />
//         </div>
//       </div>

//       <Card className="w-full max-w-md shadow-xl border-gray-200 bg-white/95 backdrop-blur-sm relative">
//         <CardHeader className="space-y-2 pb-6">
//           <CardTitle className="text-3xl font-bold text-blue-600 text-center">
//             Create Account
//           </CardTitle>
//           <CardDescription className="text-gray-600 text-center">
//             Enter your details to create your account
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-gray-700 font-medium">Full name</FormLabel>
//                     <FormControl>
//                       <Input 
//                         placeholder="Your name" 
//                         className="border-gray-300 text-gray-950 bg-gray-50 focus:border-blue-500 focus:ring-blue-500" 
//                         {...field} 
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-500" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
//                     <FormControl>
//                       <Input 
//                         placeholder="example@google.com" 
//                         className="border-gray-300 text-gray-950 bg-gray-50 focus:border-blue-500 focus:ring-blue-500" 
//                         {...field} 
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-500" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
//                     <FormControl>
//                       <Input 
//                         type="password"
//                         placeholder="Enter your password" 
//                         className="border-gray-300 text-gray-950 bg-gray-50 focus:border-blue-500 focus:ring-blue-500" 
//                         {...field} 
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-500" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="confirmPassword"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-gray-700 font-medium">Confirm Password</FormLabel>
//                     <FormControl>
//                       <Input 
//                         type="password"
//                         placeholder="Confirm your password" 
//                         className="border-gray-300 text-gray-950 bg-gray-50 focus:border-blue-500 focus:ring-blue-500" 
//                         {...field} 
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-500" />
//                   </FormItem>
//                 )}
//               />
//               <Button 
//                 type="submit" 
//                 className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
//               >
//                 Create Account
//               </Button>
//             </form>
//           </Form>

//           <div className="mt-6 text-center text-gray-600 text-sm">
//             Already have an account?{" "}
//             <Link 
//               href="/login" 
//               className="text-blue-600 hover:text-blue-700 font-medium underline"
//             >
//               Sign in
//             </Link>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }



































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
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"

// import { useRouter } from "next/navigation"
// import signup from "@/app/signup/actions"

// const formSchema = z.object({
//   email: z.string().email(),
//   name: z.string().min(4, {message: "Name atleat 4 characters!"}),
//   password: z.string().min(8, {message: "Password too short!"}),
//   confirmPassword: z.string().min(8, {message: "Password too short!"}),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords do not match!!!",
//   path: ["confirmPassword"], // Error will appear under confirmPassword field
// })

// export function SignUpForm() {
//   const router = useRouter();

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: "",
//       name: "",
//       password: "",
//       confirmPassword: "",
//     },
//   })

//   const onSubmit=async (values: z.infer<typeof formSchema>) => {
//     const isSignedUp = await signup(values.email, values.password, values.name);

//     if (isSignedUp) {
//       router.push('/');  // Perform the redirect if successful
//       toast("Signedup successfully")
//     } else {
//       toast("Sign up failed! Make sure you enter the correct credentials")
//     }
//   }

//   return (
//       <Card className="mx-auto max-w-sm">
//         <CardHeader>
//           <CardTitle className="text-2xl">Sign Up</CardTitle>
//           <CardDescription>
//             Enter your credentials to login to your account
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//               <FormField
//                   control={form.control}
//                   name="name"
//                   render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Full name</FormLabel>
//                         <FormControl>
//                           <Input placeholder="Your name" {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                   )}
//               />
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
//               <FormField
//                   control={form.control}
//                   name="confirmPassword"
//                   render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Confirm Password</FormLabel>
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
//             Already have an account?{" "}
//             <Link href="/login" className="underline">
//               Sign in
//             </Link>
//           </div>
//         </CardContent>
//       </Card>
//   );
// }
