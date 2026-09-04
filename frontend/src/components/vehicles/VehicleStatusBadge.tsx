import React from 'react';
import { VehicleStatus } from '../../types/vehicle.types';
import { Badge } from '../common/Badge';

interface VehicleStatusBadgeProps {
  status: VehicleStatus;
  size?: 'sm' | 'md';
}

export const VehicleStatusBadge: React.FC<VehicleStatusBadgeProps> = ({ status, size = 'sm' }) => {
  switch (status) {
    case 'Available':
      return <Badge variant="green" size={size}>Available</Badge>;
    case 'Assigned':
      return <Badge variant="blue" size={size}>Assigned</Badge>;
    case 'On Route':
      return <Badge variant="amber" size={size}>On Route</Badge>;
    case 'Maintenance':
      return <Badge variant="rose" size={size}>Maintenance</Badge>;
    case 'Inactive':
    default:
      return <Badge variant="slate" size={size}>Inactive</Badge>;
  }
};
