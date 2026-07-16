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

const PAGE_TOPBAR_STYLE = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.4fr) minmax(17rem, 0.95fr)',
  gap: '0.22rem 0.42rem',
  alignItems: 'start',
  minWidth: 0,
}

const PAGE_COPY_STYLE = {
  display: 'grid',
  gap: '0.12rem',
  alignContent: 'start',
  minWidth: 0,
}

const PAGE_RAIL_STYLE = {
  display: 'grid',
  gap: '0.18rem',
  alignItems: 'start',
  minWidth: 0,
  justifyItems: 'end',
}

const PAGE_ACTIONS_STYLE = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '0.25rem',
  minWidth: 0,
  borderRadius: '13px',
  border: '1px solid rgba(148, 163, 184, 0.22)',
  background: 'rgba(248, 250, 252, 0.75)',
  padding: '0.22rem 0.28rem',
}

const PAGE_ACTIONS_COMPACT_STYLE = {
  gap: '0.12rem',
  background: 'transparent',
  padding: 0,
}

const PAGE_STATUS_STYLE = {
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: '10px',
  background: 'rgba(15, 23, 42, 0.035)',
  padding: '0.18rem 0.4rem',
}

const PAGE_LINK_ROW_STYLE = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
}

const PAGE_CONTROLS_STYLE = {
  display: 'inline-flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '0.25rem',
  minWidth: 0,
}

const PAGE_DETAILS_STYLE = {
  display: 'grid',
  gap: '0.18rem',
  width: '100%',
  border: 0,
  paddingTop: '0.08rem',
}

const PAGE_DETAILS_SUMMARY_STYLE = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.28rem',
  width: 'fit-content',
  cursor: 'pointer',
  listStyle: 'none',
  userSelect: 'none',
}

const PAGE_CONTEXT_STYLE = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
  alignItems: 'stretch',
  minWidth: 0,
}

const PAGE_METRICS_STYLE = {
  display: 'flex',
  flexWrap: 'nowrap',
  gap: '0.3rem',
  alignSelf: 'start',
  margin: 0,
  padding: 0,
  overflowX: 'auto',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
}

const PAGE_TOP_HEADER_STYLE = {
  display: 'grid',
  gap: '0.22rem',
  padding: '0.3rem 0.38rem',
  position: 'relative',
  zIndex: 'var(--sisad-pdfme-z-header)',
}

const LAB_CHIP_BASE =
  'inline-flex min-h-[1.45rem] items-center justify-center rounded-full border border-slate-200/70 bg-slate-50/85 px-2 text-[0.72rem] font-semibold leading-none text-slate-600 shadow-sm'
const LAB_CHIP_MUTED = 'bg-slate-50/80 text-slate-500'
const LAB_CHIP_BUTTON_BASE =
  'appearance-none cursor-pointer border border-[rgba(148,163,184,0.18)] transition-[transform,border-color,box-shadow,background-color] duration-150 ease-in-out hover:-translate-y-px focus-visible:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-1 focus-visible:ring-offset-white'
const LAB_CHIP_BUTTON_ACTIVE = 'border-sky-200 bg-white text-sky-700 shadow-sm ring-1 ring-sky-100'

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
    <span key={item.label} className={joinClasses(LAB_CHIP_BASE, LAB_CHIP_MUTED)}>
      {item.label}: {item.value}
    </span>
  ))

const renderCollaboratorButtons = (users, activeCollaboratorId, onActiveCollaboratorChange) =>
  users.map((user) => {
    const isActive = user.id === activeCollaboratorId
    const toneClass = getCollaboratorToneClass(user.color)
    const chipStyle = buildCollaboratorChipStyle(user.color, isActive)

    return (
      <li key={user.id} className="flex">
        <button
          type="button"
          className={joinClasses(
            LAB_CHIP_BASE,
            LAB_CHIP_BUTTON_BASE,
            toneClass,
            isActive ? LAB_CHIP_BUTTON_ACTIVE : LAB_CHIP_MUTED,
            'gap-1.5 px-2.5 py-1.5',
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
        'sisad-pdfme-lab-page-actions flex min-w-0 flex-wrap items-center justify-end gap-x-1 gap-y-1 rounded-[13px] border border-slate-200/75 bg-white/80 p-[0.22rem_0.28rem] shadow-[0_4px_12px_rgba(15,23,42,0.08)] backdrop-blur-[10px] max-[900px]:gap-x-[0.12rem] max-[900px]:gap-y-[0.12rem] max-[900px]:bg-transparent max-[900px]:shadow-none max-[900px]:p-0',
        isCompact && 'sisad-pdfme-lab-page-actions-compact',
      )}
      style={{ ...PAGE_ACTIONS_STYLE, ...(isCompact ? PAGE_ACTIONS_COMPACT_STYLE : {}) }}
    >
      {status ? <span className="inline-flex items-center rounded-[10px] bg-slate-900/[0.035] px-[0.4rem] py-[0.18rem]" style={PAGE_STATUS_STYLE}>{status}</span> : null}
      {backLink ? <div className="flex items-center justify-end" style={PAGE_LINK_ROW_STYLE}>{backLink}</div> : null}
      {downloadLink ? <div className="flex items-center justify-end" style={PAGE_LINK_ROW_STYLE}>{downloadLink}</div> : null}
      {controls ? <div className="inline-flex min-w-0 flex-wrap items-center justify-end gap-[0.25rem]" style={PAGE_CONTROLS_STYLE}>{controls}</div> : null}
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
  <details className="sisad-pdfme-lab-page-details sisad-pdfme-lab-debug-details grid w-full gap-[0.18rem] border-0 pt-[0.08rem] max-[900px]:gap-[0.18rem]" style={PAGE_DETAILS_STYLE}>
    <summary className="inline-flex w-fit cursor-pointer select-none items-center gap-[0.28rem] list-none" style={PAGE_DETAILS_SUMMARY_STYLE}>
      <span className="text-[0.68rem] font-bold text-blue-700">Detalles técnicos</span>
      <span className="text-[0.68rem] font-bold text-blue-700">Metadatos y estado</span>
    </summary>
    <div className="sisad-pdfme-lab-page-context flex min-w-0 flex-col gap-[0.4rem] max-[900px]:grid-cols-1" style={PAGE_CONTEXT_STYLE}>
      {pageMetrics.length > 0 ? (
        <dl className="sisad-pdfme-lab-page-metrics flex flex-nowrap gap-[0.3rem] self-start overflow-x-auto p-0 [scrollbar-width:none] [-ms-overflow-style:none] max-[640px]:gap-[0.28rem]" aria-label="Estado del laboratorio" style={PAGE_METRICS_STYLE}>
          {pageMetrics.map((metric) => (
            <CompactMetric key={metric.label} label={metric.label} value={metric.value} />
          ))}
        </dl>
      ) : null}

      <div className="grid grid-cols-2 gap-[0.18rem_0.3rem] min-w-0" aria-label="Metadatos del ejemplo">
        <span className={LAB_CHIP_BASE}>id: {example?.id}</span>
        <span className={LAB_CHIP_BASE}>ruta: {example?.path}</span>
        <span className={LAB_CHIP_BASE}>runtime: {example?.defaultMode}</span>
        <span className={LAB_CHIP_BASE}>sessionId: {example?.collaboration?.sessionId || 'local'}</span>
      </div>
    </div>
  </details>
)

HeaderDetails.propTypes = {
  example: EXAMPLE_PROP_TYPE,
  pageMetrics: PropTypes.arrayOf(PAGE_METRIC_PROP_TYPE).isRequired,
}

const CollaborationSelect = ({ label, value, ariaLabel, onChange, options }) => (
  <label className="inline-flex items-center gap-[0.25rem] min-w-0 ml-auto">
    <span className="text-[0.64rem] font-bold text-slate-600 whitespace-nowrap">{label}</span>
    <select
      className="min-w-[7.4rem] rounded-[11px] border border-[rgba(148,163,184,0.28)] bg-white/90 px-[0.55rem] py-0 text-[0.72rem] font-bold text-slate-900 shadow-[0_4px_12px_rgba(15,23,42,0.08)] backdrop-blur-[8px]"
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
    <div className="flex flex-wrap items-center gap-2" aria-label="Colaboración">
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
  <div className="sisad-pdfme-lab-page-metric sisad-pdfme-lab-page-metric-compact flex-none min-w-[6rem] rounded-[12px] border border-slate-200/80 bg-gradient-to-b from-slate-50/95 to-slate-200/90 p-[0.38rem_0.5rem] max-[900px]:p-[0.35rem_0.48rem]">
    <dt className="text-[0.64rem] font-bold uppercase tracking-[0.08em] text-slate-500">{label}</dt>
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
      <section className="grid gap-[0.14rem] rounded-[12px] border border-[rgba(148,163,184,0.15)] bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(248,250,252,0.82))] p-[0.12rem_0.22rem] shadow-[0_8px_24px_rgba(15,23,42,0.04)] backdrop-blur-[10px]" aria-label="Colaboración del ejemplo">
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
    <section className="grid grid-cols-[minmax(0,1fr)_auto] gap-[0.28rem_0.55rem] items-start w-full min-w-0 rounded-[16px] border border-[rgba(148,163,184,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(248,250,252,0.82)),rgba(255,255,255,0.74)] p-[0.3rem_0.38rem] shadow-[0_10px_24px_rgba(15,23,42,0.07)]" aria-label="Colaboración del ejemplo">
      <div className="grid gap-[0.3rem] min-w-0">
        <div className="flex flex-wrap items-center gap-[0.2rem_0.32rem] min-w-0">
          <span className="text-[0.64rem] font-bold uppercase tracking-[0.08em] text-slate-500">Participantes</span>
          <span className="inline-flex min-h-[1.45rem] min-w-[1.45rem] items-center justify-center rounded-full bg-[rgba(219,234,254,0.95)] px-[0_0.4rem] text-[0.72rem] font-bold text-blue-700">{collaborationUsers.length}</span>
        </div>

        <ul className="flex flex-wrap items-center gap-[0.3rem] min-w-0 list-none p-0 m-0" aria-label="Participantes del ejemplo">
          {renderCollaboratorButtons(collaborationUsers, activeCollaborator?.id, onActiveCollaboratorChange)}
        </ul>

        {summaryItems.length > 0 ? (
          <div className="flex flex-wrap items-center gap-[0.25rem_0.4rem] min-w-0" aria-label="Resumen de colaboración">
            {renderSummaryChips(summaryItems)}
          </div>
        ) : null}
      </div>

      <div className="grid gap-[0.3rem] justify-items-end">
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
        'sisad-pdfme-lab-page-hero sisad-pdfme-lab-editor-shell grid max-w-full min-w-0 box-border gap-[0.22rem] rounded-[20px] border border-slate-200/70 bg-[rgba(255,255,255,0.88)] px-[0.38rem] py-[0.3rem] shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-[12px] relative z-[var(--sisad-pdfme-z-header)]',
        isCompact && 'min-h-[46px] max-h-[50px] gap-[0.06rem] rounded-[14px] border border-slate-200/70 bg-[rgba(255,255,255,0.88)] p-[0.16rem_0.34rem] shadow-[0_10px_22px_rgba(15,23,42,0.04)] backdrop-blur-[8px]',
        'max-[900px]:gap-[0.12rem] max-[900px]:p-[0.18rem_0.24rem] max-[900px]:rounded-[12px]',
      )}
      data-density={density}
      style={PAGE_TOP_HEADER_STYLE}
    >
      <div className={cn(
        'sisad-pdfme-lab-page-topbar sisad-pdfme-lab-editor-topbar w-full',
        isCompact && 'grid-cols-[auto] items-center gap-[0] justify-items-end',
        'max-[900px]:grid-cols-1 max-[900px]:gap-[0.1rem_0.22rem]',
      )} style={PAGE_TOPBAR_STYLE}>
        {!isCompact ? (
          <div className={cn('sisad-pdfme-lab-page-copy flex min-w-0 flex-col gap-[0.12rem]', 'max-[900px]:gap-[0.04rem]')} style={PAGE_COPY_STYLE}>
            <div className="sisad-pdfme-lab-page-eyebrow inline-flex flex-wrap items-center gap-[0.3rem]">
              <span className="sisad-pdfme-lab-kicker mb-[0.12rem] text-[0.64rem] font-bold uppercase tracking-[0.12em] text-slate-600">Lab</span>
              {modeLabel ? <span className={joinClasses(LAB_CHIP_BASE, LAB_CHIP_MUTED)}>{modeLabel}</span> : null}
            </div>
            <h1 className="text-[clamp(1rem,1.15vw,1.18rem)] leading-none text-slate-950 max-[900px]:text-[clamp(1.02rem,_5.4vw,_1.35rem)]">{title}</h1>
            {showExpandedHeader && description ? (
              <p className="sisad-pdfme-lab-description text-[0.76rem] leading-[1.2] text-slate-600 max-[900px]:mt-[0.2rem] max-[900px]:text-[0.84rem] max-[900px]:leading-[1.32]">
                {description}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className={cn('sisad-pdfme-lab-page-rail grid min-w-0 justify-items-end gap-[0.18rem]', isCompact && 'gap-[0.08rem]', 'max-[900px]:grid-cols-1 max-[900px]:justify-items-start')} style={PAGE_RAIL_STYLE}>
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
