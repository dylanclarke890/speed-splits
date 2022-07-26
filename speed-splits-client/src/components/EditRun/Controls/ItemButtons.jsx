import React from "react";
import { editRunStatus as statuses } from "../../../services/reducers/editRunReducer";

const ItemButton = ({ text, onClick }) => (
  <button onClick={onClick} className="app-link">
    {text}
  </button>
);

export default function ItemButtons({
  index,
  selectedItem,
  status,
  editItem,
  deleteItem,
  save,
  cancel,
}) {
  const buttons = {
    editItem: { name: "Edit", onClick: () => editItem(index) },
    deleteItem: { name: "Delete", onClick: () => deleteItem(index) },
    save: { name: "Save", onClick: save },
    cancel: { name: "Cancel", onClick: cancel },
  };

  const activeButtons = [];
  switch (status) {
    case statuses.INITIAL:
      activeButtons.push(buttons.editItem, buttons.deleteItem);
      break;
    case statuses.EDITING:
      if (index === selectedItem)
        activeButtons.push(buttons.save, buttons.cancel);
      break;
    default:
      break;
  }

  return activeButtons.map((b) => (
    <ItemButton key={b.name} onClick={b.onClick} text={b.name} />
  ));
}
