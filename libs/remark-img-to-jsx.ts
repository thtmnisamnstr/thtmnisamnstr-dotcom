import fs from 'fs'
import path from 'path'
import { imageSize } from 'image-size'
import { visit } from 'unist-util-visit'
import type { UnistImageNode, UnistNodeType, UnistTreeType } from '~/types'

export function remarkImgToJsx() {
  return (tree: UnistTreeType) => {
    return visit(tree as any, 'paragraph', (node: UnistNodeType) => {
      // Only convert paragraphs that contain exactly one image node.
      // This avoids dropping adjacent text/captions from mixed-content paragraphs.
      if (node.children.length !== 1 || node.children[0].type !== 'image') return
      let imageNode = node.children[0] as UnistImageNode

      // Convert original `image` to `next/image` for local files only
      let imageLocalPath = path.join(process.cwd(), 'public', imageNode.url.replace(/^\/+/, ''))
      if (fs.existsSync(imageLocalPath)) {
        let dimensions = imageSize(fs.readFileSync(imageLocalPath))
        ;(imageNode as any).type = 'mdxJsxFlowElement'
        imageNode.name = 'Image'
        imageNode.attributes = [
          { type: 'mdxJsxAttribute', name: 'alt', value: imageNode.alt },
          { type: 'mdxJsxAttribute', name: 'src', value: imageNode.url },
          { type: 'mdxJsxAttribute', name: 'width', value: dimensions.width },
          { type: 'mdxJsxAttribute', name: 'height', value: dimensions.height },
        ]

        // Change node type from p to div to avoid nesting error
        ;(node as any).type = 'div'
        node.children = [imageNode as any]
      }
    })
  }
}
