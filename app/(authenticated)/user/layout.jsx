import UserNavbar from "./components/UserNavbar";

export default function RootLayout({ children }) {
    return (
        <main className="flex flex-col md:flex-row gap-6">
            <div className="md:h-fit md:w-1/4 md:sticky md:top-20">
                <UserNavbar />
            </div>
            <div className="w-full min-w-0">{children}</div>
        </main>
    );
}
