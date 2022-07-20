import React from "react";
import { manageSplitStatus as statuses } from "../../../models/constants";

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
  editSave,
  editCancel,
  deleteItem,
  deleteConfirm,
  deleteCancel,
}) {
  const buttons = [];
  const isSelected = index === selectedItem;
  switch (status) {
    case statuses.INITIAL:
      buttons.push(
        <ItemButton text="Edit" onClick={() => editItem(index)} />,
        <ItemButton text="Delete" onClick={() => deleteItem(index)} />
      );
      break;
    case statuses.EDITING:
      if (isSelected) {
        buttons.push(
          <ItemButton text="Save" onClick={editSave} />,
          <ItemButton text="Cancel" onClick={editCancel} />
        );
      }
      break;
    case statuses.DELETING:
      if (isSelected)
        buttons.push(
          <ItemButton text="Confirm" onClick={deleteConfirm} />,
          <ItemButton text="Cancel" onClick={deleteCancel} />
        );
      break;
    default:
      break;
  }

  return buttons.map((b) => (
    <ItemButton
      key={b.props.text}
      onClick={b.props.onClick}
      text={b.props.text}
    />
  ));
}
