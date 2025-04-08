'use client'
import { Pin } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import NoteCard from '../app/components/NoteCard';
import { use, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

type Note = {
  id: string,
  title: string;
  content: string;
  isPinned: boolean;
};

type NoteInput = {
  user_id: string;
  title: string;
  content: string;
  isPinned: boolean;
}

interface TokenPayload {
  id: string
  email: string
  exp: number
}
export default function Home() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [notes, setNotes] = useState<Note[] | undefined>(undefined)

  useEffect(() => {
    const token = localStorage.getItem('jwtToken')

    if (!token) {
      router.push('/login')
      return
    }

    try {
      const decoded = jwtDecode<TokenPayload>(token)
      setUserId(decoded.id)
      setEmail(decoded.email)

      console.log('Decoded token:', decoded)
      const isExpired = decoded.exp * 1000 < Date.now()
      if (isExpired) {
        localStorage.removeItem('jwtToken')
        router.push('/login');
      }

    } catch (error) {
      console.error('Erro ao decodificar o token:', error)
      localStorage.removeItem('jwtToken')
      router.push('/login')
    }
  }, []);

  const fetchNotesById = async (userId: string | null): Promise<void> => {
    if (!userId) return;

    try {
      const res = await fetch(`http://localhost:5000/note/${userId}`);

      if (!res.ok) {
        console.error(`Erro ao buscar notas: ${res.statusText}`);
        setNotes([]);
        return;
      }

      const response = await res.json();

      if (!Array.isArray(response) || response.length === 0) {
        console.warn('Nenhuma nota encontrada para este usuário.');
        setNotes([]);
      } else {
        const normalizedNotes = response.map((note: any) => ({
          ...note,
          isPinned: Boolean(note.isPinned),
        }));
        setNotes(normalizedNotes);
      }
    } catch (error) {
      console.error('Erro ao buscar notas:', error);
      setNotes([]);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNotesById(userId);
    }
  }, [userId]);

  const updateNotes = async (id: string, updatedData: Partial<Note>): Promise<any> => {
    try {
      const res = await fetch(`http://localhost:5000/note/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      fetchNotesById(userId);

      if (!res.ok) {
        throw new Error('Falha ao atualizar nota');
      }

      const updatedNote = await res.json();
      setNotes(prevNotes =>
        prevNotes?.map(note =>
          note.id === id ? { ...note, ...updatedNote } : note
        )
      );
      return updatedNote;
    } catch (error) {
      console.error('Erro ao atualizar nota:', error);
      throw error;
    }
  };

  const deleteNotes = async (id: string): Promise<any> => {
    try {
      const res = await fetch(`http://localhost:5000/note/${id}`, {
        method: 'DELETE',
      });
      fetchNotesById(userId);
      if (!res.ok) {
        throw new Error('Falha ao deletar nota');
      }

      setNotes(prevNotes => prevNotes?.filter(note => note.id !== id));
      return await res.json();
    } catch (error) {
      console.error('Erro ao deletar nota:', error);
      throw error;
    }
  };

  const handleUpdateNote = async (id: string, updatedData: Partial<Note>) => {
    try {
      await updateNotes(id, updatedData);
    } catch (error) {
      console.error('Erro ao atualizar nota:', error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNotes(id);
    } catch (error) {
      console.error('Erro ao deletar nota:', error);
    }
  };

  const searchParams = useSearchParams();
  const query = searchParams.get('query');

  const [newNote, setNewNote] = useState({
    user_id: userId,
    title: '',
    content: '',
    isPinned: false
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const createNotes = async (noteData: NoteInput): Promise<any> => {
    const res = await fetch('http://localhost:5000/note/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData),
    });
    const data = await res.json();
    console.log('Note created:', data);
    fetchNotesById(userId);
    return data;
  };

  const handleAddNote = () => {
    if (newNote.title.trim() === '' && newNote.content.trim() === '') return;
    if (userId) {
      createNotes({ ...newNote, user_id: userId });
    } else {
      console.error('User ID is null. Cannot create note.');
    }

    setNewNote({ user_id: userId, title: '', content: '', isPinned: false });
    setIsExpanded(false);
  };

  if (notes === undefined) return null;
  const filteredNotes = notes.filter(note =>
    !query ||
    note.title.toLowerCase().includes(query.toLowerCase()) ||
    note.content.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="ml-64 p-6">
      <div className="max-w-2xl mx-auto mb-8">
        <div className={`bg-[#202124] border border-[#5F6368] rounded-lg p-4 transition-all ${isExpanded ? 'shadow-lg' : 'hover:shadow-md'}`}>

          {isExpanded && (
            <input
              type="text"
              placeholder="Título"
              className="w-full bg-transparent text-white placeholder-[#9AA0A6] outline-none mb-2 font-medium"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            />
          )}
          <textarea
            placeholder="Criar nota..."
            className="w-full bg-transparent text-[#E8EAED] placeholder-[#9AA0A6] outline-none resize-none"
            rows={isExpanded ? 3 : 1}
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            onFocus={() => setIsExpanded(true)}
          />
          {isExpanded && (
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#5F6368]">
              <button
                className="text-[#9AA0A6] hover:text-white p-2 rounded-full"
                onClick={() => setNewNote({ ...newNote, isPinned: !newNote.isPinned })}
              >
                <Pin
                  className={`h-5 w-5 ${newNote.isPinned ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`}
                />
              </button>
              <button
                className="text-white bg-[#1A73E8] hover:bg-[#1765CC] px-4 py-2 rounded-md text-sm font-medium"
                onClick={handleAddNote}
              >
                Fechar
              </button>
            </div>
          )}
        </div>
      </div>

      {filteredNotes.some(note => note.isPinned) && (
        <section className="mb-8">
          <h2 className="text-sm font-medium text-[#9AA0A6] mb-4">FIXADAS</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredNotes
              .filter(note => note.isPinned)
              .map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onUpdate={handleUpdateNote}
                  onDelete={handleDeleteNote}
                />
              ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-sm font-medium text-[#9AA0A6] mb-4">OUTRAS NOTAS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredNotes
            .filter(note => !note.isPinned)
            .map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onUpdate={handleUpdateNote}
                onDelete={handleDeleteNote}
              />
            ))}
        </div>
      </section>
    </main>
  );
}