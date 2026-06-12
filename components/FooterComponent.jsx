'use client';
import React from 'react';

const FooterComponent = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer  
      className="navbar left-0 w-full min-w-[350px] text-center bg-gray-800 text-[rgba(255,255,255,0.75)] min-h-[7.5vh] sm:min-h-[10vh] pt-5 flex justify-center items-center"
    >
      <p className="text-[20px] [@media(max-width:600px)]:text-[16px] [@media(max-width:300px)]:text-[12px] pb-3">Foodexpress ©{currentYear} Created by Foodexpress</p>
    </footer>
  );
};

export default FooterComponent;