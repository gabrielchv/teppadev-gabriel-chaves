import React from "react";
import Note from "./../Components/Note";
import Navbar from "./../Components/Navbar";
import { useNavigate } from "react-router-dom";

function Main() {
  const [cardTitleValue, setCardTitleValue] = React.useState<string>("");
  const [cardDescriptionValue, setCardDescriptionValue] = React.useState<string>("");
  const [cardColor, setCardColor] = React.useState("dark");
  const [notes, setNotes] = React.useState<{ title: string; description: string; color: string; id: number }[]>([]);
  const [first, setFirst] = React.useState(true);

  let navigate = useNavigate();

  const darkRef = React.useRef<HTMLDivElement>(null);
  const dangerRef = React.useRef<HTMLDivElement>(null);
  const successRef = React.useRef<HTMLDivElement>(null);
  const primaryRef = React.useRef<HTMLDivElement>(null);

  const btnRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    async function getUserData() {
      const response = await fetch("/api/getnotes", {
        method: "GET",
      });
      const data = await response.json();
      if (!data.status) return navigate("/entrar");
      if (data.status) setNotes(data.notes);
    }
    getUserData();
  }, []);

  async function sendNotes() {
    if (first) setFirst(false);
    else {
      fetch("/api/registernotes", {
        method: "POST",
        body: JSON.stringify({
          notes: notes,
        }),
        headers: {
          "Content-type": "application/json",
        },
      });
    }
  }

  React.useEffect(() => {
    sendNotes();
  }, [notes]);

  function getNewCardData(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.name == "title") {
      setCardTitleValue(event.target.value);
    }
    if (event.target.name == "description") {
      setCardDescriptionValue(event.target.value);
    }
  }

  function deleteNote(id: number) {
    let tempNotes: { title: string; description: string; color: string; id: number }[] = [];
    notes.filter((note) => {
      if (note.id != id) tempNotes.push(note);
    });
    setNotes(tempNotes);
  }

  React.useEffect(() => {
    if (cardTitleValue == "" || cardDescriptionValue == "") {
      btnRef.current?.classList.add("disabled");
    } else {
      btnRef.current?.classList.remove("disabled");
    }
  }, [cardTitleValue, cardDescriptionValue]);

  function setColor(event: React.MouseEvent<HTMLDivElement>) {
    darkRef.current?.classList.remove("borderSolid");
    dangerRef.current?.classList.remove("borderSolid");
    successRef.current?.classList.remove("borderSolid");
    primaryRef.current?.classList.remove("borderSolid");

    event.currentTarget.classList.add("borderSolid");
    setCardColor(event.currentTarget.id);
  }

  function addNote() {
    if (notes.length == 0) {
      setNotes((currentNotes) => [...currentNotes, { title: cardTitleValue || "", description: cardDescriptionValue || "", color: cardColor, id: 0 }]);
    } else {
      setNotes((currentNotes) => [...currentNotes, { title: cardTitleValue || "", description: cardDescriptionValue || "", color: cardColor, id: currentNotes[currentNotes.length - 1].id + 1 }]);
    }
    setCardTitleValue("");
    setCardDescriptionValue("");
  }

  return (
    <div>
      <Navbar></Navbar>
      <div className="MainPage container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6">
            <div className="card mx-1 my-2">
              <div className="card-body">
                <label className="card-title">Título: </label>
                <input value={cardTitleValue} onChange={getNewCardData} name="title" className="form-control" type="text" />
                <label className="mt-2 card-text">Descrição</label>
                <input value={cardDescriptionValue} onChange={getNewCardData} name="description" className="mb-2 form-control" type="text" />
                <label className="card-text">Cor: </label>
                <div className="colorsDiv d-flex">
                  <div ref={darkRef} onClick={setColor} id="dark" className="colorSquare borderSolid bg-dark me-2"></div>
                  <div ref={dangerRef} onClick={setColor} id="warning" className="colorSquare bg-warning me-2"></div>
                  <div ref={successRef} onClick={setColor} id="success" className="colorSquare bg-success me-2"></div>
                  <div ref={primaryRef} onClick={setColor} id="primary" className="colorSquare bg-primary me-2"></div>
                </div>
                <button ref={btnRef} onClick={addNote} className="mt-2 btn btn-success w-100 float-end">
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4">
          {notes.map((note) => (
            <Note key={note.id} title={note.title} description={note.description} id={note.id} color={note.color} deleteNote={deleteNote}></Note>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Main;
