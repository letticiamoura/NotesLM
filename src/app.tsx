
import { ChangeEvent, useState } from "react";
import { NewNoteCard } from "./components/new-note-card";
import { NoteCard } from "./components/note-card";

import logo from "./assets/favicon.png"

interface Note {
  id: string,
  date: Date,
  content: string,
}

export function App() {

  const [search, setSearch] = useState('');

  const [notes, setNotes] = useState<Note[]>(() => { 
    const notesOnStorage = localStorage.getItem('notes')
    if (notesOnStorage) {
      return JSON.parse(notesOnStorage)
    }
    return []
  })

  //Função para criar nota
  function onNoteCreated(content: string) {

    const newNote = {

      id: crypto.randomUUID(),
      date: new Date(),
      content,

    }

    const notesArray = [newNote, ... notes]
    
    setNotes(notesArray)

    //JSON Vai converter o array em String
    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {

    const query = event.target.value

    setSearch(query)

  }

  function onNoteDeleted(id: string) {
    const notesArray = notes.filter(note => {
      return note.id != id
    })
    setNotes(notesArray);
    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  //Filtrando as notas
  const filteredNotes = search !== '' ? notes.filter(note => note.content.toLocaleLowerCase().includes(search)) : notes

  return (

    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">

      <div className="flex justify-start gap-5">

      <img src={logo} alt="logo" className="opacity-50 hover:opacity-100" />

      <h1 className="text-slate-500 font-helvetica text-2xl pt-5">Notes | LM</h1>

      </div>

      <form className="w-full">

        <input 
        type="text" 
        placeholder="Busque em suas notas"
        className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder: text-slate-500"
        onChange={handleSearch}
        />

      </form>

      <div className="h-px bg-slate-700"/>

        <div className="grid rid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] gap-6 text-left">

          <NewNoteCard onNoteCreated={onNoteCreated} />
          
          {filteredNotes.map(note =>{
            return <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />
          })}

        </div>

      </div>

    )
  
}