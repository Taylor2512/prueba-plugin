import React from 'react'
import PropTypes from 'prop-types'
import CaseCard from './CaseCard.jsx'

const EMPTY_ARRAY = []

export default function CaseGrid({ examples = EMPTY_ARRAY }) {
  return (
    <div className="sisad-pdfme-lab-card-list">
      {examples.map((ex) => (
        <CaseCard key={ex.id} example={ex} />
      ))}
    </div>
  )
}

CaseGrid.propTypes = {
  examples: PropTypes.arrayOf(PropTypes.object),
}
