import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

const EMPTY_ARRAY = []
const joinPopoverMenuClasses = (...classes) => classes.filter(Boolean).join(' ')

export default function PopoverMenu({
  label,
  icon,
  items = EMPTY_ARRAY,
  children = null,
  className = '',
  triggerClassName = '',
  panelClassName = '',
  align = 'end',
  disabled = false,
  ariaLabel = '',
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const containerClasses = joinPopoverMenuClasses('relative inline-flex z-[90]', className)
  const panelPositionClasses = align === 'start' ? 'left-0 right-auto' : 'right-0'
  const panelClasses = joinPopoverMenuClasses(
    `absolute top-[calc(100%+0.45rem)] ${panelPositionClasses} z-[90] grid max-h-[70vh] min-w-[15rem] gap-[0.45rem] overflow-auto overscroll-contain rounded-[14px] border border-slate-400/22 bg-white/98 p-[0.45rem] shadow-[0_18px_40px_rgba(15,23,42,0.14)]`,
    panelClassName,
  )
  const close = () => setOpen(false)
  let customContent = null

  if (typeof children === 'function') {
    customContent = <div className="grid gap-[0.35rem]">{children({ close })}</div>
  } else if (children) {
    customContent = <div className="grid gap-[0.35rem]">{children}</div>
  }

  useEffect(() => {
    function onDoc(e) {
      if (!ref.current) return
      if (!ref.current.contains(e.target)) {
        setOpen(false)
      }
    }

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('click', onDoc)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('click', onDoc)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <div className={containerClasses} ref={ref} data-align={align}>
      <button
        type="button"
        className={joinPopoverMenuClasses(
          'inline-flex items-center justify-center rounded-[0.7rem] border border-slate-400/28 bg-white/88 text-[0.72rem] font-bold leading-none text-slate-900 shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20',
          !triggerClassName && 'h-[28px] min-h-[28px] px-[0.6rem]',
          label ? 'gap-1' : 'gap-0',
          triggerClassName,
          open && 'border-blue-400/50 ring-2 ring-blue-500/20',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={ariaLabel || label}
        disabled={disabled}
      >
        {icon && <span className={joinPopoverMenuClasses('flex items-center', label ? 'mr-1.5' : 'mr-0')}>{icon}</span>}
        {label && <span>{label}</span>}
      </button>
      {open ? (
        <div className={panelClasses} role="menu">
          {customContent}
          {items.map((it) => (
            <button
              key={it.key || String(it.label)}
              type="button"
              className={joinPopoverMenuClasses(
                'grid w-full gap-[0.12rem] rounded-[10px] border border-transparent bg-transparent p-[0.4rem_0.55rem] text-left cursor-pointer transition-colors hover:bg-slate-50',
                it.active && 'border-blue-100 bg-blue-50 text-blue-700',
                it.tone === 'danger' && 'hover:bg-red-50 hover:text-red-700',
                it.disabled && 'opacity-50 cursor-not-allowed',
              )}
              role="menuitem"
              disabled={it.disabled}
              onClick={() => {
                setOpen(false)
                if (typeof it.onClick === 'function') {
                  it.onClick()
                }
              }}
            >
              <span className="text-[0.8rem] font-semibold">{it.label}</span>
              {it.description ? (
                <span className="text-[0.68rem] leading-tight text-slate-500">
                  {it.description}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

PopoverMenu.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.node,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.node.isRequired,
      description: PropTypes.node,
      active: PropTypes.bool,
      tone: PropTypes.string,
      disabled: PropTypes.bool,
      onClick: PropTypes.func,
    }),
  ),
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  className: PropTypes.string,
  triggerClassName: PropTypes.string,
  panelClassName: PropTypes.string,
  align: PropTypes.oneOf(['start', 'end']),
  disabled: PropTypes.bool,
  ariaLabel: PropTypes.string,
}
