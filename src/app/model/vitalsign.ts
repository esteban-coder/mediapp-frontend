import { Patient } from "./patient";

export class VitalSign {
    idVitalSign: number;
    patient: Patient;
    takenDate: string;
    temperature: string;
    pulse: string;
    respiratoryRate: string;
}