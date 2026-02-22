import React from 'react'

const Footer: React.FC = () => (
  <footer className="border-t border-brand-terminal/20 py-3 px-6 shrink-0 bg-dark-card">
    <p className="text-center text-xs font-mono text-brand-terminal/60 tracking-widest">
      <span className="text-brand-terminal/30">{'// '}</span>
      Desenvolvido por{' '}
      <span className="text-brand-terminal/80 font-semibold">Diogo Ferreira</span>
      {' '}e{' '}
      <span className="text-brand-terminal/80 font-semibold">Claude Code/Codex CLI</span>
      {' '}| 2026
    </p>
  </footer>
)

export default Footer
