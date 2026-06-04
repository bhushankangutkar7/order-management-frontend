// app/[slug]/page.jsx
'use client';
import { usePathname } from 'next/navigation';
import Home from '../../pages/public/Home.jsx';
import About from '../../pages/public/About.jsx';
import Contact from '../../pages/public/Contact.jsx';
import Login from '../../pages/public/Login.jsx';
import Signup from '../../pages/public/Signup.jsx';
import Menu from '../../pages/protected/Menu.jsx';
import Order from '../../pages/protected/Order.jsx';
import Cart from '../../pages/protected/Cart.jsx';
import Profile from '../../pages/protected/Profile.jsx';


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
    case '/menu':
      return <Menu/>;
    case '/orders':
      return <Order />;
    case '/cart':
      return <Cart />;
    case '/profile':
      return <Profile />;
    default:
      return <Home />;
  }

}