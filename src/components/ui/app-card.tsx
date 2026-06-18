import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

export function AppCard({ 
  title, 
  description, 
  content, 
  footer, 
  className 
}: { 
  title?: React.ReactNode
  description?: React.ReactNode
  content: React.ReactNode
  footer?: React.ReactNode
  className?: string
}) {
  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>{content}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  )
}
