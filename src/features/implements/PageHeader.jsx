import React from 'react'
import PropTypes from 'prop-types'
import { buildCollaboratorChipStyle } from '../sisad-pdfme/domain/collaborationAppearance.js'

const EMPTY_ARRAY = []

const getUserTitle = (user) => [user.role, user.team].filter(Boolean).join(' · ') || user.name
const getUserChipStyle = (user, isActive) => buildCollaboratorChipStyle(user?.color, isActive)

const CollaborationSection = ({
  example,
  collaborationUsers,
  activeCollaborator,
  onActiveCollaboratorChange,
  isGlobalView,
  onToggleGlobalView,
}) => {
  if (collaborationUsers.length === 0) return null

  const sessionLabel = example?.collaboration?.sessionId ? `· ${example.collaboration.sessionId}` : ''
  return (
    <details className="sisad-pdfme-lab-collaboration-disclosure">
      <summary className="sisad-pdfme-lab-collaboration-summary">
        <span className="sisad-pdfme-lab-summary-label sisad-pdfme-lab-collaboration-title">Participantes {sessionLabel}</span>
        {activeCollaborator ? (
          <span
            className="sisad-pdfme-lab-chip"
            title={getUserTitle(activeCollaborator)}
            style={getUserChipStyle(activeCollaborator, true)}
          >
            {activeCollaborator.name}
          </span>
        ) : null}
        <span className="sisad-pdfme-lab-collaboration-count">{collaborationUsers.length}</span>
      </summary>
      <div className="sisad-pdfme-lab-collaboration-body" aria-label="Participantes del ejemplo">
        <div className="sisad-pdfme-lab-collaboration-chips">
          {collaborationUsers.map((user) => (
            <span
              key={user.id}
              className={user.id === activeCollaborator?.id ? 'sisad-pdfme-lab-chip' : 'sisad-pdfme-lab-chip sisad-pdfme-lab-chip-muted'}
              title={getUserTitle(user)}
              style={getUserChipStyle(user, user.id === activeCollaborator?.id)}
            >
              {user.name}
            </span>
          ))}
        </div>
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
    </details>
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
  controls = null,
  backLink = null,
}) {
  return (
    <header className="sisad-pdfme-lab-page-hero">
      <div className="sisad-pdfme-lab-page-topbar">
        <div className="sisad-pdfme-lab-page-copy">
          <p className="sisad-pdfme-lab-kicker">Ruta activa</p>
          <h1>{example?.title}</h1>
          <p className="sisad-pdfme-lab-description">{example?.description}</p>
        </div>

        <div className="sisad-pdfme-lab-page-rail">
          <dl className="sisad-pdfme-lab-page-metrics" aria-label="Estado del laboratorio">
            {pageMetrics.map((metric) => (
              <div key={metric.label} className="sisad-pdfme-lab-page-metric">
                <dt className="sisad-pdfme-lab-summary-label">{metric.label}</dt>
                <dd>{metric.value}</dd>
              </div>
            ))}
          </dl>

          {controls || status ? (
            <div className="sisad-pdfme-lab-page-actions">
              {backLink ? <div className="sisad-pdfme-lab-page-linkRow">{backLink}</div> : null}
              {controls ? (
                <div className="sisad-pdfme-lab-page-controls">
                  {controls}
                </div>
              ) : null}

              {status ? <p className="sisad-pdfme-lab-status sisad-pdfme-lab-status-inline">{status}</p> : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className="sisad-pdfme-lab-page-context">
        <div className="sisad-pdfme-lab-meta" aria-label="Metadatos del ejemplo">
          <span className="sisad-pdfme-lab-chip">id: {example?.id}</span>
          <span className="sisad-pdfme-lab-chip">ruta: {example?.path}</span>
        </div>

        <CollaborationSection
          example={example}
          collaborationUsers={collaborationUsers}
          activeCollaborator={activeCollaborator}
          onActiveCollaboratorChange={onActiveCollaboratorChange}
          isGlobalView={isGlobalView}
          onToggleGlobalView={onToggleGlobalView}
        />
      </div>
    </header>
  )
}

PageHeader.propTypes = {
  example: PropTypes.shape({
    id: PropTypes.string,
    path: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
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
  controls: PropTypes.node,
  backLink: PropTypes.node,
}

CollaborationSection.propTypes = {
  example: PropTypes.shape({
    collaboration: PropTypes.shape({
      sessionId: PropTypes.string,
    }),
  }),
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
}
