export interface IParsedNode {
  tag: string
  id: string
  classList: string[]
  nthChild: number
}

export class DOMNodePath {
  static get(node: HTMLElement) {
    return (new DOMNodePath()).getNodePath(node)
  }

  static getXpath(node: HTMLElement, shortened: boolean = false) {
    const parser = new DOMNodePath()
    const nodePath = parser.getNodePath(node)
    return parser.toXpath(nodePath, shortened)
  }

  toXpath(nodePath: IParsedNode[], shortened: boolean): String {
    let xpath = ""
    for (const element of nodePath.reverse()) {
      let tag = element.tag
      let id = element.id
      let nth = element.nthChild
      if (tag === "body") {
        break
      }
      if (shortened && id !== null && id !== "") {
        xpath = `/${tag}[@id="${id}"]` + xpath
        break
      }
      let nthStr = nth > 1 ? `[${nth}]` : ""
      xpath = "/" + tag + nthStr + xpath
    }
    return "/" + xpath
  }

  getNodePath(target: HTMLElement): IParsedNode[] {
    let node: HTMLElement | null = target
    const nodePath = []

    while (node !== document.body) {
      if (!node) {
        break
      }
      const nodeData = this.parseElement(node)
      nodePath.unshift(nodeData)
      node = node.parentElement
    }

    return nodePath
  }

  private parseElement(node: HTMLElement): IParsedNode {
    const {id, tagName, classList} = node

    return {
      id,
      tag: tagName.toLowerCase(),
      classList: [...classList],
      nthChild: this.nthChild(node),
    }
  }

  private nthChild(node: HTMLElement) {
    const parentNode = node.parentNode

    if (!parentNode) {
      return -1
    }

    let num = 1
    const children = parentNode.childNodes

    for (const child of children) {
      if (child === node) {
        return num
      }

      if (child.nodeType === 1 && child.nodeName === node.nodeName) {
        num++
      }
    }

    return -1
  }
}
