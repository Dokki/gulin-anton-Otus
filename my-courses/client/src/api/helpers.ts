export const formatter = new Intl.DateTimeFormat('ru', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

export const mapUrlSearch = (url: URL) =>
  [...url.searchParams.entries()].reduce(
    (acc, [key, value]) => ({ ...acc, [key]: value }),
    {},
  )

export const isElementInViewport = (el: Element) => {
  const rect = el.getBoundingClientRect()

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

export const scrollTo = async (hash: string) => {
  await new Promise((resolve) => setTimeout(resolve, 100))

  if (!hash || !hash.includes('comment')) return

  const el = document.getElementById(hash)

  if (el && !isElementInViewport(el)) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}
