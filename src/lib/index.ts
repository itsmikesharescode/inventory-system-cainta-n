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
