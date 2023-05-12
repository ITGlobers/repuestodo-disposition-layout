import * as React from 'react'
import { ReactChild, ReactElement, ReactNode } from 'react'
import { NoSSR } from 'vtex.render-runtime'

type Disposition = {
  order: number
  show: boolean
  value: string
  __editorItemTitle: string
}

type BlockProps = {
  blockProps: { id: string }
}
interface Props {
  children: React.ReactNode;
  disposition: Disposition[];
  ssr?: boolean;
  block: "string"
}

const DispositionLayout: any = ({
  children,
  disposition,
  block
}: Props): ReactChild[] | ReactNode => {
  if (block) {



  }
  const array = React.Children.toArray(children) as ReactChild[]

  const nestedChildren =
    array.length === 1 ? (array[0] as ReactElement).props.children : null
  const orderDispositionFix = disposition.map((e, index) => {
    e.order = index + 1
    return e
  })

  const sortedChildren = [] as ReactChild[]

  for (let i = 0; i < orderDispositionFix.length; i++) {
    const { order, show, value } = orderDispositionFix[i]
    if (!show) {
      continue
    }

    const element = array.find((e) => React.isValidElement(e) && (e.props as BlockProps).blockProps.id === value)

    const child = nestedChildren ? nestedChildren[i] : element as ReactElement

    sortedChildren[order - 1] = child
  }

  if (sortedChildren.length <= 0) {
    return children
  }

  if (nestedChildren) {
    return [
      {
        ...(array[0] as ReactElement),
        props: { children: sortedChildren },
      },
    ]
  }

  return sortedChildren
}

const Wrapper = (props: Props) => {
  if (props?.ssr ?? true) {
    return <DispositionLayout {...props} />
  }

  return (
    <NoSSR>
      <DispositionLayout {...props} />
    </NoSSR>
  )
}

Wrapper.schema = {
  title: 'admin/editor.dispositionlayout.title',
  description: 'admin/editor.dispositionlayout.description',
  type: 'object',
}

export default Wrapper
