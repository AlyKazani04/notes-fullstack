import type { Note } from "../types/Note"

const Card = ({ note }: { note: Note }) => {
  return (
    <article
      className="p-6 bg-brand-bg border border-brand-border rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:border-brand-accent flex flex-col cursor-pointer"
    >
      <h2 className="text-xl font-semibold text-brand-heading line-clamp-2">
        {note.title}
      </h2>
      <p className="mt-3 text-sm text-brand-text line-clamp-3 leading-relaxed">
        {note.content}
      </p>
    </article>
  )
}

export default Card
