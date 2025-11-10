import { useEffect, useState } from "react";

export function useCount() {
    const [count, setCount] = useState(0);

    const increment = () => {
        setCount(count + 1);
    }
    const decrement = () => {
        setCount(count - 1);
    }

    useEffect(() => {
        console.log("Count changed:", count);
    }, [count]);

    return { count, increment, decrement };
}