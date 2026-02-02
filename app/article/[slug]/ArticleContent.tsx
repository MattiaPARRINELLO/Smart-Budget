import { marked } from 'marked'

interface ArticleContentProps {
  content: string
}

export async function ArticleContent({ content }: ArticleContentProps) {
  // Convertir le markdown en HTML avec marked
  const html = await marked(content, {
    gfm: true,
    breaks: true,
  })
  
  return (
    <div 
      className="article-content prose prose-lg max-w-none dark:prose-invert
        prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
        prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4
        prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
        prose-p:text-gray-700 dark:prose-p:text-neutral-300 prose-p:leading-relaxed prose-p:my-4
        prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
        prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
        prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
        prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
        prose-li:my-2
        prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-neutral-400
        prose-code:bg-gray-100 dark:prose-code:bg-neutral-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:text-primary-700 dark:prose-code:text-primary-300
        prose-pre:bg-gray-900 dark:prose-pre:bg-neutral-950 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:p-4
        prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-8
        prose-table:my-8"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
