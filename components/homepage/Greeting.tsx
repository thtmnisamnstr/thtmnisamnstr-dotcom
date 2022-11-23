export function Greeting() {
  let headingColorClass =
    'bg-gradient-to-r from-purple-600 via-blue-500 to-green-300 dark:bg-gradient-to-r dark:from-green-300 dark:via-blue-500 dark:to-purple-600'

  return (
    <div
      className={`mb-8 text-4xl leading-[60px] font-extrabold tracking-tight text-transparent bg-clip-text ${headingColorClass} md:text-7xl md:leading-[86px]`}
    >
      Hi. I'm Gavin.
    </div>
  )
}
