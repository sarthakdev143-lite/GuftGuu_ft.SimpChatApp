"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const PrivateChat = () => {
    const router = useRouter();

    useEffect(() => {
        alert("This is Under Development :)\n\n#COMING_SOON");
        router.push("/");
    }, [router]);

    return <></>;
};

export default PrivateChat;
