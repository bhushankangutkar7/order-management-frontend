// app/[slug]/page.jsx
'use client';
import { use }  from 'react';
import Home from '../../pages-component/public/Home.jsx';
import About from '../../pages-component/public/About.jsx';
import Contact from '../../pages-component/public/Contact.jsx';
import Login from '../../pages-component/public/Login.jsx';
import Signup from '../../pages-component/public/Signup.jsx';
import Menu from '../../pages-component/protected/Menu.jsx';
import Order from '../../pages-component/protected/Order.jsx';
import Cart from '../../pages-component/protected/Cart.jsx';
import Profile from '../../pages-component/protected/Profile.jsx';


export default function DynamicPublicPages({ params }) {
   const { slug } = use(params);

  switch(slug) {
    case 'about':
      return <About />;
    case 'contact':
      return <Contact />;
    case 'login':
      return <Login />;
    case 'signup':
      return <Signup />;
    case 'menu':
      return <Menu/>;
    case 'orders':
      return <Order />;
    case 'cart':
      return <Cart />;
    case 'profile':
      return <Profile />;
    default:
      return <Home />;
  }

}