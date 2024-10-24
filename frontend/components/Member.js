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
    setMembers((prevMembers) => {
      // Find out if the item is already assigned to another member
      const isAlreadyAssignedToAnother = prevMembers.some((m) =>
        m.items.find((i) => i.id === item.id && m.username !== member)
      );

      return prevMembers.map((m) => {
        if (m.username === member) {
          const existingItem = m.items.find((i) => i.id === item.id);

          // Case 1: Item is already assigned to the same member, increase assignedCount
          if (existingItem) {
            return {
              ...m,
              items: m.items.map((i) =>
                i.id === item.id
                  ? { ...i, assignedCount: i.assignedCount + 1 }
                  : i
              ),
            };
          }

          // Case 2: Item is assigned to another member, update amount for the new member
          if (isAlreadyAssignedToAnother) {
            const otherMember = prevMembers.find((m) =>
              m.items.find((i) => i.id === item.id && m.username !== member)
            );

            if (otherMember) {
              const originalItem = otherMember.items.find(
                (i) => i.id === item.id
              );

              // Check if the originalItem exists to avoid accessing undefined properties
              if (originalItem) {
                const originalamount = originalItem.amount;
                const newAmount = originalamount / 2;

                return {
                  ...m,
                  items: [
                    ...m.items,
                    { ...item, amount: newAmount, assignedCount: 1 },
                  ],
                };
              }
            }
          }

          // Case 3: Item is assigned to the member for the first time
          return {
            ...m,
            items: [...m.items, { ...item, assignedCount: 1 }],
          };
        }

        // Case 4: If the item is already with another member, update their amount
        if (isAlreadyAssignedToAnother) {
          return {
            ...m,
            items: m.items.map((i) =>
              i.id === item.id ? { ...i, amount: i.amount / 2 } : i
            ),
          };
        }

        return m;
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
