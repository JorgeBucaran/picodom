export interface VirtualNode<Data> {
  tag: string
  props?: Props
  children: VirtualNode<Props> | string
}

export interface VirtualComponent<Props> {
  (props?: Props, ...children: VirtualNode<Props> | string): VirtualNode<Props>
}

export function h<Props>(
  tag: VirtualComponent<Props> | string,
  props?: Props,
  ...children: VirtualNode<Props> | string
): VirtualNode<Props>

export function patch(
  oldNode: VirtualNode<{}> | null,
  newNode: VirtualNode<{}>,
  element: Element | null,
  parent: Element | null
): Element

export as namespace picodom
