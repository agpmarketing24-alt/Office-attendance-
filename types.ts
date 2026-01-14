
export enum AttendanceStatus {
  PRESENT = 'Present',
  LEAVE = 'Leave',
  LATE = 'Late',
  OTHERS = 'Others'
}

export interface AttendanceRecord {
  id: string;
  name: string;
  date: string;
  inTime: string;
  outTime: string;
  status: AttendanceStatus;
  remarks: string;
  createdAt: number;
}

export interface AttendanceStats {
  total: number;
  present: number;
  late: number;
  onLeave: number;
}
