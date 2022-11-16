import { Link, Twemoji } from '~/components'

export function BlogLinks() {
  return (
    <div className="flex flex-col space-y-1">
      <Link href="/blog" className="hover:underline">
        <Twemoji emoji="memo" />
        <span className="ml-2">My writings</span>
      </Link>
      <Link href="/about" className="hover:underline">
        <Twemoji emoji="face-with-monocle" />
        <span className="ml-2">More about me and myself</span>
      </Link>
      <Link href="/resume" className="hover:underline">
        <Twemoji emoji="briefcase" />
        <span className="ml-2">My resume</span>
      </Link>
    </div>
  )
}
