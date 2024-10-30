'use client'

// import { authenticate, login, signup } from './actions'
import { authenticate } from './actions'


import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {message:"Password should be at least 8 characters!"}),
})


export default function LoginPage() {

    const authForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
          email: '',
          password: '',
        },
    });

    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const router = useRouter();

      const onSubmit = async ({ email, password }: z.infer<typeof loginSchema>) => {
        setIsAuthenticating(true);

        try {
          const authStatus = await authenticate(email,password);

          if (!authStatus) {
            throw new Error("Authentication failed")
          }
          router.push('/');
        } catch (error) {
            throw error
        } finally {
          setIsAuthenticating(false);
        }
      };

      return (
        <div className='flex h-svh items-center justify-center'>
          <div className='mx-auto grid w-[350px] gap-6'>
            <Form {...authForm}>
              <form onSubmit={authForm.handleSubmit(onSubmit)} className='grid gap-4 border-2 px-5 py-5 rounded-2xl'>
                <FormField
                  control={authForm.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem className='grid gap-2'>
                      <FormLabel htmlFor='email'>Email</FormLabel>
                      <FormControl>
                        <Input
                          id='email'
                          type='email'
                          placeholder='m@example.com'
                          {...field}
                          disabled={isAuthenticating}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={authForm.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem className='grid gap-2'>
                      <div className='flex items-center'>
                        <FormLabel htmlFor='password'>Password</FormLabel>
                      </div>
                      <FormControl>
                        <Input
                          disabled={isAuthenticating}
                          id='password'
                          type='password'
                          {...field}
                        />
                      </FormControl>{' '}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  disabled={isAuthenticating}
                  type='submit'
                  className='w-full'
                >
                  Login
                </Button>
              </form>
            </Form>
          </div>
        </div>
      );






//   return (
    // <form>
    //   <label htmlFor="email">Email:</label>
    //   <input id="email" name="email" type="email" required />
    //   <label htmlFor="password">Password:</label>
    //   <input id="password" name="password" type="password" required />
    //   <button formAction={login}>Log in</button>
    //   <button formAction={signup}>Sign up</button>
    // </form>

    
//   )
}