import React from 'react';
import { useSelector } from 'react-redux';
import ProfileCard from '../components/ProfileCard';
import Notification from '../components/Notification';

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const company = useSelector((state) => state.company.profile);

  return (
    <div>
      <h2>Dashboard</h2>
      <ProfileCard user={user} company={company} />
      <Notification />
    </div>
  );
};

export default Dashboard;
