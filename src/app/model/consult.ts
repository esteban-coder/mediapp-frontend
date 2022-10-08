import { ConsultDetail } from "./consultDetail";
import { Medic } from "./medic";
import { Patient } from "./patient";
import { Specialty } from "./specialty";

export class Consult{
    idConsult: number;
    patient: Patient;
    medic: Medic;
    specialty: Specialty;
    consultDate: string;
    numConsult: string;
    details: ConsultDetail[];    
}