import React from 'react'
import PropTypes from 'prop-types'
import { getCollaboratorToneClass, getLabModeLabel } from './domain/labPresentation.js'
import { buildCollaboratorChipStyle } from '@/sisad-pdfme/collaboration/appearance'
import { cn } from '@/sisad-pdfme/ui/utils/cn'
import PopoverMenu from './PopoverMenu.jsx'

const EMPTY_ARRAY = []
const joinClasses = (...classes) => classes.filter(Boolean).join(' ')
const COLLABORATION_VIEW_OPTIONS = [
  { id: 'user', name: 'Usuario activo' },
  { id: 'global', name: 'Global' },
]
const COLLABORATOR_PROP_TYPE = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  role: PropTypes.string,
  team: PropTypes.string,
  color: PropTypes.string,
})
const PAGE_METRIC_PROP_TYPE = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
})
const COLLABORATION_SUMMARY_PROP_TYPE = PropTypes.shape({
  visibleCount: PropTypes.number,
  editableCount: PropTypes.number,
  lockedCount: PropTypes.number,
  commentCount: PropTypes.number,
})
const EXAMPLE_PROP_TYPE = PropTypes.shape({
  id: PropTypes.string,
  path: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  defaultMode: PropTypes.string,
  collaboration: PropTypes.shape({
    sessionId: PropTypes.string,
  }),
})

const getUserTitle = (user) => [user.role, user.team].filter(Boolean).join(' · ') || user.name

const getCollaborationSummaryItems = (collaborationSummary) => [
  collaborationSummary?.visibleCount != null ? { label: 'Visibles', value: collaborationSummary.visibleCount } : null,
  collaborationSummary?.editableCount != null ? { label: 'Editables', value: collaborationSummary.editableCount } : null,
  collaborationSummary?.lockedCount != null ? { label: 'Bloqueados', value: collaborationSummary.lockedCount } : null,
  collaborationSummary?.commentCount != null ? { label: 'Comentarios', value: collaborationSummary.commentCount } : null,
].filter(Boolean)

const getCollaborationViewItems = (isGlobalView, onToggleGlobalView) => [
  { key: 'user', label: 'Usuario activo', active: !isGlobalView, onClick: () => onToggleGlobalView?.(false) },
  { key: 'global', label: 'Global', active: isGlobalView, onClick: () => onToggleGlobalView?.(true) },
]

const renderSummaryChips = (items) =>
  items.map((item) => (
    <span key={item.label} className="sisad-pdfme-lab-chip sisad-pdfme-lab-chip-muted">
      {item.label}: {item.value}
    </span>
  ))

const renderCollaboratorButtons = (users, activeCollaboratorId, onActiveCollaboratorChange) =>
  users.map((user) => {
    const isActive = user.id === activeCollaboratorId
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
  })

const HeaderActionStack = ({ status = null, backLink = null, downloadLink = null, controls = null, isCompact = false }) => {
  if (!status && !backLink && !downloadLink && !controls) return null

  return (
    <div
      className={joinClasses(
        'sisad-pdfme-lab-page-actions flex min-w-0 flex-wrap items-center justify-end gap-x-1 gap-y-1 rounded-[13px] border border-slate-200 bg-slate-50/75 p-[0.22rem_0.28rem]',
        isCompact && 'sisad-pdfme-lab-page-actions-compact gap-x-[0.12rem] gap-y-[0.12rem] bg-transparent p-0',
      )}
    >
      {status ? <span className="sisad-pdfme-lab-status sisad-pdfme-lab-status-inline inline-flex items-center rounded-[10px] bg-slate-900/[0.035] px-[0.4rem] py-[0.18rem]">{status}</span> : null}
      {backLink ? <div className="sisad-pdfme-lab-page-linkRow flex items-center justify-end">{backLink}</div> : null}
      {downloadLink ? <div className="sisad-pdfme-lab-page-linkRow flex items-center justify-end">{downloadLink}</div> : null}
      {controls ? <div className="sisad-pdfme-lab-page-controls inline-flex min-w-0 flex-wrap items-center justify-end gap-[0.25rem]">{controls}</div> : null}
    </div>
  )
}

HeaderActionStack.propTypes = {
  status: PropTypes.node,
  backLink: PropTypes.node,
  downloadLink: PropTypes.node,
  controls: PropTypes.node,
  isCompact: PropTypes.bool,
}

const HeaderDetails = ({ example, pageMetrics }) => (
  <details className="sisad-pdfme-lab-page-details sisad-pdfme-lab-debug-details grid w-full gap-[0.18rem] border-0 pt-[0.08rem]">
    <summary className="sisad-pdfme-lab-page-details-summary inline-flex w-fit cursor-pointer select-none items-center gap-[0.28rem] list-none">
      <span className="sisad-pdfme-lab-summary-label text-[0.68rem] font-bold text-blue-700">Detalles técnicos</span>
      <span className="sisad-pdfme-lab-page-details-title text-[0.68rem] font-bold text-blue-700">Metadatos y estado</span>
    </summary>
    <div className="sisad-pdfme-lab-page-context flex min-w-0 flex-col gap-[0.4rem]">
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
)

HeaderDetails.propTypes = {
  example: EXAMPLE_PROP_TYPE,
  pageMetrics: PropTypes.arrayOf(PAGE_METRIC_PROP_TYPE).isRequired,
}

const CollaborationSelect = ({ label, value, ariaLabel, onChange, options }) => (
  <label className="sisad-pdfme-lab-collaboration-select-wrap">
    <span className="sisad-pdfme-lab-collaboration-select-label">{label}</span>
    <select
      className="sisad-pdfme-lab-select sisad-pdfme-lab-collaboration-select"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label={ariaLabel}
    >
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  </label>
)

CollaborationSelect.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  ariaLabel: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.node.isRequired,
    }),
  ).isRequired,
}

// Compact collaboration bar (canvas-first): recipient + view + status as small
// popovers with color dots — no permanent chips/counters in the header.
export const CompactCollaborationBar = ({
  collaborationUsers,
  activeCollaborator,
  onActiveCollaboratorChange,
  isGlobalView,
  onToggleGlobalView,
  collaborationSummary,
}) => {
  const counters = getCollaborationSummaryItems(collaborationSummary)
  const viewItems = getCollaborationViewItems(isGlobalView, onToggleGlobalView)

  return (
    <div className="sisad-pdfme-lab-collaboration-compact" aria-label="Colaboración">
      {onActiveCollaboratorChange ? (
        <CollaborationSelect
          label="Usuario"
          value={activeCollaborator?.id || ''}
          ariaLabel="Seleccionar usuario activo"
          onChange={onActiveCollaboratorChange}
          options={collaborationUsers}
        />
      ) : null}
      {onToggleGlobalView ? (
        <PopoverMenu
          className="sisad-pdfme-lab-view-menu"
          align="start"
          label={isGlobalView ? 'Global' : 'Usuario activo'}
          items={viewItems}
        />
      ) : null}
      {counters.length > 0 ? (
        <PopoverMenu className="sisad-pdfme-lab-status-menu" align="end" label="Estado">
          <ul className="sisad-pdfme-lab-status-list">
            {counters.map(({ label, value }) => (
              <li key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </li>
            ))}
          </ul>
        </PopoverMenu>
      ) : null}
    </div>
  )
}

CompactCollaborationBar.propTypes = {
  collaborationUsers: PropTypes.arrayOf(COLLABORATOR_PROP_TYPE).isRequired,
  activeCollaborator: COLLABORATOR_PROP_TYPE,
  onActiveCollaboratorChange: PropTypes.func,
  isGlobalView: PropTypes.bool,
  onToggleGlobalView: PropTypes.func,
  collaborationSummary: COLLABORATION_SUMMARY_PROP_TYPE,
}

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
  isCompact = false,
}) => {
  if (collaborationUsers.length === 0) return null

  if (isCompact) {
    return (
      <section className="sisad-pdfme-lab-collaboration-bar sisad-pdfme-lab-collaboration-bar-compact" aria-label="Colaboración del ejemplo">
        <CompactCollaborationBar
          collaborationUsers={collaborationUsers}
          activeCollaborator={activeCollaborator}
          onActiveCollaboratorChange={onActiveCollaboratorChange}
          isGlobalView={isGlobalView}
          onToggleGlobalView={onToggleGlobalView}
          collaborationSummary={collaborationSummary}
        />
      </section>
    )
  }

  const summaryItems = getCollaborationSummaryItems(collaborationSummary)

  return (
    <section className="sisad-pdfme-lab-collaboration-bar" aria-label="Colaboración del ejemplo">
      <div className="sisad-pdfme-lab-collaboration-main">
        <div className="sisad-pdfme-lab-collaboration-headline">
          <span className="sisad-pdfme-lab-summary-label">Participantes</span>
          <span className="sisad-pdfme-lab-collaboration-count">{collaborationUsers.length}</span>
        </div>

        <ul className="sisad-pdfme-lab-collaboration-chips" aria-label="Participantes del ejemplo">
          {renderCollaboratorButtons(collaborationUsers, activeCollaborator?.id, onActiveCollaboratorChange)}
        </ul>

        {summaryItems.length > 0 ? (
          <div className="sisad-pdfme-lab-collaboration-summary" aria-label="Resumen de colaboración">
            {renderSummaryChips(summaryItems)}
          </div>
        ) : null}
      </div>

      <div className="sisad-pdfme-lab-collaboration-controls">
        {onActiveCollaboratorChange ? (
          <CollaborationSelect
            label="Activo"
            value={activeCollaborator?.id || ''}
            ariaLabel="Seleccionar usuario activo"
            onChange={onActiveCollaboratorChange}
            options={collaborationUsers}
          />
        ) : null}

        {onToggleGlobalView ? (
          <CollaborationSelect
            label="Vista"
            value={isGlobalView ? 'global' : 'user'}
            ariaLabel="Seleccionar vista activa"
            onChange={(nextValue) => onToggleGlobalView(nextValue === 'global')}
            options={COLLABORATION_VIEW_OPTIONS}
          />
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
  rightSlot = null,
  backLink = null,
  density = 'full',
  collaborationSummary = null,
}) {
  const isCompact = density === 'compact'
  const title = example?.title || 'Laboratorio'
  const description = example?.description || ''
  const modeLabel = getLabModeLabel(example?.defaultMode)
  const showExpandedHeader = !isCompact

  return (
    <header
      className={cn(
        'sisad-pdfme-lab-page-hero sisad-pdfme-lab-editor-shell',
      )}
      data-density={density}
    >
      <div className={cn('sisad-pdfme-lab-page-topbar sisad-pdfme-lab-editor-topbar w-full')}>
        <div className="sisad-pdfme-lab-page-copy flex min-w-0 flex-col gap-[0.12rem]">
          <div className="sisad-pdfme-lab-page-eyebrow inline-flex flex-wrap items-center gap-[0.3rem]">
            <span className="sisad-pdfme-lab-kicker">Lab</span>
            {modeLabel ? <span className="sisad-pdfme-lab-chip sisad-pdfme-lab-chip-muted">{modeLabel}</span> : null}
          </div>
          <h1>{title}</h1>
          {showExpandedHeader && description ? (
            <p className="sisad-pdfme-lab-description">
              {description}
            </p>
          ) : null}
        </div>

        <div className="sisad-pdfme-lab-page-rail grid min-w-0 justify-items-end gap-[0.18rem]">
          {rightSlot ? <div className="sisad-pdfme-lab-page-rightSlot">{rightSlot}</div> : null}
          <HeaderActionStack
            status={showExpandedHeader ? status : null}
            backLink={showExpandedHeader ? backLink : null}
            downloadLink={showExpandedHeader ? downloadLink : null}
            controls={controls}
            isCompact={isCompact}
          />
        </div>
      </div>

      {!isCompact ? (
        <CollaborationSection
          collaborationUsers={collaborationUsers}
          activeCollaborator={activeCollaborator}
          onActiveCollaboratorChange={onActiveCollaboratorChange}
          isGlobalView={isGlobalView}
          onToggleGlobalView={onToggleGlobalView}
          collaborationSummary={collaborationSummary}
          isCompact={isCompact}
        />
      ) : null}

      {showExpandedHeader ? <HeaderDetails example={example} pageMetrics={pageMetrics} /> : null}
    </header>
  )
}

PageHeader.propTypes = {
  example: EXAMPLE_PROP_TYPE,
  pageMetrics: PropTypes.arrayOf(PAGE_METRIC_PROP_TYPE),
  collaborationUsers: PropTypes.arrayOf(COLLABORATOR_PROP_TYPE),
  activeCollaborator: COLLABORATOR_PROP_TYPE,
  onActiveCollaboratorChange: PropTypes.func,
  isGlobalView: PropTypes.bool,
  onToggleGlobalView: PropTypes.func,
  status: PropTypes.node,
  downloadLink: PropTypes.node,
  controls: PropTypes.node,
  rightSlot: PropTypes.node,
  backLink: PropTypes.node,
  density: PropTypes.oneOf(['full', 'compact', 'hidden']),
  collaborationSummary: COLLABORATION_SUMMARY_PROP_TYPE,
}

CollaborationSection.propTypes = {
  collaborationUsers: PropTypes.arrayOf(COLLABORATOR_PROP_TYPE).isRequired,
  activeCollaborator: COLLABORATOR_PROP_TYPE,
  onActiveCollaboratorChange: PropTypes.func,
  isGlobalView: PropTypes.bool,
  onToggleGlobalView: PropTypes.func,
  collaborationSummary: COLLABORATION_SUMMARY_PROP_TYPE,
}
