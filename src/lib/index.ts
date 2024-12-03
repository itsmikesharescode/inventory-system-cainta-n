export const generateRefId = (length: number = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let referenceId = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    referenceId += chars[randomIndex];
  }
  return referenceId;
};

export const categoriesMeta = [
  { value: 'Mouse', label: 'Computer Mouse' },
  { value: 'Keyboard', label: 'Computer Keyboard' },
  { value: 'Monitor', label: 'Display Monitor' },
  { value: 'Projector', label: 'Video Projector' },
  { value: 'Remote', label: 'Remote Control' },
  { value: 'DLP Screen', label: 'DLP Projection Screen' },
  { value: 'Aircon', label: 'Air Conditioner' },
  { value: 'TV', label: 'Television' },
  { value: 'AVR', label: 'Automatic Voltage Regulator' },
  { value: 'Extension', label: 'Extension Cord' },
  { value: 'UPS', label: 'Uninterruptible Power Supply' },
  { value: 'Router', label: 'Network Router' },
  { value: 'Table', label: 'Office Table' },
  { value: 'Chair', label: 'Office Chair' },
  { value: 'Switch Hub', label: 'Network Switch Hub' }
];

export const typeMeta = [
  { value: 'Consumable', label: 'Consumable' },
  { value: 'Non-consumable', label: 'Non-consumable' }
];

export const statusMeta = [
  { value: 'New', label: 'Brand new items' },
  { value: 'Old', label: 'Previously used items' }
];

export const timeMeta = [
  { value: '00:00:00', label: '12:00 AM' },
  { value: '00:30:00', label: '12:30 AM' },
  { value: '01:00:00', label: '1:00 AM' },
  { value: '01:30:00', label: '1:30 AM' },
  { value: '02:00:00', label: '2:00 AM' },
  { value: '02:30:00', label: '2:30 AM' },
  { value: '03:00:00', label: '3:00 AM' },
  { value: '03:30:00', label: '3:30 AM' },
  { value: '04:00:00', label: '4:00 AM' },
  { value: '04:30:00', label: '4:30 AM' },
  { value: '05:00:00', label: '5:00 AM' },
  { value: '05:30:00', label: '5:30 AM' },
  { value: '06:00:00', label: '6:00 AM' },
  { value: '06:30:00', label: '6:30 AM' },
  { value: '07:00:00', label: '7:00 AM' },
  { value: '07:30:00', label: '7:30 AM' },
  { value: '08:00:00', label: '8:00 AM' },
  { value: '08:30:00', label: '8:30 AM' },
  { value: '09:00:00', label: '9:00 AM' },
  { value: '09:30:00', label: '9:30 AM' },
  { value: '10:00:00', label: '10:00 AM' },
  { value: '10:30:00', label: '10:30 AM' },
  { value: '11:00:00', label: '11:00 AM' },
  { value: '11:30:00', label: '11:30 AM' },
  { value: '12:00:00', label: '12:00 PM' },
  { value: '12:30:00', label: '12:30 PM' },
  { value: '13:00:00', label: '1:00 PM' },
  { value: '13:30:00', label: '1:30 PM' },
  { value: '14:00:00', label: '2:00 PM' },
  { value: '14:30:00', label: '2:30 PM' },
  { value: '15:00:00', label: '3:00 PM' },
  { value: '15:30:00', label: '3:30 PM' },
  { value: '16:00:00', label: '4:00 PM' },
  { value: '16:30:00', label: '4:30 PM' },
  { value: '17:00:00', label: '5:00 PM' },
  { value: '17:30:00', label: '5:30 PM' },
  { value: '18:00:00', label: '6:00 PM' },
  { value: '18:30:00', label: '6:30 PM' },
  { value: '19:00:00', label: '7:00 PM' },
  { value: '19:30:00', label: '7:30 PM' },
  { value: '20:00:00', label: '8:00 PM' },
  { value: '20:30:00', label: '8:30 PM' },
  { value: '21:00:00', label: '9:00 PM' },
  { value: '21:30:00', label: '9:30 PM' },
  { value: '22:00:00', label: '10:00 PM' },
  { value: '22:30:00', label: '10:30 PM' },
  { value: '23:00:00', label: '11:00 PM' },
  { value: '23:30:00', label: '11:30 PM' }
];
