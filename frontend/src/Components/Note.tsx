import React from "react";

interface NoteProps {
  title: string;
  description: string;
  color: string;
  id: number;
  deleteNote: (id: number) => void;
}

const Note: React.FC<NoteProps> = ({ title, description, id, deleteNote, color }: NoteProps) => {
  const [cardClass, setCardClass] = React.useState<string>("");
  React.useEffect(() => {
    setCardClass("card border-" + color + " mx-1 my-2");
  });

  function localDeleteNote() {
    deleteNote(id);
  }

  return (
    <div className="col">
      <div className={cardClass}>
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
          <a onClick={localDeleteNote} className="btn btn-danger btn-sm float-end">
            Deletar
          </a>
        </div>
      </div>
    </div>
  );
};

export default Note;
