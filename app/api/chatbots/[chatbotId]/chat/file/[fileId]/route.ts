import { db } from "@/lib/db";
import { OpenAI } from "openai";
import { z } from "zod";


const routeContextSchema = z.object({
    params: z.object({
        chatbotId: z.string(),
        fileId: z.string(),
    }),
})

export async function GET(
    request: Request,
    context: z.infer<typeof routeContextSchema>
) {

    const { params } = routeContextSchema.parse(context)

    const chatbotId = params.chatbotId
    const openaiKey = await db.chatbot.findUnique({
        select: {
            openaiKey: true,
        },
        where: {
            id: chatbotId,
        },
    })

    if (!openaiKey) {
        return new Response("Can't find chatbot.", { status: 404 })
    }

    const openai = new OpenAI({
        apiKey: openaiKey.openaiKey,
    });

    const [file, fileContent] = await Promise.all([
        openai.files.retrieve(params.fileId),
        openai.files.content(params.fileId),
    ]);

    return new Response(fileContent.body, {
        headers: {
            "Content-Disposition": `attachment; filename="${file.filename}"`,
        },
    });
}