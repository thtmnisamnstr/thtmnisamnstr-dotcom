import { PageSeo } from 'components/SEO'
import { ScrollTopButton } from '~/components/ScrollTopButton'
import { siteMetadata } from '~/data'
import type { ResumeLayoutProps } from '~/types'

export function ResumeLayout({ children }: ResumeLayoutProps) {
  let title = 'Resume'
  let description = 'My working experiences and skills'

  return (
    <>
      <PageSeo title={`${title} - ${siteMetadata.title}`} description={`${description}`} />
      <ScrollTopButton />
      <div className="divide-y vscode-divide-y">
        <div className="pt-6 pb-8 space-y-2 md:space-y-5">
          <h1 className="vscode-page-title">Resume</h1>
        </div>
        <div className="items-start space-y-2 xl:space-y-0">
          <div className="vscode-body-copy pt-8 pb-8 prose prose-lg dark:prose-dark max-w-none">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

export default ResumeLayout
