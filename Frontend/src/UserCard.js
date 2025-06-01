// src/components/UserCard.js
import React from 'react';

function UserCard({ user }) {
  return (
    <li style={{ marginBottom: '20px' }}>
      <strong>{user.name}</strong><br />
      Email: {user.email}<br />
      Phone: {user.phone}<br /><br />
      Company: {user.company.name}<br />
      <div>
        Address: {user.address.state}
        <span style={{ margin: '0 8px' }}>|</span>
        {user.address.street}
        <span style={{ margin: '0 8px' }}>|</span>
        {user.address.city}
        <span style={{ margin: '0 8px' }}>|</span>
        {user.address.zipcode}
      </div>
    </li>
  );
}

export default UserCard;
