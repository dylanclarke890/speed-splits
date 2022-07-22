import React from "react";
import { editRunStatus as statuses } from "../../../models/constants";

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
  const buttons = [];
  switch (status) {
    case statuses.INITIAL:
      buttons.push(
        <MainButton onClick={addItem} text="Add" />,
        <MainButton onClick={orderItems} text="Reorder" />
      );
      break;
    case statuses.ADDING:
    case statuses.ORDERING:
      buttons.push(
        <MainButton onClick={save} text="Save" />,
        <MainButton onClick={cancel} text="Cancel" />
      );
      break;
    default:
      break;
  }
  return buttons.map((b) => (
    <MainButton
      key={b.props.text}
      onClick={b.props.onClick}
      text={b.props.text}
    />
  ));
}
