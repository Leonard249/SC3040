import React from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import Item from "./Item";

// Member component
const Member = ({ member, assignedItems, ITEM_TYPE, setMembers, setItems }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item) => handleDropItem(item, member),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleDropItem = (item, member) => {
    setMembers((prevMembers) =>
      prevMembers.map((m) => {
        console.log(m);
        if (m.username === member) {
          const existingItem = m.items.find((i) => i.id === item.id);
          if (!existingItem) {
            return { ...m, items: [...m.items, { ...item, assignedCount: 1 }] };
          } else {
            return {
              ...m,
              items: m.items.map((i) =>
                i.id === item.id
                  ? { ...i, assignedCount: i.assignedCount + 1 }
                  : i
              ),
            };
          }
        }
        return m;
      })
    );

    setItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
  };

  const handleDeleteItem = (id) => {
    // Update the member list and remove the item from the assigned list
    setMembers((prevMembers) =>
      prevMembers.map((m) => ({
        ...m,
        items: m.items.filter((i) => i.id !== id),
      }))
    );

    // Update the global items list by filtering out the item
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <div
      ref={drop}
      className={`p-4 bg-yellow-100 shadow-s rounded mb-2 border-b-2 ${
        isOver ? "bg-green-300" : ""
      }`}
    >
      <p className="text-center">{member}</p>
      <div className="mt-2">
        {assignedItems.map((item) => (
          <Item
            key={item.id}
            id={item.id}
            name={item.name}
            amount={item.amount}
            assignedCount={item.assignedCount}
            ITEM_TYPE={ITEM_TYPE}
            setMembers={setMembers}
            item={item}
            setItems={setItems}
            onDelete={handleDeleteItem}
          />
        ))}
      </div>
    </div>
  );
};

export default Member;
