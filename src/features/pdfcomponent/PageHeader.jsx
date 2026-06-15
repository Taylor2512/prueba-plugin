import React from 'react'
import PropTypes from 'prop-types'
import { getCollaboratorToneClass, getLabModeLabel } from './domain/labPresentation.js'
import { buildCollaboratorChipStyle } from '@/sisad-pdfme/collaboration/appearance'

const EMPTY_ARRAY = []
const joinClasses = (...classes) => classes.filter(Boolean).join(' ')

const getUserTitle = (user) => [user.role, user.team].filter(Boolean).join(' · ') || user.name

const CompactMetric = ({ label, value }) => (
  <div className="sisad-pdfme-lab-page-metric sisad-pdfme-lab-page-metric-compact">
    <dt className="sisad-pdfme-lab-summary-label">{label}</dt>
    <dd>{value}</dd>
  </div>
)

CompactMetric.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
}

const CollaborationSection = ({
  collaborationUsers,
  activeCollaborator,
  onActiveCollaboratorChange,
  isGlobalView,
  onToggleGlobalView,
  collaborationSummary,
}) => {
  if (collaborationUsers.length === 0) return null

  const summaryItems = [
    collaborationSummary?.visibleCount != null ? { label: 'Visibles', value: collaborationSummary.visibleCount } : null,
    collaborationSummary?.editableCount != null ? { label: 'Editables', value: collaborationSummary.editableCount } : null,
    collaborationSummary?.lockedCount != null ? { label: 'Bloqueados', value: collaborationSummary.lockedCount } : null,
    collaborationSummary?.commentCount != null ? { label: 'Comentarios', value: collaborationSummary.commentCount } : null,
  ].filter(Boolean)

  return (
    <section className="sisad-pdfme-lab-collaboration-bar" aria-label="Colaboración del ejemplo">
      <div className="sisad-pdfme-lab-collaboration-main">
        <div className="sisad-pdfme-lab-collaboration-headline">
          <span className="sisad-pdfme-lab-summary-label">Participantes</span>
          <span className="sisad-pdfme-lab-collaboration-count">{collaborationUsers.length}</span>
        </div>

        <ul className="sisad-pdfme-lab-collaboration-chips" aria-label="Participantes del ejemplo">
          {collaborationUsers.map((user) => {
            const isActive = user.id === activeCollaborator?.id
            const toneClass = getCollaboratorToneClass(user.color)
            const chipStyle = buildCollaboratorChipStyle(user.color, isActive)
            return (
              <li key={user.id} className="sisad-pdfme-lab-chip-item">
                <button
                  type="button"
                  className={joinClasses(
                    'sisad-pdfme-lab-chip',
                    'sisad-pdfme-lab-chip-button',
                    toneClass,
                    isActive ? 'is-active' : 'sisad-pdfme-lab-chip-muted',
                  )}
                  style={chipStyle}
                  title={getUserTitle(user)}
                  aria-pressed={isActive}
                  data-recipient-id={user.id}
                  data-recipient-color={user.color || ''}
                  onClick={() => {
                    if (typeof onActiveCollaboratorChange === 'function') {
                      onActiveCollaboratorChange(user.id)
                    }
                  }}
                >
                  {user.name}
                </button>
              </li>
            )
          })}
        </ul>

        {summaryItems.length > 0 ? (
          <div className="sisad-pdfme-lab-collaboration-summary" aria-label="Resumen de colaboración">
            {summaryItems.map((item) => (
              <span key={item.label} className="sisad-pdfme-lab-chip sisad-pdfme-lab-chip-muted">
                {item.label}: {item.value}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="sisad-pdfme-lab-collaboration-controls">
        {onActiveCollaboratorChange ? (
          <label className="sisad-pdfme-lab-collaboration-select-wrap">
            <span className="sisad-pdfme-lab-collaboration-select-label">Activo</span>
            <select
              className="sisad-pdfme-lab-select sisad-pdfme-lab-collaboration-select"
              value={activeCollaborator?.id || ''}
              onChange={(event) => onActiveCollaboratorChange(event.target.value)}
              aria-label="Seleccionar usuario activo"
            >
              {collaborationUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {onToggleGlobalView ? (
          <label className="sisad-pdfme-lab-collaboration-select-wrap">
            <span className="sisad-pdfme-lab-collaboration-select-label">Vista</span>
            <select
              className="sisad-pdfme-lab-select sisad-pdfme-lab-collaboration-select"
              value={isGlobalView ? 'global' : 'user'}
              onChange={(event) => onToggleGlobalView(event.target.value === 'global')}
              aria-label="Seleccionar vista activa"
            >
              <option value="user">Usuario activo</option>
              <option value="global">Global</option>
            </select>
          </label>
        ) : null}
      </div>
    </section>
  )
}

export default function PageHeader({
  example,
  pageMetrics = EMPTY_ARRAY,
  collaborationUsers = EMPTY_ARRAY,
  activeCollaborator = null,
  onActiveCollaboratorChange = null,
  isGlobalView = false,
  onToggleGlobalView = null,
  status,
  downloadLink = null,
  controls = null,
  backLink = null,
  density = 'full',
  collaborationSummary = null,
}) {
  const isCompact = density === 'compact'
  const title = example?.title || 'Laboratorio'
  const description = example?.description || ''
  const modeLabel = getLabModeLabel(example?.defaultMode)

  return (
    <header className="sisad-pdfme-lab-page-hero sisad-pdfme-lab-editor-shell" data-density={density}>
      <div className="sisad-pdfme-lab-page-topbar sisad-pdfme-lab-editor-topbar">
        <div className="sisad-pdfme-lab-page-copy">
          <div className="sisad-pdfme-lab-page-eyebrow">
            <span className="sisad-pdfme-lab-kicker">Lab</span>
            {modeLabel ? <span className="sisad-pdfme-lab-chip sisad-pdfme-lab-chip-muted">{modeLabel}</span> : null}
          </div>
          <h1>{title}</h1>
          {description ? (
            <p className="sisad-pdfme-lab-description">
              {isCompact ? description.split('. ')[0] : description}
            </p>
          ) : null}
        </div>

        <div className="sisad-pdfme-lab-page-rail">
          <div className="sisad-pdfme-lab-page-actions">
            {status ? <span className="sisad-pdfme-lab-status sisad-pdfme-lab-status-inline">{status}</span> : null}
            {backLink ? <div className="sisad-pdfme-lab-page-linkRow">{backLink}</div> : null}
            {downloadLink ? <div className="sisad-pdfme-lab-page-linkRow">{downloadLink}</div> : null}
            {controls ? <div className="sisad-pdfme-lab-page-controls">{controls}</div> : null}
          </div>
        </div>
      </div>

      <CollaborationSection
        collaborationUsers={collaborationUsers}
        activeCollaborator={activeCollaborator}
        onActiveCollaboratorChange={onActiveCollaboratorChange}
        isGlobalView={isGlobalView}
        onToggleGlobalView={onToggleGlobalView}
        collaborationSummary={collaborationSummary}
      />

      <details className="sisad-pdfme-lab-page-details sisad-pdfme-lab-debug-details">
        <summary className="sisad-pdfme-lab-page-details-summary">
          <span className="sisad-pdfme-lab-summary-label">Detalles técnicos</span>
          <span className="sisad-pdfme-lab-page-details-title">Metadatos y estado</span>
        </summary>
        <div className="sisad-pdfme-lab-page-context">
          {pageMetrics.length > 0 ? (
            <dl className="sisad-pdfme-lab-page-metrics" aria-label="Estado del laboratorio">
              {pageMetrics.map((metric) => (
                <CompactMetric key={metric.label} label={metric.label} value={metric.value} />
              ))}
            </dl>
          ) : null}

          <div className="sisad-pdfme-lab-meta sisad-pdfme-lab-meta-grid" aria-label="Metadatos del ejemplo">
            <span className="sisad-pdfme-lab-chip">id: {example?.id}</span>
            <span className="sisad-pdfme-lab-chip">ruta: {example?.path}</span>
            <span className="sisad-pdfme-lab-chip">runtime: {example?.defaultMode}</span>
            <span className="sisad-pdfme-lab-chip">sessionId: {example?.collaboration?.sessionId || 'local'}</span>
          </div>
        </div>
      </details>
    </header>
  )
}

PageHeader.propTypes = {
  example: PropTypes.shape({
    id: PropTypes.string,
    path: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    defaultMode: PropTypes.string,
    collaboration: PropTypes.shape({
      sessionId: PropTypes.string,
    }),
  }),
  pageMetrics: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.node.isRequired,
    }),
  ),
  collaborationUsers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      role: PropTypes.string,
      team: PropTypes.string,
      color: PropTypes.string,
    }),
  ),
  activeCollaborator: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  onActiveCollaboratorChange: PropTypes.func,
  isGlobalView: PropTypes.bool,
  onToggleGlobalView: PropTypes.func,
  status: PropTypes.node,
  downloadLink: PropTypes.node,
  controls: PropTypes.node,
  backLink: PropTypes.node,
  density: PropTypes.oneOf(['full', 'compact', 'hidden']),
  collaborationSummary: PropTypes.shape({
    visibleCount: PropTypes.number,
    editableCount: PropTypes.number,
    lockedCount: PropTypes.number,
    commentCount: PropTypes.number,
  }),
}

CollaborationSection.propTypes = {
  collaborationUsers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      role: PropTypes.string,
      team: PropTypes.string,
      color: PropTypes.string,
    }),
  ).isRequired,
  activeCollaborator: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  onActiveCollaboratorChange: PropTypes.func,
  isGlobalView: PropTypes.bool,
  onToggleGlobalView: PropTypes.func,
  collaborationSummary: PropTypes.shape({
    visibleCount: PropTypes.number,
    editableCount: PropTypes.number,
    lockedCount: PropTypes.number,
    commentCount: PropTypes.number,
  }),
}
