'use client';
import React, { useEffect,useState } from 'react';
import { usePathname } from 'next/navigation';
import ContentComponent from '../components/ContentComponent.jsx';
import HomePage from '../pages-component/public/Home.jsx';

const App = ({children}) => {
  const pathname = usePathname();
  const [selectedKey, setSelectedKey] = useState("");

  useEffect(() => {
    setSelectedKey(pathname);
  }, [pathname]);

  return (
    <>
      {(selectedKey === "/home" || selectedKey === "/") && <HomePage />}
    </>
  );
};
export default App;