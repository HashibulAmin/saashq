import "@/styles/globals.css"
import ShqProvider from "@/modules/ShqProvider"
import CheckAuth from "@/modules/auth/checkAuth"
import Configs from "@/modules/auth/configs"
import { Sidebar } from "@/modules/sidebar/component/Sidebar"

import Image from "@/components/ui/image"

import RightNavbar from "../../modules/navbar/component/RightNavbar"

interface ILayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: ILayoutProps) {
  return (
    <Configs>
      <CheckAuth>
        <ShqProvider>
          <div className="relative flex h-screen flex-col">
            <section className="flex justify-between bg-white border-b border-shq ">
              <div className="flex justify-center w-[230px] h-[67px] items-center border-r border-shq">
                <Image
                  alt=""
                  src="/logo-dark.svg"
                  height={100}
                  width={100}
                  loading="lazy"
                  className="w-25"
                />
              </div>
              <RightNavbar />
            </section>
            <section className="flex flex-auto items-stretch bg-white">
              <Sidebar />
              {children}
            </section>
          </div>
        </ShqProvider>
      </CheckAuth>
    </Configs>
  )
}
