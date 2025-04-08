'use client'
import { useState } from 'react'
import { Pin, Trash2, Pencil } from 'lucide-react'

type Note = {
  id: string
  title: string
  content: string
  isPinned: boolean
}

interface Props {
  note: Note
  onUpdate: (id: string, updated: Partial<Note>) => void
  onDelete: (id: string) => void
}

export default function NoteCard({ note, onUpdate, onDelete }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [editedNote, setEditedNote] = useState(note)

  const handleSave = () => {
    if (
      editedNote.title.trim() !== note.title.trim() ||
      editedNote.content.trim() !== note.content.trim() ||
      editedNote.isPinned !== note.isPinned
    ) {
      onUpdate(note.id, editedNote)
    }
    setIsExpanded(false)
  }

  return (
    <div
      className={`bg-[#202124] border border-[#5F6368] rounded-lg p-4 cursor-pointer transition-all duration-200 ${
        isExpanded ? 'shadow-lg' : 'hover:shadow-md'
      }`}
      onClick={() => setIsExpanded(true)}
    >
      {isExpanded ? (
        <>
          <input
            type="text"
            value={editedNote.title}
            onChange={(e) => setEditedNote({ ...editedNote, title: e.target.value })}
            className="w-full bg-transparent text-white font-semibold mb-2 outline-none"
            placeholder="Título"
          />
          <textarea
            value={editedNote.content}
            onChange={(e) => setEditedNote({ ...editedNote, content: e.target.value })}
            rows={3}
            className="w-full bg-transparent text-[#E8EAED] outline-none resize-none mb-2"
            placeholder="Conteúdo..."
          />
          <div className="flex justify-between items-center border-t border-[#5F6368] pt-2 mt-2">
            <button
              className="text-[#9AA0A6] hover:text-white p-2 rounded-full"
              onClick={(e) => {
                e.stopPropagation()
                setEditedNote({ ...editedNote, isPinned: !editedNote.isPinned })
              }}
            >
              <Pin
                className={`h-5 w-5 ${editedNote.isPinned ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`}
              />
            </button>
            <div className="flex gap-2">
              <button
                className="text-white bg-[#1A73E8] hover:bg-[#1765CC] px-4 py-1 rounded-md text-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleSave()
                }}
              >
                Salvar
              </button>
              <button
                className="text-[#F28B82] hover:text-red-500 p-2"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(note.id)
                }}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-white font-semibold truncate mb-1">{note.title}</h3>
          <p className="text-[#E8EAED] text-sm line-clamp-4">{note.content}</p>
        </>
      )}
    </div>
  )
}
