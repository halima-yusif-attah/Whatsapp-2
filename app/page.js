'use client'

import Sidebar from "@/component/Sidebar";
import { useSidebar } from "@/context/useSidebarContext";

export default function Home() {
  const { show } = useSidebar();
  console.log('show-home', show);

  return (
   <main>
   
    <Sidebar show={show}/>
   </main>
  );
}
