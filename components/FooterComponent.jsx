'use client';
import React from 'react';

const FooterComponent = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer  
      className="text-center bg-[#001529] text-[rgba(255,255,255,0.75)] min-h-[7.5vh] pt-5 flex justify-center align-center"
    >
      Foodexpress ©{currentYear} Created by Foodexpress
    </footer>
  );
};

export default FooterComponent;