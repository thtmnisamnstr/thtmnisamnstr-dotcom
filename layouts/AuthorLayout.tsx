import React from 'react'
import { PageSeo, ProfileCard } from '~/components'
import { siteMetadata } from '~/data'
import type { AuthorLayoutProps } from '~/types'
import Image from 'next/image'

export function AuthorLayout({ children }: AuthorLayoutProps) {
  let title = 'About me'
  let description = 'About page for thtmnisamnstr.com - Gavin Johnson'

  return (
    <>
      <PageSeo title={`${title} - ${siteMetadata.title}`} description={`${description}`} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="pt-6 pb-8 space-y-2 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {title}
          </h1>
        </div>
        <div className="items-start space-y-2 xl:grid xl:grid-cols-1 xl:space-y-0 pt-8">
          <div className="flex px-3 xl:px-6 py-2">
            <Image
              src={'/static/images/gavin-johnson.png'}
              alt="avatar"
              width={220}
              height={220}
              className="rounded-full mx-auto"
            />
          </div>
          <div className="pb-8 xl:pl-8 prose prose-lg dark:prose-dark max-w-none xl:col-span-1">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

export default AuthorLayout
