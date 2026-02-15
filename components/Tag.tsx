import Link from 'next/link'
import { kebabCase } from '~/utils'

export function Tag({ text }: { text: string }) {
  return (
    <Link
      href={`/tags/${kebabCase(text)}`}
      className="vscode-tag-link mr-3 text-sm md:text-base font-medium"
    >
      #{text.split(' ').join('-')}
    </Link>
  )
}
