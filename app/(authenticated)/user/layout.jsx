import UserNavbar from "@/app/components/utils/UserNavbar";

export default function RootLayout({ children }) {
    return (
        <main className="flex gap-4">
            <div className="h-fit w-1/4 sticky top-12">
                <UserNavbar />
            </div>
            <div className="w-full">{children}</div>
        </main>
    );
}
