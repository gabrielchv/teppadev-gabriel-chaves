import React from "react";
import Note from "./../Components/Note";

function Main() {
  const [cardTitle, setCardTitle] = React.useState("");
  const [cardDescription, setCardDescription] = React.useState("");

  const cardTitleRef = React.useRef<HTMLInputElement>(null);
  const cardDescriptionRef = React.useRef<HTMLInputElement>(null);

  const [notes, setNotes] = React.useState<
    { title: string; description: string; id: number }[]
  >([]);

  function getNewCardData(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.name == "title") {
      setCardTitle(event.target.value);
    }
    if (event.target.name == "description") {
      setCardDescription(event.target.value);
    }
  }

  function deleteNote(id: number) {
    let tempNotes: { title: string; description: string; id: number }[] = [];
    notes.filter((note) => {
      if (note.id != id) tempNotes.push(note);
    });
    setNotes(tempNotes);
  }

  function setColor(event: React.MouseEvent<HTMLDivElement>) {
    const colorList = ["black", "danger", "primary", "success"];
    colorList.forEach((color) => {
      event.currentTarget.classList.add("borderSolid");
    });
  }

  function addNote() {
    if (notes.length == 0) {
      setNotes((currentNotes) => [
        ...currentNotes,
        {
          title: cardTitle,
          description: cardDescription,
          id: 0,
        },
      ]);
    } else {
      setNotes((currentNotes) => [
        ...currentNotes,
        {
          title: cardTitle,
          description: cardDescription,
          id: currentNotes[currentNotes.length - 1].id + 1,
        },
      ]);
    }
  }

  return (
    <div className="MainPage container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6">
          <div className="card border-success mx-1 my-2">
            <div className="card-body">
              <label className="card-title">Título: </label>
              <input
                ref={cardTitleRef}
                onChange={getNewCardData}
                name="title"
                className="form-control"
                type="text"
              />
              <label className="mt-2 card-text">Descrição</label>
              <input
                ref={cardDescriptionRef}
                onChange={getNewCardData}
                name="description"
                className="mb-2 form-control"
                type="text"
              />
              <label className="card-text">Cor: </label>
              <div className="colorsDiv d-flex">
                <div
                  onClick={setColor}
                  id="black"
                  className="colorSquare borderSolid bg-black me-2"
                ></div>
                <div
                  onClick={setColor}
                  id="danger"
                  className="colorSquare bg-danger me-2"
                ></div>
                <div
                  onClick={setColor}
                  id="success"
                  className="colorSquare bg-success me-2"
                ></div>
                <div
                  onClick={setColor}
                  id="primary"
                  className="colorSquare bg-primary me-2"
                ></div>
              </div>
              <a
                onClick={addNote}
                className="mt-2 btn btn-success w-100 float-end"
              >
                Adicionar
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4">
        {notes.map((note) => (
          <Note
            key={note.id}
            title={note.title}
            description={note.description}
            id={note.id}
            deleteNote={deleteNote}
          ></Note>
        ))}
      </div>
    </div>
  );
}

export default Main;
