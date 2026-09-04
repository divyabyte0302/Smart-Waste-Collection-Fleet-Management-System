import React from 'react';
import { StaffStatus } from '../../types/staff.types';
import { Badge } from '../common/Badge';

interface StaffStatusBadgeProps {
  status: StaffStatus;
  size?: 'sm' | 'md';
}

export const StaffStatusBadge: React.FC<StaffStatusBadgeProps> = ({ status, size = 'sm' }) => {
  switch (status) {
    case 'On Duty':
      return <Badge variant="green" size={size}>On Duty</Badge>;
    case 'Available':
      return <Badge variant="blue" size={size}>Available</Badge>;
    case 'Assigned':
      return <Badge variant="amber" size={size}>Assigned</Badge>;
    case 'Inactive':
    default:
      return <Badge variant="slate" size={size}>Inactive</Badge>;
  }
};
