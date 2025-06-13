export interface Candidate {
  id: string;
  name: string;
  votes: number;
  createdAt: number;
  description: string;
}

export interface Vote {
  candidateId: string;
  timestamp: number;
  deviceId: string;
}