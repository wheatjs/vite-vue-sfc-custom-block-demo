import { Plugin } from 'vite'
import { parse } from '@vue/compiler-sfc'
import MarkdownIt from 'markdown-it'
import { Options as MDOptions } from 'markdown-it'
import MagicString from 'magic-string'

export interface Options {
  mdOptions?: MDOptions,
  componentName?: string
}

export default function VueDocsPlugin(options: Options = {}): Plugin[] {
  const { componentName = 'Docs', mdOptions = {} } = options
  
  const md = new MarkdownIt(mdOptions)
  const cache: Record<string, string> = {}

  return [{
    name: 'vite-vue-docs-plugin:pre',
    enforce: 'pre',
    transform(code, id) {
      if (! /\.(vue)$/.test(id))
        return

      const _code = new MagicString(code)

      const { descriptor: { customBlocks } } = parse(code)
      const block = customBlocks.find((block) => block.type === 'docs' && block.lang === 'md')

      if (!block)
        return

      _code.remove(block.loc.start.offset, block.loc.end.offset)
      cache[id] = md.render(block.content).trim()

      return  _code.toString()
    }
  }, {
    name: 'vite-vue-docs-plugin:post',
    enforce: 'post',
    transform(code, id) {
      const cachedDocument = cache[id]

      if (! /\.(vue)$/.test(id) || !cachedDocument)
        return

      const _code = new MagicString(code)

      for (const match of code.matchAll(/_resolveComponent[0-9]*\("(.+?)"\)/g)) {
        if (match[1] === componentName && match.index) {
          const replacement = `_createElementVNode("div", { innerHTML: \`${cachedDocument}\` })`
          _code.overwrite(match.index, match.index + match[0].length, replacement)
        }
      }

      return _code.toString()
    }
  }]
}
