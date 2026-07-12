"use client";

import { subscribeBidChannel } from "@/app/services/bids.service";
import { useEffect, useState } from "react";

export function useRealtimePrice(productId, initialPrice) {
    const [price, setPrice] = useState(initialPrice);

    useEffect(() => {
        setPrice(initialPrice);
    }, [initialPrice]);

    useEffect(() => {
        if (!productId) return;
        return subscribeBidChannel(productId, (payload) => {
            setPrice(payload.price);
        });
    }, [productId]);

    return price;
}
