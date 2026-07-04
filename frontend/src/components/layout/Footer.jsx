const columns = [
  {
    title: 'Product',
    links: ['Career Time Machine', 'Virtual Internship', 'Resume Analyzer', 'Mock Interview'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Blog', 'Contact'],
  },
  {
    title: 'Resources',
    links: ['Guides', 'Roadmaps', 'FAQ', 'Support'],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-[var(--color-line)] bg-[var(--color-canvas-soft)] px-6 pt-16 pb-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <div className="flex items-center gap-2 font-display font-semibold text-lg text-[var(--color-ink)] mb-4">
              <span className="w-8 h-8 rounded-xl bg-[linear-gradient(120deg,#5B5FEF,#3E3FC4)] flex items-center justify-center text-white text-sm">
                V
              </span>
              Vector
            </div>
            <p className="text-sm text-[var(--color-ink-faint)] max-w-xs leading-relaxed">
              An AI career operating system that turns uncertainty about the future into a plan you can act on today.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-medium text-sm text-[var(--color-ink)] mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-[var(--color-ink-faint)] hover:text-[var(--color-indigo)] transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 pt-6 border-t border-[var(--color-line)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-ink-faint)]">© {new Date().getFullYear()} Vector. Built for students who plan ahead.</p>
          <div className="flex gap-6 text-xs text-[var(--color-ink-faint)]">
            <a href="#" className="hover:text-[var(--color-ink)]">Privacy</a>
            <a href="#" className="hover:text-[var(--color-ink)]">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
