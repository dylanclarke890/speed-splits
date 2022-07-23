import React from "react";
import { editRunStatus as statuses } from "../../../services/reducers/editRunReducer";

const MainButton = ({ text, onClick }) => (
  <button onClick={onClick} className="btn">
    {text}
  </button>
);
export default function MainButtons({
  status,
  addItem,
  orderItems,
  save,
  cancel,
}) {
  const buttons = {
    add: { name: "Add", onClick: addItem },
    order: { name: "Reorder", onClick: orderItems },
    save: { name: "Save", onClick: save },
    cancel: { name: "Cancel", onClick: cancel },
  };

  const activeButtons = [];
  switch (status) {
    case statuses.INITIAL:
      activeButtons.push(buttons.add, buttons.order);
      break;
    case statuses.ADDING:
    case statuses.ORDERING:
      activeButtons.push(buttons.save, buttons.cancel);
      break;
    default:
      break;
  }
  return activeButtons.map((b) => (
    <MainButton key={b.name} onClick={b.onClick} text={b.name} />
  ));
}
