import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import IconButton from './IconButton.jsx'

const EMPTY_ARRAY = []

export default function PopoverMenu({
  label,
  icon,
  items = EMPTY_ARRAY,
  children = null,
  className = '',
  panelClassName = '',
  align = 'end',
  disabled = false,
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const containerClasses = ['sisad-pdfme-popover', className].filter(Boolean).join(' ')
  const panelClasses = ['sisad-pdfme-popover-panel', panelClassName].filter(Boolean).join(' ')
  const close = () => setOpen(false)
  let customContent = null

  if (typeof children === 'function') {
    customContent = <div className="sisad-pdfme-popover-custom">{children({ close })}</div>
  } else if (children) {
    customContent = <div className="sisad-pdfme-popover-custom">{children}</div>
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
      <IconButton
        label={label}
        icon={icon}
        onClick={() => setOpen((current) => !current)}
        isActive={open}
        ariaHasPopup="menu"
        ariaExpanded={open}
        disabled={disabled}
      />
      {open ? (
        <div className={panelClasses} role="menu">
          {customContent}
          {items.map((it) => (
            <button
              key={it.key || String(it.label)}
              type="button"
              className={['sisad-pdfme-popover-item', it.active ? 'is-active' : '', it.tone ? `is-${it.tone}` : '']
                .filter(Boolean)
                .join(' ')}
              role="menuitem"
              disabled={it.disabled}
              onClick={() => {
                setOpen(false)
                if (typeof it.onClick === 'function') {
                  it.onClick()
                }
              }}
            >
              <span className="sisad-pdfme-popover-item-label">{it.label}</span>
              {it.description ? <span className="sisad-pdfme-popover-item-description">{it.description}</span> : null}
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
  panelClassName: PropTypes.string,
  align: PropTypes.oneOf(['start', 'end']),
  disabled: PropTypes.bool,
}
