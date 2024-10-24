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
    const originalamount = item.originalamount; // Use the original amount from the item
    setMembers((prevMembers) => {
      // Calculate how many members currently have this item
      const alreadyAssignedMembers = prevMembers.filter((m) =>
        m.items.some((i) => i.id === item.id)
      );

      // Calculate the total assigned count including the current member
      const totalAssignedCount =
        alreadyAssignedMembers.length +
        (alreadyAssignedMembers.some((m) => m.username === member) ? 0 : 1);

      // Calculate the new split amount
      const splitAmount = originalamount / totalAssignedCount;

      return prevMembers.map((m) => {
        // Check if the current member is the one receiving the drop
        if (m.username === member) {
          const existingItem = m.items.find((i) => i.id === item.id);

          // Case 1: Item is already assigned to the same member
          if (existingItem) {
            return m; // Do nothing since the item is already assigned to this member
          }

          // Add this item to the current member's assigned items
          return {
            ...m,
            items: [
              ...m.items,
              { ...item, amount: splitAmount, assignedCount: 1 }, // Add with split amount
            ],
          };
        }

        // Case 2: Update the amounts for other members who already have this item
        const isItemAlreadyAssigned = m.items.find((i) => i.id === item.id);
        if (isItemAlreadyAssigned) {
          return {
            ...m,
            items: m.items.map((i) =>
              i.id === item.id ? { ...i, amount: splitAmount } : i
            ),
          };
        }

        return m; // Return unchanged if no action is taken
      });
    });

    // Remove the item from the unassigned list
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
            originalamount={item.originalamount}
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
