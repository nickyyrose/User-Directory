// src/components/UserForm.js
import React, { useState } from 'react';

function UserForm({ onAddUser }) {
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    company: { name: '' },
    address: { street: '', city: '', state: '', zipcode: '' },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setNewUser((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else if (name === 'company.name') {
      setNewUser((prev) => ({
        ...prev,
        company: { name: value },
      }));
    } else {
      setNewUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddUser(newUser);
    setNewUser({
      name: '',
      email: '',
      phone: '',
      company: { name: '' },
      address: { street: '', city: '', state: '', zipcode: '' },
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h2>Add New User</h2>
      <input name="name" value={newUser.name} onChange={handleInputChange} placeholder="Name" required />
      <input name="email" value={newUser.email} onChange={handleInputChange} placeholder="Email" required />
      <input name="phone" value={newUser.phone} onChange={handleInputChange} placeholder="Phone" required />
      <input name="company.name" value={newUser.company.name} onChange={handleInputChange} placeholder="Company" required />
      <input name="address.street" value={newUser.address.street} onChange={handleInputChange} placeholder="Street" />
      <input name="address.city" value={newUser.address.city} onChange={handleInputChange} placeholder="City" />
      <input name="address.state" value={newUser.address.state} onChange={handleInputChange} placeholder="State" />
      <input name="address.zipcode" value={newUser.address.zipcode} onChange={handleInputChange} placeholder="Zipcode" />
      <button type="submit" style={{ display: 'block', marginTop: '10px' }}>Add User</button>
    </form>
  );
}

export default UserForm;
