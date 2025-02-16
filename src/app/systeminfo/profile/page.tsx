'use client'

import React, { useEffect } from 'react';
import { User, Mail, Key, Laptop, Save, Edit2 } from 'lucide-react';
import {retrieveLoggedInUserAccount, updateUserProfile} from "@/app/actions/useractions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {toast} from "sonner";

// Define the validation schema
const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    device_id: z.string().nullable(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

function ProfilePage() {
    const [isEditing, setIsEditing] = React.useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
    });

    const fetchLoggedInUser = async () => {
        const loggedInUser = await retrieveLoggedInUserAccount();
        if (loggedInUser) {
            reset({
                name: loggedInUser.name,
                email: loggedInUser.email,
                password: loggedInUser.password,
                device_id: loggedInUser.device_identifier,
            });
        }
    };

    useEffect(() => {
        fetchLoggedInUser();
    }, [reset]);

    const onSubmit = async (data: ProfileFormData) => {
        try {
            console.log('Profile saved:', data);
            await updateUserProfile(data);
            toast.success('Profile saved successfully!');
            setIsEditing(false);
        } catch (error) {
            toast.error(`Error saving profile: ${error instanceof Error ? error.message: "Error saving profile"}`);
            console.error('Error saving profile:', error);
        }
    };

    const toggleEdit = () => {
        if (isEditing) {
            handleSubmit(onSubmit)();
        } else {
            setIsEditing(true);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-8 py-6 bg-indigo-600">
                    <div className="flex flex-col items-center mb-4">
                        <img
                            src="/profile_pic.webp"
                            alt="Profile"
                            className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-white">User Profile</h1>
                        <button
                            onClick={toggleEdit}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                            {isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                            {isEditing ? 'Save' : 'Edit'}
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6 space-y-6">
                    <div className="space-y-6">
                        <div className="relative">
                            <div className="flex items-center gap-3">
                                <User className="w-5 h-5 text-indigo-500" />
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                            </div>
                            <input
                                {...register('name')}
                                disabled={!isEditing}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="relative">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-indigo-500" />
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                            </div>
                            <input
                                {...register('email')}
                                type="email"
                                disabled={!isEditing}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="relative">
                            <div className="flex items-center gap-3">
                                <Key className="w-5 h-5 text-indigo-500" />
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                            </div>
                            <input
                                {...register('password')}
                                type="password"
                                disabled={!isEditing}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="relative">
                            <div className="flex items-center gap-3">
                                <Laptop className="w-5 h-5 text-indigo-500" />
                                <label htmlFor="device_id" className="block text-sm font-medium text-gray-700">
                                    Device ID
                                </label>
                            </div>
                            <input
                                {...register('device_id')}
                                disabled={!isEditing} // Always disabled as it's read-only
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                            />
                        </div>
                    </div>

                    {isEditing && (
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default ProfilePage;
