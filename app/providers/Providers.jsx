"use client";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { useInactivityLogout } from "../hooks/useInactivityLogout";

function InactivityGuard() {
    useInactivityLogout();
    return null;
}

export default function Providers({ children }) {
    return (
        <Provider store={store}>
            <InactivityGuard />
            {children}
        </Provider>
    );
}
