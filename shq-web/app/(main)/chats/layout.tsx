import ChatList from "@/modules/chat/component/ChatList"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chats',
  description: 'Řízení zaměstnaneckých zkušeností – chaty',
}

interface ILayoutProps {
  children: React.ReactNode
}

export default function ChatLayout({ children }: ILayoutProps) {
  return (
    <>
      <div className="flex h-full w-1/5 flex-col border-r shrink-0">
        <ChatList />
      </div>
      {children}
    </>
  )
}
