export interface Candidate {
  id: string;
  name: string;
  image: string;
  votes: number;
  createdAt: number;
  description: string; // Add this field
}

export interface Vote {
  candidateId: string;
  timestamp: number;
  deviceId: string;
}