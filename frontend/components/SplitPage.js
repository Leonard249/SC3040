"use client";
import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AiOutlineDelete } from 'react-icons/ai'; // Import the delete icon
import { useSearchParams } from 'next/navigation';
import apiClient from "@/app/axios";

// Constants
const ITEM_TYPE = 'ITEM';

// Item component
const Item = ({ id, name, amount, assignedCount, onDelete, onPutBack }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { id, name, amount },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Calculate display amount based on assigned count
  const displayAmount = assignedCount > 0 ? (amount / assignedCount).toFixed(2) : amount.toFixed(2);

  const handleDelete = () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${name}?`);
    if (confirmDelete) {
      onDelete(id);
    }
  };

  return (
    <div
      ref={drag}
      className={`flex justify-between items-center p-2 mb-2 bg-blue-500 text-white rounded ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <span>{name} - ${displayAmount}</span>
      <div>
        <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
          <AiOutlineDelete />
        </button>
        {assignedCount > 0 && (
          <button onClick={() => onPutBack({ id, name, amount })} className="text-green-500 hover:text-green-700 ml-2">
            Put Back
          </button>
        )}
      </div>
    </div>
  );
};




// Member component
const Member = ({ member, onDropItem, assignedItems, onDeleteItem, onPutBackItem }) => {
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
      className={`p-4 bg-gray-100 rounded mb-2 border-b-2 ${isOver ? 'bg-green-300' : ''}`}
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
            onDelete={() => onDeleteItem(member, item)} // Pass member and item
            onPutBack={() => onPutBackItem(item)}
          />
        ))}
      </div>
    </div>
  );
};






const ManualInputModal = ({ isOpen, onClose, onAddItem }) => {
  const [itemName, setItemName] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (itemName && amount) {
      const newItem = {
        id: Date.now(),
        name: itemName,
        amount: parseFloat(amount),
        assignedCount: 0,
      };
      console.log("Adding item:", newItem);
      onAddItem(newItem);
      setItemName('');
      setAmount('');
      onClose();
    } else {
      alert("Please fill in all fields");
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


// Main SplitPage component
const SplitPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const groupId = searchParams.get('groupId'); 
  const [items, setItems] = useState([]);

  const [members, setMembers] = useState([]);

  const [image, setImage] = useState('');

  const convertDataURIToPlainText = (dataURI) => {
    // Check if the dataURI is valid and includes base64 encoding
    if (dataURI.includes('base64,')) {
      // Split the dataURI at 'base64,' and return only the base64 string part
      return dataURI.split('base64,')[1];
    }
    // If the dataURI does not contain 'base64,', return it unchanged or handle error
    return '';
  };


  useEffect(() => {
    const base64data = localStorage.getItem('base64File');
    setImage(base64data);

    // Function to handle OCR scan
    const ocrScan = () => {
      return apiClient.post('/v1/ocr/scan', {
        image: convertDataURIToPlainText(base64data),
      });
    };

    // Function to fetch group members
    const fetchMembers = () => {
      //TODO: convert groupId
      let groupId = "670761b7f7d1a0abedfdb6e8"
      return apiClient.get(`/v1/groups/get_user/${groupId}`);
    };

    // Execute both API requests in parallel using Promise.all
    Promise.all([ocrScan(), fetchMembers()])
        .then(([ocrResponse, membersResponse]) => {
          // Handle OCR Scan response
          if (ocrResponse.status === 200) {
            const formattedItems = ocrResponse.data.data.map((item, index) => ({
              id: index + 1,
              name: item.item,
              amount: item.price,
              assignedCount: 0,
            }));
            setItems(formattedItems);
            alert('OCR Scan Successful');
          } else {
            alert('OCR Scan Failed');
          }

          // Handle Members response
          if (Array.isArray(membersResponse.data.data)) {
            const formattedMembers = membersResponse.data.data.map((member) => ({
              id: member._id,
              username: member.username,
              items: [],
            }));
            setMembers(formattedMembers);
          } else {
            console.error("membersResponse.data is not an array:", membersResponse.data);
          }
        })
        .catch((error) => {
          console.error('Error occurred during API requests:', error);
        });
  }, [groupId]);

  const [modalOpen, setModalOpen] = useState(false);

  const handleDropItem = (item, member) => {
    setMembers((prevMembers) =>
      prevMembers.map((m) => {
        console.log(m)
        if (m.id === member) {
          const existingItem = m.items.find(i => i.id === item.id);
          if (!existingItem) {
            return { ...m, items: [...m.items, { ...item, assignedCount: 1 }] };
          } else {
            return {
              ...m,
              items: m.items.map(i =>
                i.id === item.id ? { ...i, assignedCount: i.assignedCount + 1 } : i
              ),
            };
          }
        }
        return m; 
      })
    );

    setItems((prevItems) => prevItems.filter(i => i.id !== item.id));
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
  
      setItems((prevItems) =>
        prevItems.map((i) => {
          if (i.id === itemToDelete.id) {
            return { ...i, assignedCount: Math.max(0, i.assignedCount - 1) };
          }
          return i;
        })
      );
    }
  };
  

  const handlePutBack = (item) => {
    setMembers((prevMembers) => 
      prevMembers.map((m) => {
        if (m.items.find(i => i.id === item.id)) {
          return {
            ...m,
            items: m.items.filter(i => i.id !== item.id),
          };
        }
        return m; 
      })
    );

    setItems((prevItems) => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems; 
      }
      return [...prevItems, { ...item, assignedCount: 0 }];
    });
  };


  const handleRescan = () => {
    router.push('/scan-receipt'); 
  };

  const handleAddItem = (newItem) => {
    console.log("New item added:", newItem); // Debugging line
    setItems((prevItems) => [...prevItems, newItem]);
  };
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex justify-center items-center h-screen relative">
        <div className="absolute top-20 z-10">
          <h2 className="text-xl font-semibold mb-4">
            Receipt for group: <span className="text-red-500">{groupId}</span>
          </h2>
        </div>
        <div className="split-page flex justify-center items-center h-screen">
          {/* Receipt Section */}
          <div className="receipt-section p-6 border">
            <h2 className="text-xl font-semibold mb-4">The receipt you provided</h2>
            <img src={image} alt="Receipt" className="mb-4" />
  
            {/* Buttons Wrapper with Flexbox */}
            <div className="flex gap-4 mb-4"> {/* Added flex and gap for spacing */}
              <button onClick={handleRescan} className="bg-red-500 text-white py-3 px-6 rounded">
                Rescan Receipt
              </button>
              <button onClick={() => setModalOpen(true)} className="bg-black text-white py-3 px-6 rounded">
                Add Item Manually
              </button>
            </div>
  
            <ManualInputModal 
              isOpen={modalOpen} 
              onClose={() => setModalOpen(false)} 
              onAddItem={handleAddItem} 
            />
            {/* Displaying Items */}
            {items.map(item => (
              <Item
                key={item.id}
                id={item.id}
                name={item.name}
                amount={item.amount}
                assignedCount={item.assignedCount}
                onDelete={() => handleDeleteItem(member.id, item)} // This line is causing the error
                onPutBack={handlePutBack}
              />
            ))}
          </div>
  
          {/* Members Section */}
          <div className="members-section p-6 border ml-4">
            <h2 className="text-xl font-semibold mb-4">Members</h2>
            {members.map((member) => (
              <Member
                key={member.id}
                member={member.id}
                onDropItem={handleDropItem}
                assignedItems={member.items}
                onDeleteItem={handleDeleteItem}
                onPutBackItem={handlePutBack}
              />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
  
};  

export default SplitPage;
