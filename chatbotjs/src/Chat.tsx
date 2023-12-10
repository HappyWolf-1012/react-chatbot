import React, { useEffect, useState } from 'react';

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/KeLSEuc92jy
 */
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { siteConfig } from '@/config/site';

interface ChatbotConfig {
  id: number;
  welcomeMessage: string;
}

interface Messages {
  number: number
  message: string
  from: "user" | "bot"
}

export default function ChatBox() {
  const [config, setConfig] = useState<ChatbotConfig>()
  const [chatbotId, setChatbotId] = useState<string>()
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [messages, setMessages] = useState<Messages[]>([])
  const [newMessage, setNewMessage] = useState<string>("")

  async function onSubmit(e: any) {
    e.preventDefault();

    if (newMessage === "") {
      console.log("No message")
      return
    }

    setIsLoading(true)

    setMessages(messages => [...messages, {
      number: messages.length + 1,
      message: newMessage,
      from: "user",
    }])

    setNewMessage("")

    setNewMessage("")

    const message = await fetch(`https://dev-openassistantgpt.vercel.app/api/chat`, {
      method: "POST",
      body: JSON.stringify({
        message: newMessage,
        chatbotId: chatbotId,
      }),
    })

    const value = await message.json()
    console.log(value)

    setMessages(messages => [...messages, {
      number: messages.length + 1,
      message: value.value,
      from: "bot",
    }])

    setIsLoading(false)
  }

  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  };

  function resetChat() {
    setMessages([])

    setMessages(messages => [...messages, {
      number: messages.length + 1,
      message: config!.welcomeMessage,
      from: "bot",
    }])

  }

  useEffect(() => {
    const init = async () => {
      const id = window.chatbotConfig.chatbotId
      setChatbotId(id)

      const config = await fetch(`https://dev-openassistantgpt.vercel.app/api/chatbots/${id}/config`)
      const chatbotConfig: ChatbotConfig = await config.json()
      setConfig(chatbotConfig)

      if (messages.length === 0) {
        setMessages(messages => [...messages, {
          number: messages.length + 1,
          message: chatbotConfig?.welcomeMessage,
          from: "bot",
        }])
      }
    };
    init();
  }, [])

  return (
    <div className="fixed bottom-0 right-0 mb-4 mr-4 z-50 flex items-end">
      {isChatVisible &&
        <Card className="w-80 mr-2 max-h-[80vh] overflow-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg transform transition-transform duration-200 ease-in-out mb-4">
          <div className="flex justify-between items-center p-4">
            <h3 className="text-lg font-semibold">Chat with us</h3>
            <div>
              <Button onClick={resetChat} className='mr-2'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-5 w-5 text-gray-500 lucide lucide-list-restart"><path d="M21 6H3" /><path d="M7 12H3" /><path d="M7 18H3" /><path d="M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14" /><path d="M11 10v4h4" /></svg>
              </Button>
              <Button onClick={toggleChatVisibility} variant="ghost">
                <IconClose className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          </div>
          <div className="p-4 space-y-4">
            {
              messages.map((message) => {
                if (message.from === "bot") {
                  return (
                    <div key={message.number} className="flex items-end gap-2">
                      <div className="rounded-lg bg-zinc-200 p-2">
                        <p className="text-sm">{message.message}</p>
                      </div>
                    </div>
                  )
                } else {
                  return (
                    <div key={message.number} className="flex items-end gap-2 justify-end">
                      <div className="rounded-lg bg-blue-500 text-white p-2">
                        <p className="text-sm">{message.message}</p>
                      </div>
                    </div>
                  )
                }
              })
            }
            {
              isLoading &&
              <div className="flex justify-left items-center space-x-2">
                <div className="dot h-4 w-4 bg-zinc-200 rounded-full"></div>
                <div className="dot h-4 w-4 bg-zinc-200 rounded-full"></div>
                <div className="dot h-4 w-4 bg-zinc-200 rounded-full"></div>
              </div>
            }
          </div>
          <div className="text-center text-zinc-400 text-sm">
            Powered by {siteConfig.name}
          </div>
          <div className="border-t border-gray-200 p-4">
            <div className="space-x-2">
              <form className="w-full flex-grow border-0 flex flex-row items-justify" onSubmit={onSubmit}>
                <Input className="focus:outline-none bg-transparent border-0 mr-2"
                  value={newMessage}
                  disabled={isLoading}
                  onChange={value => setNewMessage(value.target.value)} id="chat-input" placeholder="Type your message" />
                <Button
                  className="border-0 text-gray-500 focus:outline-none"
                  type="submit"
                  disabled={isLoading}
                  variant="outline">
                  <IconSend className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </Card>
      }
      <Button className="shadow-lg border bg-white border-gray-200 rounded-full p-3"
        onClick={toggleChatVisibility} variant="ghost">
        <Icons.message />
      </Button>
    </div>
  )
}

function IconClose(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <line x1="3" x2="21" y1="9" y2="9" />
      <path d="m9 16 3-3 3 3" />
    </svg>
  )
}


function IconSend(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  )
}
