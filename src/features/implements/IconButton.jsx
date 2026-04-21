import React from 'react'
import PropTypes from 'prop-types'

export default function IconButton({
  label,
  onClick,
  icon,
  className = '',
  disabled = false,
  isActive = false,
  title,
  ariaHasPopup,
  ariaExpanded,
}) {
  const classNameList = ['sisad-pdfme-compact-icon-button', isActive ? 'is-active' : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={classNameList}
      aria-label={label}
      title={title || label}
      aria-haspopup={ariaHasPopup}
      aria-expanded={ariaExpanded}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ?? <span style={{ fontWeight: 700 }}>{label?.[0] || '?'}</span>}
    </button>
  )
}

IconButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  icon: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  isActive: PropTypes.bool,
  title: PropTypes.string,
  ariaHasPopup: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  ariaExpanded: PropTypes.bool,
}
