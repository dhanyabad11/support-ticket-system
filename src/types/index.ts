export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved';
  category: string;
  createdBy: string;
  createdAt: Date;
  assignedTo?: string;
  contactEmail: string;
  contactPhone: string;
  attachmentUrl?: string;
  additionalNotes?: string;
}

export interface User {
  uid: string;
  email: string;
  role: 'customer' | 'agent';
}