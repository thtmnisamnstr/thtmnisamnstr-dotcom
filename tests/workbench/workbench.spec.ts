import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { requiredWorkbenchTokens, themes } from '../../constant/themes'
const article = '/blog/20240604-earthly-cloud-ui-updates'

for (const width of [390, 1440]) {
  test(`title bar orders logo, search and theme at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const brand = page.getByRole('link', { name: 'thtmnisamnstr.com home' })
    const logo = brand.locator('.vscode-titlebar-logo')
    await expect(brand).toBeVisible()
    await expect(page.getByRole('combobox', { name: 'Select VS Code theme' })).toBeVisible()
    const bounds = await logo.boundingBox()
    const search = await page.locator('.vscode-command-center').boundingBox()
    const theme = await page.locator('.vscode-titlebar-actions').boundingBox()
    expect(bounds!.height).toBeLessThanOrEqual(24)
    expect(bounds!.width).toBeGreaterThan(0)
    expect(bounds!.x).toBeLessThan(width < 768 ? 45 : 20)
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(search!.x)
    expect(search!.x + search!.width).toBeLessThanOrEqual(theme!.x)
    expect(theme!.x + theme!.width).toBeGreaterThan(width - 20)
    if (width < 768) {
      const menu = await page
        .getByRole('button', { name: 'Open Explorer', exact: true })
        .boundingBox()
      expect(menu!.x + menu!.width).toBeLessThanOrEqual(bounds!.x)
    }
    const chromeOrder = await page
      .locator('.vscode-titlebar')
      .evaluate((el) => Array.from(el.children).map((child) => child.className))
    expect(chromeOrder).toEqual([
      'vscode-titlebar-menu',
      'vscode-titlebar-brand',
      'vscode-command-center',
      'vscode-titlebar-actions',
    ])
    expect(await logo.evaluate((el) => getComputedStyle(el).maskImage)).toContain(
      width < 768 ? 'logo_mobile.svg' : 'logo_desktop.svg'
    )
  })
}

test('Explorer groups tags and the current article under blog on desktop and mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(article)
  const explorer = page.locator('#desktop-explorer')
  const folder = explorer.locator('.vscode-explorer-folder')
  await expect(folder.getByRole('link', { name: 'tags/index.md', exact: true })).toHaveAttribute(
    'href',
    '/tags'
  )
  await expect(folder.getByRole('link', { name: 'index.md', exact: true })).toHaveAttribute(
    'href',
    '/blog'
  )
  await expect(folder.locator('a[aria-current="page"]')).toHaveAttribute('href', article)
  await folder.locator('summary').click()
  await expect(folder.getByRole('link', { name: 'tags/index.md', exact: true })).not.toBeVisible()
  await explorer.getByRole('link', { name: 'about.md', exact: true }).click()
  await expect(page).toHaveURL(/\/about$/)
  await page
    .getByRole('navigation', { name: 'Open documents' })
    .locator(`a[href="${article}"]`)
    .click()
  await expect(page).toHaveURL(new RegExp(`${article}$`))
  await expect(folder.locator('a[aria-current="page"]')).toBeVisible()
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole('button', { name: 'Open Explorer', exact: true }).click()
  const drawerFolder = page
    .getByRole('dialog', { name: 'Explorer', exact: true })
    .locator('.vscode-explorer-folder')
  await expect(drawerFolder.locator('a[aria-current="page"]')).toHaveAttribute('href', article)
  await expect(drawerFolder.getByRole('link', { name: 'tags/index.md', exact: true })).toBeVisible()
})

test('mobile displays multiple tabs when they fit, including after reload', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.addInitScript(() =>
    sessionStorage.setItem('workbench-open-documents', JSON.stringify(['/', '/about', '/resume']))
  )
  await page.goto('/resume')
  const tabs = page.getByRole('navigation', { name: 'Open documents' })
  for (const href of ['/', '/about', '/resume']) {
    const link = tabs.locator(`a[href="${href}"]`)
    await expect(link).toBeVisible()
    const bounds = await link.boundingBox()
    expect(bounds!.x).toBeGreaterThanOrEqual(0)
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390)
  }
  await page.reload()
  await expect(tabs.getByRole('link', { name: 'about.md', exact: true })).toBeVisible()
  expect(await tabs.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true)
})

test('mobile tab overflow keeps the restored active document visible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.addInitScript(
    (path) =>
      sessionStorage.setItem(
        'workbench-open-documents',
        JSON.stringify([
          '/',
          '/about',
          '/resume',
          '/blog',
          '/tags',
          '/blog/page/2',
          '/tags/product-launch',
          path,
        ])
      ),
    article
  )
  await page.goto(article)
  const tabs = page.getByRole('navigation', { name: 'Open documents' })
  await expect.poll(() => tabs.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true)
  await expect
    .poll(async () => {
      const active = await tabs.locator('.is-active').boundingBox()
      return !!active && active.x >= -1 && active.x + active.width <= 391
    })
    .toBe(true)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('Explorer resizing supports pointer cancellation, keyboard bounds and persisted width', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const explorer = page.locator('#desktop-explorer')
  const sash = page.getByRole('separator', { name: 'Resize Explorer' })
  await expect(sash).toHaveAttribute('aria-valuenow', '288')
  const drag = async (distance: number) => {
    const bounds = await sash.boundingBox()
    await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + 120)
    await page.mouse.down()
    await page.mouse.move(bounds!.x + bounds!.width / 2 + distance, bounds!.y + 120, { steps: 5 })
  }
  await drag(50)
  await expect(explorer).toHaveCSS('width', '338px')
  await page.keyboard.press('Escape')
  await page.mouse.up()
  await expect(explorer).toHaveCSS('width', '288px')
  await expect(page.locator('body')).not.toHaveCSS('cursor', 'col-resize')
  await drag(50)
  await page.mouse.up()
  await expect(sash).toHaveAttribute('aria-valuenow', '338')
  await page.reload()
  await expect(explorer).toHaveCSS('width', '338px')
  await sash.focus()
  await page.keyboard.press('End')
  await expect(explorer).toHaveCSS('width', '420px')
  await page.keyboard.press('ArrowRight')
  await expect(explorer).toHaveCSS('width', '420px')
  await page.keyboard.press('Home')
  await expect(explorer).toHaveCSS('width', '170px')
  await page.keyboard.press('ArrowLeft')
  await expect(explorer).toHaveCSS('width', '170px')
  await page.keyboard.press('Shift+ArrowRight')
  await expect(explorer).toHaveCSS('width', '171px')
  await page.keyboard.press('ArrowRight')
  await expect(explorer).toHaveCSS('width', '181px')
  await page.getByRole('button', { name: 'Widen Explorer', exact: true }).click()
  await expect(explorer).toHaveCSS('width', '191px')
  await page.getByRole('button', { name: 'Narrow Explorer', exact: true }).click()
  await expect(explorer).toHaveCSS('width', '181px')
  await page.getByRole('button', { name: 'Reset Explorer width', exact: true }).click()
  await expect(explorer).toHaveCSS('width', '288px')
  await page.reload()
  await expect(explorer).toHaveCSS('width', '288px')
  await page.setViewportSize({ width: 768, height: 1024 })
  await expect(sash).not.toBeVisible()
})

test('document tabs reorder by keyboard and drag without navigating, and survive reload', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  for (const route of ['/blog', '/about', '/resume']) {
    await page.locator('#desktop-explorer').locator(`a[href="${route}"]`).click()
    await expect(page).toHaveURL(new RegExp(`${route}$`))
  }
  const tabs = page.getByRole('navigation', { name: 'Open documents' })
  const order = () =>
    tabs.getByRole('link').evaluateAll((links) => links.map((el) => el.getAttribute('href')))
  await expect.poll(order).toEqual(['/', '/blog', '/about', '/resume'])
  const resume = tabs.getByRole('link', { name: 'resume.md', exact: true })
  await resume.focus()
  await page.keyboard.press('Alt+Shift+ArrowLeft')
  await expect.poll(order).toEqual(['/', '/blog', '/resume', '/about'])
  await expect(resume).toBeFocused()
  await expect(page).toHaveURL(/\/resume$/)
  await page.reload()
  await expect.poll(order).toEqual(['/', '/blog', '/resume', '/about'])
  const source = tabs.locator('.vscode-editor-tab:has(a[href="/about"])')
  const target = tabs.locator('.vscode-editor-tab:has(a[href="/blog"])')
  await source.dragTo(target, { targetPosition: { x: 8, y: 15 } })
  await expect.poll(order).toEqual(['/', '/about', '/blog', '/resume'])
  await expect(page).toHaveURL(/\/resume$/)
  await expect(tabs.locator('.vscode-editor-tab').first()).toHaveAttribute('draggable', 'false')
  await page.reload()
  await expect.poll(order).toEqual(['/', '/about', '/blog', '/resume'])
})

for (const width of [390, 640, 768, 1024, 1280, 1440, 1536]) {
  test(`workbench geometry and navigation at ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 900 })
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    for (const route of ['/', article, '/resume']) {
      const response = await page.goto(route)
      expect(response?.status()).toBe(200)
      await expect(page.locator('main h1')).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true
      )
      await expect(page.locator('.vscode-titlebar')).toHaveCSS('height', '35px')
      await expect(page.locator('.vscode-statusbar')).toHaveCSS('height', '22px')
      if (width >= 1024) {
        await expect(page.locator('.vscode-activitybar')).toHaveCSS('width', '48px')
        const editor = await page.locator('.vscode-editor-region').boundingBox()
        expect(editor!.width / width).toBeGreaterThan(0.72)
      }
      if (width === 390 || width === 1440)
        await page.screenshot({
          path: info.outputPath(
            `${route === '/' ? 'home' : route === article ? 'post' : 'resume'}-${width}.png`
          ),
        })
    }
    expect(errors).toEqual([])
  })
}

for (const width of [390, 768]) {
  test(`Explorer modal keyboard and dismissal at ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 844 })
    await page.goto(article)
    const trigger = page.getByRole('button', {
      name: width < 768 ? 'Open Explorer' : 'Toggle Explorer',
      exact: true,
    })
    await trigger.click()
    const dialog = page.getByRole('dialog', { name: 'Explorer', exact: true })
    await expect(dialog).toBeVisible()
    await expect(dialog.locator('summary').first()).toBeVisible()
    for (let i = 0; i < 35; i++) {
      await page.keyboard.press('Tab')
      expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true)
    }
    for (let i = 0; i < 35; i++) {
      await page.keyboard.press('Shift+Tab')
      expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true)
    }
    await page.screenshot({ path: info.outputPath(`drawer-${width}.png`) })
    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible()
    await expect(trigger).toBeFocused()
    await trigger.click()
    await dialog.getByRole('button', { name: 'Close Explorer' }).click()
    await expect(trigger).toBeFocused()
    await trigger.click()
    await page.mouse.click(width - 2, 420)
    await expect(dialog).not.toBeVisible()
    await expect(trigger).toBeFocused()
    await trigger.click()
    await dialog.getByRole('link', { name: 'about.md', exact: true }).click()
    await expect(page).toHaveURL(/\/about$/)
    await expect(dialog).not.toBeVisible()
    await trigger.click()
    await page.setViewportSize({ width: 1440, height: 900 })
    await expect(dialog).not.toBeVisible()
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
  })
}

test('document navigation, tabs, breadcrumbs, anchors and history', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(article)
  const outline = page
    .locator('#desktop-explorer')
    .getByRole('navigation', { name: 'Page outline' })
  await outline.getByRole('link').last().click()
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(300)
  const position = await page.evaluate(() => scrollY)
  await page
    .locator('#desktop-explorer')
    .getByRole('link', { name: 'about.md', exact: true })
    .click()
  await expect(page).toHaveURL(/\/about$/)
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(100)
  await page.goBack()
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(position - 150)
  await page.goto('/blog/page/2')
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toContainText('page-2.md')
  await page.goto('/tags/product-launch/page/2')
  const crumbs = page.getByRole('navigation', { name: 'Breadcrumb' })
  await expect(crumbs.getByRole('link', { name: 'tags', exact: true })).toHaveAttribute(
    'href',
    '/tags'
  )
  await expect(crumbs.getByRole('link', { name: 'product-launch', exact: true })).toHaveAttribute(
    'href',
    '/tags/product-launch'
  )
  await expect(crumbs).not.toContainText('Blog')
  await page
    .locator('#desktop-explorer')
    .getByRole('link', { name: 'resume.md', exact: true })
    .click()
  await expect(
    page
      .getByRole('navigation', { name: 'Open documents' })
      .getByRole('link', { name: 'resume.md' })
  ).toHaveAttribute('aria-current', 'page')
  await page.reload()
  await page.getByRole('button', { name: 'Close resume.md', exact: true }).click()
  await expect(page).not.toHaveURL(/\/resume$/)
  await page.getByRole('button', { name: 'Toggle Explorer', exact: true }).click()
  await expect(page.locator('#desktop-explorer')).not.toBeVisible()
  await page.getByRole('button', { name: 'Toggle Explorer', exact: true }).click()
  await expect(page.locator('#desktop-explorer')).toBeVisible()
})

test('skip link and Quick Open keyboard navigation', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to editor content' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('#editor-content')).toBeFocused()
  await page.keyboard.press('Control+k')
  const dialog = page.getByRole('dialog', { name: 'Quick Open' })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByLabel('Open a document')).toBeFocused()
  await page.keyboard.type('resume')
  await page.keyboard.press('ArrowDown')
  await expect(dialog.getByRole('link', { name: 'resume.md' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/resume$/)
  await expect(dialog).not.toBeVisible()
})

for (const theme of themes) {
  test(`${theme.label}: all workbench surfaces, persistence and contrast`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await page.getByRole('combobox', { name: 'Select VS Code theme' }).selectOption(theme.id)
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme.id)
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme.id)
    const missing = await page.evaluate(
      (tokens) =>
        tokens.filter(
          (token) =>
            !getComputedStyle(document.documentElement).getPropertyValue(`--vscode-${token}`).trim()
        ),
      requiredWorkbenchTokens
    )
    expect(missing).toEqual([])
    const result = await new AxeBuilder({ page }).analyze()
    expect(result.violations).toEqual([])
  })
}

for (const scheme of ['light', 'dark'] as const) {
  test(`first paint follows ${scheme} system theme without hydration`, async ({
    browser,
    baseURL,
  }) => {
    const context = await browser.newContext({ colorScheme: scheme })
    const page = await context.newPage()
    await page.route('**/_next/static/**/*.js', (route) => route.abort())
    await page.goto(baseURL!)
    await expect(page.locator('html')).toHaveAttribute('data-theme', `vscode-${scheme}-modern`)
    await expect(page.locator('html')).toHaveCSS('color-scheme', scheme)
    await context.close()
  })
}

for (const route of ['/blog', article, '/about', '/resume']) {
  test(`accessible document ${route}`, async ({ page }) => {
    await page.goto(route)
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toEqual([])
  })
}

for (const route of ['/', '/blog', '/resume']) {
  test(`mobile document accessibility including headings and target sizes ${route}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(route)
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toEqual([])
  })
}

test('search action and search result, empty, failure and reset states', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Search blog posts' }).click()
  await expect(page).toHaveURL(/\/blog#post-search$/)
  const input = page.getByRole('textbox', { name: 'Search posts' })
  await expect(input).toBeFocused()
  await page.getByRole('combobox', { name: 'Select VS Code theme' }).selectOption('solarized-light')
  let finishLoading: (() => void) | undefined
  await page.route('**/api/pinecone-search', async (route) => {
    const { query } = route.request().postDataJSON()
    if (query === 'loading')
      await new Promise<void>((resolve) => {
        finishLoading = resolve
      })
    await route.fulfill({
      status: query === 'error' ? 500 : 200,
      contentType: 'application/json',
      body: JSON.stringify({
        results: ['earthly', 'loading'].includes(query) ? [{ urlPath: article }] : [],
      }),
    })
  })
  await input.fill('loading')
  await expect(page.getByRole('status')).toContainText('Loading...')
  await expect.poll(() => typeof finishLoading).toBe('function')
  try {
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  } finally {
    finishLoading?.()
  }
  await expect(page.getByRole('status')).not.toBeVisible()
  await input.fill('earthly')
  await expect(
    page
      .locator('main')
      .getByRole('link', { name: 'Updates and Enhancements to the Earthly Cloud UI', exact: true })
  ).toHaveAttribute('href', article)
  await input.fill('no-such-post')
  await expect(page.getByRole('status')).toHaveText('No posts found.')
  await input.fill('error')
  await expect(page.locator('main').getByRole('alert')).toContainText(
    'Search is temporarily unavailable'
  )
  await input.fill('')
  await expect(page.getByRole('navigation', { name: 'Pagination' })).toBeVisible()
})

test('dark and high contrast article accessibility and mobile drawer accessibility', async ({
  page,
}) => {
  for (const theme of ['vscode-dark-modern', 'vscode-hc-black']) {
    for (const route of ['/blog', article, '/about', '/resume']) {
      await page.goto(route)
      await page.getByRole('combobox', { name: 'Select VS Code theme' }).selectOption(theme)
      const results = await new AxeBuilder({ page }).analyze()
      expect(results.violations).toEqual([])
    }
  }
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(article)
  await page.getByRole('button', { name: 'Open Explorer', exact: true }).click()
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})

test('storage denial and reduced motion preserve usable navigation', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: 'dark',
    reducedMotion: 'reduce',
  })
  await context.addInitScript(() => {
    for (const key of ['localStorage', 'sessionStorage'])
      Object.defineProperty(window, key, {
        get() {
          throw new DOMException('Storage disabled', 'SecurityError')
        },
      })
  })
  const page = await context.newPage()
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto(baseURL!)
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'vscode-dark-modern')
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto')
  await page.getByRole('button', { name: 'Open Explorer', exact: true }).click()
  await expect(page.getByRole('dialog', { name: 'Explorer', exact: true })).toBeVisible()
  await page.keyboard.press('Escape')
  await page.getByRole('combobox', { name: 'Select VS Code theme' }).selectOption('vscode-hc-light')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'vscode-hc-light')
  expect(errors).toEqual([])
  await context.close()
})

test('article images, lightbox and code remain usable', async ({ page, context }) => {
  await page.goto(article)
  const image = page.locator('main .cursor-zoom-in img').first()
  await image.scrollIntoViewIfNeeded()
  await expect
    .poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
    .toBe(true)
  await image.click()
  await expect(page.locator('.lightbox-overlay')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.locator('.lightbox-overlay')).not.toBeVisible()
  await expect(page.locator('html')).not.toHaveClass(/prevent-scroll/)
  await page.goto('/blog/20200727-building-a-portfolio-resume-site-with-gatsby-part-2')
  const code = page.locator('pre').first()
  await code.scrollIntoViewIfNeeded()
  await code.hover()
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.getByRole('button', { name: 'Copy code', exact: true }).first().click()
  expect((await page.evaluate(() => navigator.clipboard.readText())).length).toBeGreaterThan(10)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})
