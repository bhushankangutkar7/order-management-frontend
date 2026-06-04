'use client';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from "next/link";
import { logout } from '../app/actions/AuthActions.js';

// Items visible ONLY to guests (not logged in)
const publicMenuItems = [
  { key: "/", label: "Home", href: "/" },
  { key: "/about", label: "About", href: "/about" },
  { key: "/contact", label: "Contact", href: "/contact" },
  { key: "/login", label: "Login", href: "/login" },
  { key: "/signup", label: "Signup", href: "/signup" },
];

// Items visible ONLY to authenticated users
const protectedMenuItems = [
  { key: "/", label: "Home", href: "/" },
  { key: "/about", label: "About", href: "/about" },
  { key: "/contact", label: "Contact", href: "/contact" },
  { key: "/menu", label: "Menu", href: "/menu" },
  { key: "/cart", label: "Cart", href: "/cart" },
  { key: "/orders", label: "Orders", href: "/orders" },
  { key: "/profile", label: "Profile", href: "/profile" },
  { key: "logout", label: "Logout" }, // Unique key for handling logout actions
];

const NavbarComponent = ({ isAuthenticated }) => {
  const [selectedKey, setSelectedKey] = useState("");
  const [menuItems, setMenuItems] = useState(publicMenuItems); // Dynamic state for items
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {

    if (isAuthenticated) {
      setMenuItems(protectedMenuItems);
    } else {
      setMenuItems(publicMenuItems);
    }

    setSelectedKey(pathname);
  }, [pathname]);

  const handleLogout = async() => {
    try{
      const res = await logout();
      if (res.success) {
        router.refresh();
        router.push('/login');
      }
    }catch(error){
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="navbar bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="logo">
        <Link href="/">Food Express</Link>
      </div>

      <div className="flex gap-2">
        <ul className="flex space-x-6 text-sm">
          {menuItems.map((item) => (
            <li key={item.key}>
              {item.key === 'logout' ? (
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-gray-300"
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className="text-white hover:text-gray-300"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default NavbarComponent;