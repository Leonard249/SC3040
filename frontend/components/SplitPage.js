"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AiOutlineDelete } from 'react-icons/ai'; // Import the delete icon

// Constants
const ITEM_TYPE = 'ITEM';

// Draggable Item component
const Item = ({ id, name, amount, assignedCount, onDelete }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { id, name, amount },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Calculate the amount per member
  const displayAmount = assignedCount > 0 ? (amount / assignedCount).toFixed(2) : amount.toFixed(2);

  return (
    <div
      ref={drag}
      className={`flex justify-between items-center p-2 mb-2 bg-blue-500 text-white rounded ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <span>{name} - ${displayAmount}</span>
      <button onClick={() => onDelete(id)} className="text-red-500 hover:text-red-700">
        <AiOutlineDelete />
      </button>
    </div>
  );
};

// Droppable Member component
const Member = ({ member, onDropItem, assignedItems, onDeleteItem }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item) => onDropItem(item, member),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`p-4 bg-gray-100 rounded ${isOver ? 'bg-green-300' : ''}`}
    >
      <p className="text-center">Member {member}</p>
      <div className="mt-2">
        {assignedItems.map((item) => (
          <Item
            key={item.id}
            id={item.id}
            name={item.name}
            amount={item.amount}
            assignedCount={item.assignedCount}
            onDelete={() => onDeleteItem(member, item)}
          />
        ))}
      </div>
    </div>
  );
};

// Modal component for manual input
const ManualInputModal = ({ isOpen, onClose, onAddItem }) => {
  const [itemName, setItemName] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (itemName && amount) {
      onAddItem({ id: Date.now(), name: itemName, amount: parseFloat(amount), assignedCount: 0 });
      setItemName('');
      setAmount('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Add Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Item Name</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="bg-gray-500 text-white py-2 px-4 rounded mr-2">
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SplitPage = () => {
  const router = useRouter();
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1', amount: 10, assignedCount: 0 },
    { id: 2, name: 'Item 2', amount: 20, assignedCount: 0 },
    { id: 3, name: 'Item 3', amount: 15, assignedCount: 0 },
    { id: 4, name: 'Item 4', amount: 25, assignedCount: 0 },
    { id: 5, name: 'Item 5', amount: 30, assignedCount: 0 },
    { id: 6, name: 'Item 6', amount: 5, assignedCount: 0 },
  ]);

  const [members, setMembers] = useState([
    { id: 1, items: [] },
    { id: 2, items: [] },
    { id: 3, items: [] },
    { id: 4, items: [] },
    { id: 5, items: [] },
    { id: 6, items: [] },
  ]);

  const [modalOpen, setModalOpen] = useState(false);

  const handleDropItem = (item, member) => {
    setMembers((prevMembers) => {
      return prevMembers.map((m) => {
        if (m.id === member) {
          const existingItem = m.items.find(i => i.id === item.id);
          if (!existingItem) {
            // If the item is not already assigned, add it with assignedCount of 1
            const updatedItems = [...m.items, { ...item, assignedCount: 1 }];
            return { ...m, items: updatedItems };
          } else {
            // If already assigned, increment the assignedCount for all members
            const updatedItems = m.items.map(i => {
              if (i.id === item.id) {
                return { ...i, assignedCount: i.assignedCount + 1 };
              }
              return i;
            });
            return { ...m, items: updatedItems };
          }
        }
        return m; // Return other members unchanged
      });
    });
  
    // Update the global items state to remove the assigned item
    setItems((prevItems) => prevItems.filter(i => i.id !== item.id));
  };
  

  const handleAddItem = (newItem) => {
    setItems((prevItems) => [...prevItems, newItem]);
  };

  const handleDeleteItem = (memberId, itemToDelete) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${itemToDelete.name}?`);
    if (confirmDelete) {
      setMembers((prevMembers) =>
        prevMembers.map((m) => {
          if (m.id === memberId) {
            return {
              ...m,
              items: m.items.filter(i => i.id !== itemToDelete.id),
            };
          }
          return m;
        })
      );
  
      // Update the item in the items state to reflect the decrement of assignedCount
      setItems((prevItems) =>
        prevItems.map((i) => {
          if (i.id === itemToDelete.id) {
            return { ...i, assignedCount: Math.max(0, i.assignedCount - 1) }; // Ensure it does not go below 0
          }
          return i;
        })
      );
    }
  };
  

  const handleRescan = () => {
    router.push('/scan-receipt'); // Navigate back to the Scan Receipt page
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="split-page flex justify-center items-center h-screen">
        {/* Left section for the receipt */}
        <div className="receipt-section p-6 border">
          <h2 className="text-xl font-semibold mb-4">The receipt you provided</h2>
          {/* Add receipt image and details here */}
          <img src="/path/to/receipt-image" alt="Receipt" className="mb-4" />
          <button
            onClick={handleRescan}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Rescan Receipt
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-500 text-white py-2 px-4 rounded ml-2"
          >
            Add Item Manually
          </button>

          <h2 className="text-xl font-semibold mt-4">Items</h2>
          {items.map((item) => (
            <Item
              key={item.id}
              id={item.id}
              name={item.name}
              amount={item.amount}
              assignedCount={item.assignedCount} // Pass the assigned count
              onDelete={handleDeleteItem} // Pass the handleDeleteItem function
            />
          ))}
        </div>

        {/* Right section for members */}
        <div className="members-section p-6 border">
          <h2 className="text-xl font-semibold mb-4">Members</h2>
          {members.map((member) => (
            <Member
              key={member.id}
              member={member.id}
              onDropItem={handleDropItem}
              assignedItems={member.items}
              onDeleteItem={handleDeleteItem} // Pass the handleDeleteItem function
            />
          ))}
        </div>
      </div>

      {/* Manual Input Modal */}
      <ManualInputModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onAddItem={handleAddItem} />
    </DndProvider>
  );
};

export default SplitPage;