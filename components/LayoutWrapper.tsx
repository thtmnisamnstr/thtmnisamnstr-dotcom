import { useState } from 'react'
import { MAIN_CONTENT_MIN_HEIGHT } from '~/constant'
import { Footer } from './Footer'
import { Header } from './Header'
import { MobileNav } from './MobileNav'

export function LayoutWrapper({ children }) {
  let [navShow, setNavShow] = useState(false)
  let onToggleNav = () => setNavShow((status) => !status)

  return (
    <div className="vscode-workbench">
      <MobileNav navShow={navShow} onToggleNav={onToggleNav} />
      <Header onToggleNav={onToggleNav} />
      <div className="vscode-editor-shell max-w-3xl mx-auto xl:max-w-5xl">
        <div className="flex flex-col justify-between">
          <main
            className="vscode-editor-content px-3 sm:px-6"
            style={{ minHeight: MAIN_CONTENT_MIN_HEIGHT }}
          >
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  )
}
