'use client';

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LandingPage from "./landingpage/LandingPage";

function Home() {
    const router = useRouter();

    // useEffect(() => {
    //     router.push('/systeminfo');
    // }, [router]);

    return (
        <>
        <LandingPage/>
        </>
    );
}

export default dynamic(() => Promise.resolve(Home), { ssr: false });
