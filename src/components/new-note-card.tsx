//Pega todas as inforações e coloca dentro de Dialog
import * as Dialog from "@radix-ui/react-dialog"

import { Button } from "@radix-ui/themes";

import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";

import { toast } from "sonner";

//Importando de App
interface NewNoteCardProps {
  onNoteCreated: (content: string) => void
}

export function NewNoteCard( {onNoteCreated}: NewNoteCardProps ) {

  let speechRecognition: SpeechRecognition | null = null

  const [shouldShowOnBoarding, setShouldShowOnBoarding] = useState(true);

  const [isRecording, setIsRecording] = useState(false)

  const [content, setContent] = useState('');

  function handleStartEditor() {
    setShouldShowOnBoarding(false);
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {

    setContent(event.target.value);

    if(event.target.value === '') {
      setShouldShowOnBoarding(true);
    }
  }

  //Criando Nota
  function handleSaveNote(event: FormEvent) {

    event.preventDefault()

    if(content === '' ) {
      return
    }

    onNoteCreated(content)

    setContent('')

    setShouldShowOnBoarding(true)

    toast.success("Nota criada com sucesso!!!")
  }

  function handleStartRecording() {

    const isSpeechRecognitionAPIAvailable = 'SpeechReRecognition' in window || 'webkitSpeechRecognition' in window
    if(!isSpeechRecognitionAPIAvailable) {
      alert("Infelizmente seu navegador não suporta a API de gravação")
      return
    }

    setIsRecording(true);
    setShouldShowOnBoarding(false)

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

     speechRecognition = new SpeechRecognitionAPI();

    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce( (text, result) => {
        return text.concat(result[0].transcript)
      }, '')
      
    setContent(transcription)
    }

    speechRecognition.onerror = (event) => {
      console.error(event);
    }

    speechRecognition.start();
  
  }

  function handleStopRecording() {

    setIsRecording(false);

    if( speechRecognition != null) {
      speechRecognition.stop();
    }

  }
    return(

      <Dialog.Root>

        <Dialog.Trigger className="rounded-md flex flex-col bg-slate-700 text-left p-5 gap-3 hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none">

          <span className="text-xl font-medium text-lime-500">
            Adicionar Nota
          </span>

          <p className="text-sm leading-6 text-slate-400">
            Grave uma nota em áudio que será convertida para texto automaticamente
          </p>

        </Dialog.Trigger>

        <Dialog.Portal> 

          <Dialog.Overlay className="inset-0 fixed bg-black/50"/>

          <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full  md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">

            <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
              <X className="size-5" />
            </Dialog.Close>

            <form className="flex-1 flex flex-col ">
            
              <div className="flex flex-1 flex-col gap-3 p-5">

                <span className="text-sm font-medium text-slate-300">
                  Adicionar Nota
                </span>

                {shouldShowOnBoarding ? (
                  <p className="text-sm leading-6 text-slate-400">
                  Comece <Button type="button" onClick={handleStartRecording} className="font-medium text-lime-400 hover:underline"> gravando uma nota</Button> em áudio ou se preferir <Button type="button" className="font-medium text-lime-400 hover:underline"
                  onClick={handleStartEditor}>utilize apenas texto</Button>
                    </p>
                ) : (
                  <textarea 
                    autoFocus
                    className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                    onChange={handleContentChanged}
                    value={content}
                    />
                )}

              </div>

              {isRecording ?(
                <Button
                type="submit"
                onClick={handleStopRecording}
                className="w-full bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100 flex items-center justify-center gap-2"
              >
                <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                Gravando! (clique para parar)
              </Button>

              ) : (

              <Button
                type="button"
                onClick={handleSaveNote}
                className="w-56 m-auto rounded-3xl mb-10 bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-600"
              >
                Salvar nota
              </Button>)}
            
            </form>

          </Dialog.Content>

        </Dialog.Portal>
        
      </Dialog.Root>
        
    )

}