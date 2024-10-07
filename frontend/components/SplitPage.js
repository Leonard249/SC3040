"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AiOutlineDelete } from 'react-icons/ai'; // Import the delete icon

// Constants
const ITEM_TYPE = 'ITEM';

// Draggable Item component
const Item = ({ id, name, amount, onDelete }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { id, name, amount },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`flex justify-between items-center p-2 mb-2 bg-blue-500 text-white rounded ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <span>{name} - ${amount}</span>
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
            key={item.id} // Use the unique id
            id={item.id} // Pass the unique id
            name={item.name}
            amount={item.amount}
            onDelete={() => onDeleteItem(member, item)} // Use the onDeleteItem passed down from SplitPage
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
      onAddItem({ id: Date.now(), name: itemName, amount: parseFloat(amount) }); // Generate a unique id
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
    { id: 1, name: 'Item 1', amount: 10 },
    { id: 2, name: 'Item 2', amount: 20 },
    { id: 3, name: 'Item 3', amount: 15 },
    { id: 4, name: 'Item 4', amount: 25 },
    { id: 5, name: 'Item 5', amount: 30 },
    { id: 6, name: 'Item 6', amount: 5 },
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
      const updatedMembers = prevMembers.map((m) => {
        if (m.id === member) {
          return { ...m, items: [...m.items, item] }; // Add to the new member
        } else {
          return { ...m, items: m.items.filter(i => i.id !== item.id) }; // Remove from the other members
        }
      });

      return updatedMembers.map((m) => {
        if (m.id === member) {
          const uniqueItems = Array.from(new Set(m.items.map(i => i.id)))
            .map(id => m.items.find(i => i.id === id));
          return { ...m, items: uniqueItems };
        }
        return m;
      });
    });

    // Remove the item from the items list if it's being moved from there
    setItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
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
            return { ...m, items: m.items.filter(i => i.id !== itemToDelete.id) };
          }
          return m;
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
            className="bg-red-500 text-white py-2 px-4 rounded"
          >
            Re-scan
          </button>
        </div>

        {/* Middle section for scanned items */}
        <div className="items-section p-6 border ml-6 mr-6">
          <h2 className="text-xl font-semibold mb-4">Scanned items</h2>
          <div className="drag-container grid grid-cols-1 gap-2">
            {items.map((item) => (
              <Item
                key={item.id}
                id={item.id}
                name={item.name}
                amount={item.amount}
                onDelete={() => setItems((prev) => prev.filter(i => i.id !== item.id))}
              />
            ))}
          </div>
        </div>

        {/* Right section for members */}
        <div className="split-section p-6 border">
          <h2 className="text-xl font-semibold mb-4">Drag and drop towards member's purchased items</h2>
          <div className="drag-container grid grid-cols-1 gap-4">
            {members.map((member) => (
              <Member
                key={member.id}
                member={member.id}
                assignedItems={member.items}
                onDropItem={handleDropItem}
                onDeleteItem={handleDeleteItem}
              />
            ))}
          </div>
          <div className="text-center mt-6">
            <button className="bg-green-500 text-white py-2 px-4 rounded mr-4">Go settle up</button>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-gray-500 text-white py-2 px-4 rounded"
            >
              Manual input
            </button>
          </div>
        </div>

        {/* Manual Input Modal */}
        <ManualInputModal 
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onAddItem={handleAddItem}
        />
      </div>
    </DndProvider>
  );
};

export default SplitPage;
