export function Greeting() {
  let headingColorClass =
    'bg-gradient-to-r from-cyan-500 to-indigo-900 dark:bg-gradient-to-r dark:from-indigo-500 dark:to-cyan-200'

  return (
    <div
      className={`mb-8 text-4xl leading-[60px] font-extrabold tracking-tight text-transparent bg-clip-text ${headingColorClass} md:text-7xl md:leading-[86px]`}
    >
      Hi. I'm Gavin.
    </div>
  )
}
