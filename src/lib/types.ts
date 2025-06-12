export interface Candidate {
  id: string;
  name: string;
  image: string;
  votes: number;
  createdAt: number; // Add this field for ordering
}

export interface Vote {
  candidateId: string;
  timestamp: number;
  deviceId: string;
}