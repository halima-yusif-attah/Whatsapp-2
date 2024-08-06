'use client'

import { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export const useSidebar = () => {
    return useContext(SidebarContext);
}

export const SidebarProvider = ({ children }) => {
    const [show, setShow] = useState(true);

  const showSidebar = () => {
    setShow(!show)
  }
    return (
        <SidebarContext.Provider value={{ show, showSidebar, setShow }}>
            {children}
        </SidebarContext.Provider>
    );
}