'use client'

interface ReadableTextProps {
  text: string
  className?: string
  paragraphClassName?: string
}

export function ReadableText({ text, className = '', paragraphClassName = '' }: ReadableTextProps) {
  const paragraphs = text.split(/\n\n+/)
  return (
    <div className={className}>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className={`mb-4 ${paragraphClassName}`}>{paragraph}</p>
      ))}
    </div>
  )
}

export default ReadableText
