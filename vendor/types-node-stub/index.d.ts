declare module 'fs' {
  const fs: any
  export = fs
}

declare module 'path' {
  const path: any
  export = path
}

declare module 'process' {
  const processModule: any
  export = processModule
}

declare var process: any

declare var Buffer: any

declare function require(path: string): any
