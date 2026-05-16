"use client";

import { supabase } from "@/app/lib/supabase/client";
import { useEffect, useState } from "react";

export function useRealtimePrice(productId, initialPrice) {
    const [price, setPrice] = useState(initialPrice);

    useEffect(() => {
        setPrice(initialPrice);
    }, [initialPrice]);

    useEffect(() => {
        if (!productId) return;
        const channel = supabase
            .channel(`bid-${productId}`)
            .on("broadcast", { event: "new_bid" }, ({ payload }) => {
                setPrice(payload.price);
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [productId]);

    return price;
}
