import { Twemoji } from '~/components'

export function ShortDescription() {
  return (
    <p className="mt-10   mb-8">
      <span className="flex items-center mt-4 mb-4">
        Director of Product & Marketing at Earthly. Ex-PMM at a Segment, Yugabyte, RudderStack, New
        Relic, and AT&T &nbsp;&nbsp; <Twemoji className="twa-2x" emoji="chart-increasing" size="" />
      </span>
      <span className="flex items-center mt-4 mb-4">
        Ex-tech consultant at Deloitte &nbsp;&nbsp;{' '}
        <Twemoji className="twa-2x" emoji="necktie" size="" />
      </span>
      <span className="flex items-center mt-4 mb-4">
        Ex-sys admin &nbsp;&nbsp; <Twemoji className="twa-2x" emoji="pager" size="" />
      </span>
      <span className="flex items-center mt-4 mb-4">
        (Sometimes)Ex-developer &nbsp;&nbsp; <Twemoji className="twa-2x" emoji="laptop" size="" />
      </span>
      <span className="flex items-center mt-4 mb-4">
        Brazilian Jiu Jitsu black belt &nbsp;&nbsp;{' '}
        <Twemoji className="twa-2x" emoji="martial-arts-uniform" size="" /> &nbsp;&nbsp;{' '}
        <Twemoji className="twa-2x" emoji="people-wrestling" size="" />
      </span>
    </p>
  )
}
