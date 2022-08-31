import React from "react";

interface NoteProps {
  title: string;
  description: string;
  id: number;
  deleteNote: (id: number) => void;
}

const Note: React.FC<NoteProps> = ({
  title,
  description,
  id,
  deleteNote,
}: NoteProps) => {
  function localDeleteNote() {
    deleteNote(id);
  }

  return (
    <div className="col">
      <div className="card border-dark mx-1 my-2">
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
          <a
            onClick={localDeleteNote}
            className="btn btn-danger btn-sm float-end"
          >
            Deletar
          </a>
        </div>
      </div>
    </div>
  );
};

export default Note;
