import React from 'react';
import { StaffRole } from '../../types/staff.types';
import { Badge } from '../common/Badge';

interface StaffRoleBadgeProps {
  role: StaffRole;
  size?: 'sm' | 'md';
}

export const StaffRoleBadge: React.FC<StaffRoleBadgeProps> = ({ role, size = 'sm' }) => {
  switch (role) {
    case 'Supervisor':
      return <Badge variant="rose" size={size}>Supervisor</Badge>;
    case 'Driver':
      return <Badge variant="blue" size={size}>Driver</Badge>;
    case 'Waste Collector':
    default:
      return <Badge variant="green" size={size}>Waste Collector</Badge>;
  }
};
