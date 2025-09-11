import React from 'react';

const ProfileCard = ({ user, company }) => (
  <div className="profile-card">
    <h2>User Profile</h2>
    <p>Name: {user?.full_name}</p>
    <p>Email: {user?.email}</p>
    <p>Mobile: {user?.mobile_no}</p>
    <h2>Company Profile</h2>
    <p>Company: {company?.company_name}</p>
    <p>Industry: {company?.industry}</p>
    <p>Address: {company?.address}</p>
    {/* Add more fields as needed */}
  </div>
);

export default ProfileCard;
