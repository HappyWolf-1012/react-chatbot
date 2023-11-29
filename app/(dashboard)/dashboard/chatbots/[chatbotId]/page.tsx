import { notFound, redirect } from "next/navigation"
import { Chatbot, User } from "@prisma/client"

import { ChatbotForm } from "@/components/chatbot-form"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { MoveToCrawlersButton } from "@/components/move-to-crawlers-button"

interface ChatbotSettingsProps {
    params: { chatbotId: string }
}

async function getChatbotForUser(chatbotId: Chatbot["id"], userId: User["id"]) {
    return await db.chatbot.findFirst({
        select: {
            id: true,
            name: true,
            createdAt: true,
            openaiKey: true,
            welcomeMessage: true,
            prompt: true,
            model: {
                select: {
                    id: true,
                    name: true,
                }
            },
            ChatbotFiles: {
                select: {
                    id: true,
                    crawlerFile: {
                        select: {
                            id: true,
                            OpenAIFile: {
                                select: {
                                    id: true,
                                    openAIFileId: true,
                                }
                            }
                        }
                    }
                }
            },
            ChatbotUploadFiles: {
                select: {
                    id: true,
                    uploadFile: {
                        select: {
                            id: true,
                            OpenAIFile: {
                                select: {
                                    id: true,
                                    openAIFileId: true,
                                }
                            }
                        }
                    }
                }
            },
        },
        where: {
            id: chatbotId,
            userId: userId,
        },
    })
}


export default async function ChatbotPage({ params }: ChatbotSettingsProps) {

    const user = await getCurrentUser()

    if (!user) {
        redirect(authOptions?.pages?.signIn || "/login")
    }

    const chatbot = await getChatbotForUser(params.chatbotId, user.id)

    if (!chatbot) {
        notFound()
    }

    const crawlers = await db.crawler.findMany({
        where: {
            userId: user.id,
        },
    })

    const files = []

    for (const crawler of crawlers) {
        const crawlerFiles = await db.crawlerFile.findMany({
            where: {
                crawlerId: crawler.id,
            },
        })
        files.push(...crawlerFiles)
    }

    const openAIFiles = await db.openAIFile.findMany({
        select: {
            id: true,
            openAIFileId: true,
        },
        where: {
            fileId: {
                in: files.map((file) => file.id),
            }
        },
    })

    const uploadFiles = await db.uploadFile.findMany({
        select: {
            id: true,
            userId: true,
            OpenAIFile: {
                select: {
                    id: true,
                    openAIFileId: true,
                }
            }
        },
        where: {
            userId: user.id,
            OpenAIFile: {
                some: {}
            }
        },
    })
    const allFiles = [...openAIFiles, ...uploadFiles.map((file) => file.OpenAIFile)]

    return (
        <DashboardShell>
            <DashboardHeader heading="Chatbot" text="Configure your chatbot here">
                <Link
                    href="/dashboard/chatbots"
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "md:left-8 md:top-8"
                    )}
                >
                    <>
                        <Icons.chevronLeft className="mr-2 h-4 w-4" />
                        Back
                    </>
                </Link>
            </DashboardHeader>
            <div className="grid gap-10">
                <ChatbotForm
                    chatbotFileId={
                        chatbot.ChatbotFiles[0] ? chatbot.ChatbotFiles[0].crawlerFile.OpenAIFile.id : chatbot.ChatbotUploadFiles[0].uploadFile.OpenAIFile.id
                    }
                    publishedFiles={allFiles.flat()}
                    chatbot={{
                        id: chatbot.id,
                        name: chatbot.name,
                        createdAt: chatbot.createdAt,
                        openaiKey: chatbot.openaiKey,
                        modelId: chatbot.model.id,
                        welcomeMessage: chatbot.welcomeMessage,
                        prompt: chatbot.prompt,
                    }} />
            </div>

            {files?.length ?
                <>
                    <div className="">
                        <div>
                            <p className="text-muted-foreground">
                                Here&apos;s all of your files
                            </p>
                            <div>
                                {openAIFiles.map((file) => (
                                    <div key={file.id}>
                                        <p>{file.openAIFileId}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>

                : <div className="grid gap-10">
                    <EmptyPlaceholder>
                        <EmptyPlaceholder.Icon name="laptop" />
                        <EmptyPlaceholder.Title>Start crawling now to import files</EmptyPlaceholder.Title>
                        <EmptyPlaceholder.Description>
                            You don&apos;t have any files yet. Start crawling.
                        </EmptyPlaceholder.Description>
                        <MoveToCrawlersButton />
                    </EmptyPlaceholder>
                </div>

            }
        </DashboardShell>
    )
}