import React, { useEffect, useState } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    company: { name: '' },
    address: { street: '', city: '', state: '', zipcode: '' },
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5555/api/users')
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error('Error fetching users:', err));
  }, []);

  const handleInputChange = (e, userStateSetter) => {
    const { name, value } = e.target;

    userStateSetter((prev) => {
      if (name.startsWith('address.')) {
        const field = name.split('.')[1];
        return {
          ...prev,
          address: {
            ...prev.address,
            [field]: value,
          },
        };
      } else if (name === 'company.name') {
        return {
          ...prev,
          company: { name: value },
        };
      } else {
        return { ...prev, [name]: value };
      }
    });
  };

  const handleAddUser = (e) => {
    e.preventDefault();

    fetch('http://localhost:5555/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    })
      .then((res) => res.json())
      .then((addedUser) => {
        setUsers((prevUsers) => [...prevUsers, addedUser]);
        setNewUser({
          name: '',
          email: '',
          phone: '',
          company: { name: '' },
          address: { street: '', city: '', state: '', zipcode: '' },
        });
      })
      .catch((err) => console.error('Error adding user:', err));
  };

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setEditUser(JSON.parse(JSON.stringify(user))); // deep copy
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditUser(null);
  };

  const handleSaveEdit = () => {
    fetch(`http://localhost:5555/api/users/${editingUserId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editUser),
    })
      .then((res) => res.json())
      .then((updatedUser) => {
        setUsers((prev) =>
          prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
        );
        setEditingUserId(null);
        setEditUser(null);
      })
      .catch((err) => console.error('Error updating user:', err));
  };

  const handleDeleteUser = (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    fetch(`http://localhost:5555/api/users/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setUsers((prev) => prev.filter((user) => user.id !== id));
      })
      .catch((err) => console.error('Error deleting user:', err));
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <h1>User Directory</h1>

      <form onSubmit={handleAddUser} style={{ marginBottom: '20px' }}>
        <h2>Add New User</h2>
        <input name="name" value={newUser.name} onChange={(e) => handleInputChange(e, setNewUser)} placeholder="Name" required />
        <input name="email" value={newUser.email} onChange={(e) => handleInputChange(e, setNewUser)} placeholder="Email" required />
        <input name="phone" value={newUser.phone} onChange={(e) => handleInputChange(e, setNewUser)} placeholder="Phone" required />
        <input name="company.name" value={newUser.company.name} onChange={(e) => handleInputChange(e, setNewUser)} placeholder="Company" />
        <input name="address.street" value={newUser.address.street} onChange={(e) => handleInputChange(e, setNewUser)} placeholder="Street" />
        <input name="address.city" value={newUser.address.city} onChange={(e) => handleInputChange(e, setNewUser)} placeholder="City" />
        <input name="address.state" value={newUser.address.state} onChange={(e) => handleInputChange(e, setNewUser)} placeholder="State" />
        <input name="address.zipcode" value={newUser.address.zipcode} onChange={(e) => handleInputChange(e, setNewUser)} placeholder="Zipcode" />
        <button type="submit" style={{ display: 'block', marginTop: '10px' }}>
          Add User
        </button>
      </form>

      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: '8px', marginBottom: '16px', width: '100%' }}
      />

      <ul>
        {filteredUsers.map((user) => (
          <li key={user.id} style={{ marginBottom: '20px' }}>
            {editingUserId === user.id ? (
              <>
                <input name="name" value={editUser.name} onChange={(e) => handleInputChange(e, setEditUser)} />
                <input name="email" value={editUser.email} onChange={(e) => handleInputChange(e, setEditUser)} />
                <input name="phone" value={editUser.phone} onChange={(e) => handleInputChange(e, setEditUser)} />
                <input name="company.name" value={editUser.company.name} onChange={(e) => handleInputChange(e, setEditUser)} />
                <input name="address.street" value={editUser.address.street} onChange={(e) => handleInputChange(e, setEditUser)} />
                <input name="address.city" value={editUser.address.city} onChange={(e) => handleInputChange(e, setEditUser)} />
                <input name="address.state" value={editUser.address.state} onChange={(e) => handleInputChange(e, setEditUser)} />
                <input name="address.zipcode" value={editUser.address.zipcode} onChange={(e) => handleInputChange(e, setEditUser)} />
                <button onClick={handleSaveEdit}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <strong>{user.name}</strong>
                <br />
                Email: {user.email}
                <br />
                Phone: {user.phone}
                <br />
                Company: {user.company.name}
                <br />
                Address: {user.address.street} | {user.address.city} | {user.address.state} | {user.address.zipcode}
                <br />
                <button onClick={() => handleEditClick(user)}>Edit</button>
                <button onClick={() => handleDeleteUser(user.id)} style={{ marginLeft: '10px' }}>
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
