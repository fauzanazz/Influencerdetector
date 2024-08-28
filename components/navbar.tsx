import Link from "next/link";

export const Navbar = () => {
    return (
        <header className="bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
                <Link href="#" className="font-bold text-xl" prefetch={false}>
                    FakeTwitter
                </Link>
                <nav className="hidden md:flex items-center gap-4">
                    <Link href="/" className="text-gray-600 hover:text-gray-800" prefetch={false}>
                        Home
                    </Link>
                    <Link href="/user-management" className="text-gray-600 hover:text-gray-800" prefetch={false}>
                        User Management
                    </Link>
                    <Link href="/tweet-management" className="text-gray-600 hover:text-gray-800" prefetch={false}>
                        Tweet Management
                    </Link>
                    <Link href="graph-visualisation" className="text-gray-600 hover:text-gray-800" prefetch={false}>
                        Graph Visualisation
                    </Link>
                </nav>
            </div>
        </header>
    );
}