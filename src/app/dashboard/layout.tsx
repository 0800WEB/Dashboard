"use client";
import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // Importar useRouter para redirigir en el logout
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname(); // Obtiene la ruta actual

  // Cerrar el menú si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Lógica para cerrar sesión
    document.cookie = "token=; Max-Age=0; path=/;"; // Elimina la cookie del token
    router.push("/signin"); // Redirige al usuario a la página de inicio de sesión
  };

  // Función para determinar si un enlace es activo
  const isActive = (path: string) => pathname === path;

  function BeerIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 11h1a3 3 0 0 1 0 6h-1" />
        <path d="M9 12v6" />
        <path d="M13 12v6" />
        <path d="M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 2 11 2s2 1.5 3 1.5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5Z" />
        <path d="M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" />
      </svg>
    );
  }

  function CreditCardIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
      </svg>
    );
  }

  function DollarSignIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" x2="12" y1="2" y2="22" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    );
  }

  function LayoutDashboardIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </svg>
    );
  }
  function TagIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
        <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
      </svg>
    )
  }
  function LineChartIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    );
  }

  function MoveHorizontalIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="18 8 22 12 18 16" />
        <polyline points="6 8 2 12 6 16" />
        <line x1="2" x2="22" y1="12" y2="12" />
      </svg>
    );
  }

  function ShoppingCartIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>
    );
  }

  function UsersIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }
  function UserIcon(props: any) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
      </svg>
    );
  }
  
  return (
    <html lang="en">
      <body className={inter.className + " min-h-screen flex flex-col"}>
        <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6 w-full">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold"
            prefetch={false}
          >
            <BeerIcon className="h-6 w-6" />
            <span className="sr-only">Drink App</span>
          </Link>
          <nav className="hidden gap-6 text-sm font-medium md:flex">
            <Link
              href="/dashboard"
              className={`${
                isActive("/dashboard") ? "font-bold text-foreground" : "text-muted-foreground"
              } hover:text-foreground`}
              prefetch={false}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/orders"
              className={`${
                isActive("/dashboard/orders") ? "font-bold text-foreground" : "text-muted-foreground"
              } hover:text-foreground`}
              prefetch={false}
            >
              Orders
            </Link>
            <Link
              href="/dashboard/products"
              className={`${
                isActive("/dashboard/products") ? "font-bold text-foreground" : "text-muted-foreground"
              } hover:text-foreground`}
              prefetch={false}
            >
              Products
            </Link>
            <Link
              href="/dashboard/customers"
              className={`${
                isActive("/dashboard/customers") ? "font-bold text-foreground" : "text-muted-foreground"
              } hover:text-foreground`}
              prefetch={false}
            >
              Customers
            </Link>
          </nav>
          <div className="relative">
            <Button
              variant="link"
              className="rounded-full flex justify-center items-center hover:bg-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <UserIcon className="h-6 w-6 relative " />
            </Button>
            {menuOpen && (
              <div
                ref={menuRef}
                className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50"
              >
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-100 bg-white rounded-lg"
                  style={{backgroundColor:"white"}}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden h-full w-full">
          <aside className="border-r bg-background px-4 py-6 md:w-64">
            <nav className="grid gap-4">
              <Link
                href="/dashboard"
                className={`flex items-center gap-2 ${
                  isActive("/dashboard") ? "font-bold text-foreground" : "text-muted-foreground"
                } hover:text-foreground`}
                prefetch={false}
              >
                <LayoutDashboardIcon className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/orders"
                className={`flex items-center gap-2 ${
                  isActive("/dashboard/orders") ? "font-bold text-foreground" : "text-muted-foreground"
                } hover:text-foreground`}
                prefetch={false}
              >
                <ShoppingCartIcon className="h-5 w-5" />
                Orders
              </Link>
              <Link
                href="/dashboard/products"
                className={`flex items-center gap-2 ${
                  isActive("/dashboard/products") ? "font-bold text-foreground" : "text-muted-foreground"
                } hover:text-foreground`}
                prefetch={false}
              >
                <BeerIcon className="h-5 w-5" />
                Products
              </Link>
              <Link
                href="/dashboard/customers"
                className={`flex items-center gap-2 ${
                  isActive("/dashboard/customers") ? "font-bold text-foreground" : "text-muted-foreground"
                } hover:text-foreground`}
                prefetch={false}
              >
                <UsersIcon className="h-5 w-5" />
                Customers
              </Link>
              <Link
              href="/dashboard/coupons"
              className={`flex items-center gap-2 ${
                isActive("/dashboard/coupons") ? "font-bold text-foreground" : "text-muted-foreground"
              } hover:text-foreground`}
              prefetch={false}
            >
              <TagIcon className="h-5 w-5" />
              Coupons
            </Link>
            </nav>
          </aside>
          {children}
        </div>
      </body>
    </html>
  );
}