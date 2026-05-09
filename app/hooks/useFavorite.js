"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase/client";
import { addFavorite, removeFavorite, checkIsFavorite } from "@/app/services/favorites.service";

export function useFavorite(productId) {
    const [userId, setUserId] = useState(null);
    const [isFavorited, setIsFavorited] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) setUserId(user.id);
        });
    }, []);

    useEffect(() => {
        if (!productId || !userId) return;
        checkIsFavorite(productId).then(setIsFavorited);
    }, [productId, userId]);

    const toggle = async () => {
        if (!userId || !productId || loading) return;
        setLoading(true);
        if (isFavorited) {
            await removeFavorite(productId);
            setIsFavorited(false);
        } else {
            await addFavorite(productId);
            setIsFavorited(true);
        }
        setLoading(false);
    };

    return { isFavorited, toggle, loading };
}
