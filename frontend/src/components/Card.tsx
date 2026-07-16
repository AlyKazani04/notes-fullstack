import type { Note } from "../types/Note"

const Card = ({ note }: { note: Note }) => {
  return (
    <article
      className="
      p-6
      bg-mist-900 border border-mist-700 rounded-2xl 
      transition-all duration-300 hover:border-sky-600 
      flex flex-col cursor-pointer"
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
