import React from "react";
import { manageSplitStatus as statuses } from "../../../models/constants";

const MainButton = ({ text, onClick }) => (
  <button onClick={onClick} className="btn">
    {text}
  </button>
);
export default function MainButtons({
  status,
  addItem,
  addSave,
  addCancel,
  orderItems,
  orderSave,
  orderCancel,
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
      buttons.push(
        <MainButton onClick={addSave} text="Save" />,
        <MainButton onClick={addCancel} text="Cancel" />
      );
      break;
    case statuses.ORDERING:
      buttons.push(
        <MainButton onClick={orderSave} text="Save" />,
        <MainButton onClick={orderCancel} text="Cancel" />
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
