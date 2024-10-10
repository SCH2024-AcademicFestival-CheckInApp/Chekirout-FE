export interface ParticipationRecord {
    categoryName: string;
    programName: string;
    participationTime: string;
    latitude: number;
    longitude: number;
  }
  
  export interface ApiResponse {
    studentName: string;
    studentId: string;
    participationRecords: ParticipationRecord[];
  }