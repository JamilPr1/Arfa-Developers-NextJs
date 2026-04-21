import Parser from 'rss-parser'

const parser = new Parser()

export async function parseRss(url: string) {
  return await parser.parseURL(url)
}

