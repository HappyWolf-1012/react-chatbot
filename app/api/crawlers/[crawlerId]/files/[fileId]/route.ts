import { getServerSession } from "next-auth/next"
import { z } from "zod"
import { del } from '@vercel/blob';

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"


const routeContextSchema = z.object({
    params: z.object({
        crawlerId: z.string(),
        fileId: z.string(),
    }),
})

async function verifyCurrentUserHasAccessToCrawler(crawlerId: string) {
    const session = await getServerSession(authOptions)

    const count = await db.crawler.count({
        where: {
            userId: session?.user?.id,
            id: crawlerId,
        },
    })

    return count > 0
}

export async function DELETE(
    req: Request,
    context: z.infer<typeof routeContextSchema>
) {
    try {
        // Validate the route params.
        const { params } = routeContextSchema.parse(context)

        if (!(await verifyCurrentUserHasAccessToCrawler(params.crawlerId))) {
            return new Response(null, { status: 403 })
        }

        const crawlerFile = await db.crawlerFile.findUnique({
            where: {
                id: params.fileId
            },
            select: {
                blobUrl: true,
                OpenAIFile: {
                    select: {
                        id: true,
                        openAIFileId: true
                    }
                }
            }
        })

        if (!crawlerFile) {
            return new Response(null, { status: 404 })
        }

        // TODO: Delete OpenAI file
        //import OpenAI from "openai"
        //if (crawlerFile.OpenAIFile) {
        //    const session = await getServerSession(authOptions)
        //    const clientConfig = await db.openAIConfig.findFirst({
        //        where: {
        //            userId: session?.user?.id
        //        }
        //    })

        //    const client = new OpenAI({
        //        apiKey: clientConfig?.globalAPIKey,
        //    })

        //    console.log(crawlerFile.OpenAIFile)

        //    await client.files.del(
        //        fileId: crawlerFile.OpenAIFile.openAIFileId
        //    )
        //}


        await del(crawlerFile.blobUrl)

        await db.crawlerFile.delete({
            where: {
                id: params.fileId as string,
            },
        })

        return new Response(null, { status: 204 })
    } catch (error) {
        console.log(error)
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify(error.issues), { status: 422 })
        }

        return new Response(null, { status: 500 })
    }
}