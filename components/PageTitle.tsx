import type { PageTitleProps } from '~/types'

export function PageTitle({ children }: PageTitleProps) {
  return <h1 className="vscode-display-title">{children}</h1>
}
