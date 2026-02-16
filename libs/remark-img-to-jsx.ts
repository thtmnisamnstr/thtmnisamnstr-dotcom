import fs from 'fs'
import path from 'path'
import { imageSize } from 'image-size'
import { visit } from 'unist-util-visit'
import type { UnistImageNode, UnistNodeType, UnistTreeType } from '~/types'

function isIgnorableTextNode(child: UnistNodeType) {
  if (child.type === 'break') return true
  if (child.type !== 'text') return false
  let value = (child.value || '').trim()
  return value === '' || value === '\\'
}

function getOptimizedImageNode(imageNode: UnistImageNode) {
  let imageLocalPath = path.join(process.cwd(), 'public', imageNode.url.replace(/^\/+/, ''))
  if (!fs.existsSync(imageLocalPath)) return null

  let dimensions = imageSize(fs.readFileSync(imageLocalPath))

  return {
    type: 'mdxJsxFlowElement',
    name: 'Image',
    attributes: [
      { type: 'mdxJsxAttribute', name: 'alt', value: imageNode.alt },
      { type: 'mdxJsxAttribute', name: 'src', value: imageNode.url },
      { type: 'mdxJsxAttribute', name: 'width', value: dimensions.width },
      { type: 'mdxJsxAttribute', name: 'height', value: dimensions.height },
    ],
    children: [],
  } as unknown as UnistNodeType
}

export function remarkImgToJsx() {
  return (tree: UnistTreeType) => {
    return visit(tree as any, 'paragraph', (node: UnistNodeType, index: number, parent: any) => {
      if (!parent || typeof index !== 'number') return

      let replacementNodes: UnistNodeType[] = []
      let paragraphBuffer: UnistNodeType[] = []
      let didConvertAnyImage = false

      let flushParagraphBuffer = () => {
        let shouldSkip =
          paragraphBuffer.length === 0 ||
          paragraphBuffer.every((child) => isIgnorableTextNode(child))
        if (shouldSkip) {
          paragraphBuffer = []
          return
        }

        replacementNodes.push({
          ...(node as any),
          type: 'paragraph',
          children: paragraphBuffer,
        })
        paragraphBuffer = []
      }

      node.children.forEach((child) => {
        if (child.type !== 'image') {
          paragraphBuffer.push(child)
          return
        }

        let optimizedImageNode = getOptimizedImageNode(child as UnistImageNode)
        if (!optimizedImageNode) {
          paragraphBuffer.push(child)
          return
        }

        didConvertAnyImage = true
        flushParagraphBuffer()
        replacementNodes.push({
          type: 'div',
          children: [optimizedImageNode],
        } as UnistNodeType)
      })

      flushParagraphBuffer()
      if (!didConvertAnyImage) return

      parent.children.splice(index, 1, ...replacementNodes)
      return index + replacementNodes.length
    })
  }
}
