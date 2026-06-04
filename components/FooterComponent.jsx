'use client';
import React from 'react';

const FooterComponent = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer  
      className="text-center bg-[#001529] text-[rgba(255,255,255,0.85)] h-[64px] p-6"
    >
      Foodexpress ©{currentYear} Created by Foodexpress
    </footer>
  );
};

export default FooterComponent;