import React, {
  FC,
  ReactElement,
  ComponentProps,
  useEffect,
  useRef,
} from 'react'
import { ElementProps } from '../../utils/element-props'
import { useControllableValue } from 'ahooks'
import List from '../list'
import { RightOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import { useInitialized } from '../../utils/use-initialized'
import { useSpring, animated } from '@react-spring/web'

export type CollapsePanelProps = {
  key: string
  title: string
  disabled?: boolean
  forceRender?: boolean
}

export const CollapsePanel: FC<CollapsePanelProps> = () => {
  return null
}

const CollapsePanelContent: FC<{
  visible: boolean
  forceRender: boolean
}> = props => {
  const { visible } = props
  const innerRef = useRef<HTMLDivElement>(null)
  const initialized = useInitialized(visible || props.forceRender)
  const [style, api] = useSpring(() => ({
    from: { height: visible ? 'auto' : 0 },
  }))

  useEffect(() => {
    if (visible) {
      const inner = innerRef.current
      if (!inner) return
      api.start({
        height: inner.offsetHeight,
      })
    } else {
      api.start({
        height: 0,
      })
    }
  }, [visible])

  return initialized ? (
    <animated.div className='am-collapse-panel-content' style={style}>
      <div className='am-collapse-panel-content-inner' ref={innerRef}>
        <List.Item>{props.children}</List.Item>
      </div>
    </animated.div>
  ) : null
}

type ValueProps<T> = {
  activeKey?: T
  defaultActiveKey?: T
  onChange?: (activeKey: T) => void
}

export type CollapseProps = (
  | ({
      accordion?: false
    } & ValueProps<string[]>)
  | ({
      accordion: true
    } & ValueProps<string | null>)
) &
  ElementProps

export const Collapse: FC<CollapseProps> = props => {
  const panels: ReactElement<ComponentProps<typeof CollapsePanel>>[] = []
  React.Children.forEach(props.children, child => {
    if (!React.isValidElement(child)) return
    const key = child.key
    if (typeof key !== 'string') return
    panels.push(child)
  })

  const [activeKey, setActiveKey] = useControllableValue<
    string | null | string[]
  >(props, {
    valuePropName: 'activeKey',
    defaultValuePropName: 'defaultActiveKey',
    defaultValue: [],
    trigger: 'onChange',
  })
  const activeKeyList =
    activeKey === null ? [] : Array.isArray(activeKey) ? activeKey : [activeKey]

  return (
    <div
      className={classNames('am-collapse', props.className)}
      style={props.style}
    >
      <List>
        {panels.map(panel => {
          const key = panel.key as string
          const active = activeKeyList.includes(key)
          function handleClick() {
            if (props.accordion) {
              if (active) {
                setActiveKey(null)
              } else {
                setActiveKey(key)
              }
            } else {
              if (active) {
                setActiveKey(activeKeyList.filter(v => v !== key))
              } else {
                setActiveKey([...activeKeyList, key])
              }
            }
          }

          return (
            <React.Fragment key={key}>
              <List.Item
                className={classNames('am-collapse-panel-header', {
                  'am-collapse-panel-header-disabled': panel.props.disabled,
                })}
                onClick={panel.props.disabled ? undefined : handleClick}
                arrow={
                  <div
                    className={classNames('am-collapse-arrow', {
                      'am-collapse-arrow-active': active,
                    })}
                  >
                    <RightOutlined />
                  </div>
                }
              >
                {panel.props.title}
              </List.Item>
              <CollapsePanelContent
                visible={active}
                forceRender={!!panel.props.forceRender}
              >
                {panel.props.children}
              </CollapsePanelContent>
            </React.Fragment>
          )
        })}
      </List>
    </div>
  )
}