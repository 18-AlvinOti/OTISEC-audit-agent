/** Public production origin. Used for canonical URLs, Open Graph tags, robots.txt and sitemap.xml. */
export const SITE_URL = 'https://www.otisec.live'

export const absoluteUrl = (path = '/') => new URL(path, SITE_URL).toString()
