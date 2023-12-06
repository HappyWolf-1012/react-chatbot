/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/ZCJCHToo2gG
 */
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"

interface CodeBlockProps {
  children?: React.ReactNode
  language?: string
  description?: string
}

export function CodeBlock({
  children,
  language,
  description
}: CodeBlockProps) {
  return (
    <Card className="flex border flex-col w-full overflow-hidden">
      <CardHeader className="flex flex-row items-start">
        <div className="space-y-1.5">
          <CardTitle>{language}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="border-t pt-4">
        <div className="px-6 py-4 bg-gray-800 text-white rounded-md">
          <pre>
            <code>
              {children}
            </code>
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}
