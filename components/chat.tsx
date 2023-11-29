'use client'
/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/LOyl5Wee15h
 */

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Chatbot, User } from "@prisma/client"
import * as z from "zod"

import { Icons } from "./icons"
import { zodResolver } from "@hookform/resolvers/zod"
import { messageSchema } from "@/lib/validations/message"
import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"

interface ChatbotProps {
  chatbot: Pick<Chatbot, "id" | "name" | "createdAt" | "modelId" | "welcomeMessage">
}

type FormData = z.infer<typeof messageSchema>

interface Messages {
  number: number
  message: string
  from: "user" | "bot"
}

export function Chat({ chatbot, ...props }: ChatbotProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(messageSchema),
  })
  const [messages, setMessages] = useState<Messages[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function onSubmit(data: FormData, e: any) {
    try {
      setIsLoading(true)

      setMessages(messages => [...messages, {
        number: messages.length + 1,
        message: data.message,
        from: "user",
      }])

      e.target.reset()

      const response = await fetch(`/api/chatbots/${chatbot.id}/chat`, {
        method: "POST",
        body: JSON.stringify(data),
      })

      const botResponse = await response.json();

      setMessages(messages => [...messages, {
        number: messages.length + 1,
        message: botResponse.value,
        from: "bot",
      }])

    } catch (error) {
      console.error(error)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    setMessages(
      [
        {
          number: 0,
          message: chatbot.welcomeMessage,
          from: "bot",
        }
      ]
    )
  }, [])

  return (
    <Card className="flex border flex-col w-full overflow-hidden">
      <CardHeader className="border-b p-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Avatar className="relative overflow-visible w-10 h-10">
            <span className="absolute right-0 top-0 flex h-3 w-3 rounded-full bg-green-600" />
            <AvatarImage alt="User Avatar" src="https://identicons.pgmichael.com/" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            {chatbot.name}
            <span className="text-xs text-green-600 block">Online</span>
          </div>
        </h2>
      </CardHeader>
      <CardContent className="border-b overflow-auto p-4">
        <div className="space-y-4">
          {
            messages.map((message) => {
              if (message.from === "bot") {
                return (
                  <div key={message.number} className="flex items-end gap-2">
                    <div className="rounded-lg bg-zinc-200 dark:bg-zinc-700 p-2">
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
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <div
          className='w-full flex items-center gap-2'
        >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex align-right gap-2 w-full"
              {...props}
            >
              <div className="flex flex-grow">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Input
                        onChange={field.onChange}
                        className="w-full"
                        id="message"
                        placeholder="Type a message..." />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit"
                disabled={isLoading}
                className="flex-none w-1/3"
              >
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Send
              </Button>
            </form>
          </Form>
        </div>
      </CardFooter>
    </Card>
  )
}
