'use client';
import React, { useEffect,useState } from 'react';
import { usePathname } from 'next/navigation';
import ContentComponent from '../components/ContentComponent.jsx';
import HomePage from '../pages/public/Home.jsx';

const App = ({children}) => {
  const pathname = usePathname();

  useEffect(() => {
    setSelectedKey(pathname);
  }, [pathname]);

  const [selectedKey, setSelectedKey] = useState("");

  return (
    <ContentComponent>
      {(selectedKey === "/home" || selectedKey === "/") && <HomePage />}
    </ContentComponent>
  );
};
export default App;