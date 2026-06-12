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
  // const [selectedKey, setSelectedKey] = useState("");
  const [menuItems, setMenuItems] = useState(publicMenuItems); // Dynamic state for items
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {

    if (isAuthenticated) {
      setMenuItems(protectedMenuItems);
    } else {
      setMenuItems(publicMenuItems);
    }

    // setSelectedKey(pathname);
  }, [isAuthenticated]);


  useEffect(()=>{
    const mq = window.matchMedia("(max-width: 650px)");

    const handleChange = (e) => {
      setIsMobile(e.matches);
      if (!e.matches) {
        setOpen(()=> false); //Close menu when leaving mobile
      }
    };

    handleChange(mq);
    mq.addEventListener("change", handleChange);

    return () => {
      mq.removeEventListener("change", handleChange);
    }

  },[]);

  useEffect(() => {
    if (open) {
      document.documentElement.classList.add("overflow-hidden");
      document.body.classList.add("overflow-hidden");
    } else {
      document.documentElement.classList.remove("overflow-hidden");
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.documentElement.classList.remove("overflow-hidden");
      document.body.classList.remove("overflow-hidden");
    };
  }, [open]);

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

  const renderMenuItems = () => {
    return menuItems.map((item) => (
      <li key={item.key} className="py-2">
        {item.key === "logout" ? (
          <button
            onClick={handleLogout}
            className="text-white hover:text-gray-300"
          >
            {item.label}
          </button>
        ): (
          <Link
            href={item.href}
            onClick={() => setOpen(()=>false)} // Close menu after navigation (mobile)
          >
            {item.label}
          </Link>
        )}
      </li>
    ))
  };

  return (
    <nav className="navbar fixed left-0 w-full min-w-[350px] bg-gray-800 text-white p-4 flex justify-between items-center min-h-[7.5vh] sm:min-h-[10vh] z-50">
      {/* LOGO */}
      <div className="logo opacity-75">
        <Link href="/">Food Express</Link>
      </div>

      {/* Desktop menu (>650px) */}
      {!isMobile && (
        <ul 
          className="flex space-x-6 text-sm"
        >
          {renderMenuItems()}
        </ul>
      )}
      
      {/* Mobile Menu Button (<=650px) */}
      {(isMobile && !open) ? (
        <button
          onClick={()=> {
            setOpen((prev) => !prev);
          }}
          className="text-white-100 text-2xl opacity-75"
        >
          ☰
        </button>
      ): isMobile && (
        <button
          onClick={()=> {
            setOpen((prev) => !prev);
          }}
          className="text-end text-white-500 text-xl"
        >
          X
        </button>        
      )}

      {isMobile && open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Mobile Slider */}
      {isMobile && (
        <ul
          className={`
            absolute top-full right-0 
            w-[60vw] h-screen 
            bg-gray-800 
            px-4 py-4 
            transform
            transition-transform 
            duration-[900ms]
            ease-in-out 
            ${open ? "translate-x-0" : "translate-x-full"} z-100
          `}
        >
          {renderMenuItems()}
        </ul>
      )}

    </nav>
  );
};

export default NavbarComponent;