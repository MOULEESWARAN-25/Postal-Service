"use client";

import { usePathname } from "next/navigation";
import Header from "./components/header/header";

export default function ClientHeader() {
  const pathname = usePathname();
  const routesWithHeader = ["/", "/calender","/publicInfo", "/Schemetime","/dashboard"];
  const isHeaderVisible = routesWithHeader.includes(pathname);

  return isHeaderVisible ? <Header /> : null;
}
