import React from 'react'
import PropTypes from 'prop-types'

const EMPTY_ARRAY = []

const getUserTitle = (user) => [user.role, user.team].filter(Boolean).join(' · ') || user.name

const CollaborationSection = ({ example, collaborationUsers, activeCollaborator, onActiveCollaboratorChange }) => {
  if (collaborationUsers.length === 0) return null

  const sessionLabel = example?.collaboration?.sessionId ? `· ${example.collaboration.sessionId}` : ''
  return (
    <div className="sisad-pdfme-lab-collaboration" aria-label="Participantes del ejemplo">
      <span className="sisad-pdfme-lab-summary-label sisad-pdfme-lab-collaboration-title">Participantes {sessionLabel}</span>
      <div className="sisad-pdfme-lab-collaboration-chips">
        {collaborationUsers.map((user) => (
          <span
            key={user.id}
            className={user.id === activeCollaborator?.id ? 'sisad-pdfme-lab-chip' : 'sisad-pdfme-lab-chip sisad-pdfme-lab-chip-muted'}
            title={getUserTitle(user)}
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
    </div>
  )
}

export default function PageHeader({
  example,
  pageMetrics = EMPTY_ARRAY,
  collaborationUsers = EMPTY_ARRAY,
  activeCollaborator = null,
  onActiveCollaboratorChange = null,
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
                  <span className="sisad-pdfme-lab-summary-label">Acciones</span>
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
    }),
  ),
  activeCollaborator: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  onActiveCollaboratorChange: PropTypes.func,
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
    }),
  ),
  activeCollaborator: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  onActiveCollaboratorChange: PropTypes.func,
}
