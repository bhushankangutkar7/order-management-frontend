'use client';
import { usePathname } from 'next/navigation';
import Home from '../../../pages/public/Home';
import About from '../../../pages/public/About';
import Contact from '../../../pages/public/Contact';
import Login from '../../../pages/public/Login';
import Signup from '../../../pages/public/Signup';


export default function DynamicPublicPages() {
  const pathname = usePathname();

  switch(pathname) {
    case '/about':
      return <About />;
    case '/contact':
      return <Contact />;
    case '/login':
      return <Login />;
    case '/signup':
      return <Signup />;
    default:
      return <Home />;
  }

}