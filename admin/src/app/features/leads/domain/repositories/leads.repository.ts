import { LeadSummary } from '../entities/lead-summary.entity';
import { LeadFormData, LeadQueryFilters } from '../lead.models';

export abstract class LeadsRepository {
  abstract findSummaries(
    filters?: LeadQueryFilters,
  ): Promise<ReadonlyArray<LeadSummary>>;
  abstract findById(id: string): Promise<LeadSummary | null>;
  abstract create(payload: LeadFormData): Promise<LeadSummary>;
  abstract update(
    id: string,
    payload: LeadFormData,
  ): Promise<LeadSummary | null>;
  abstract updateStatus(
    id: string,
    status: string,
  ): Promise<LeadSummary | null>;
  abstract delete(id: string): Promise<boolean>;
  abstract exportCsv(filters?: LeadQueryFilters): Promise<Blob>;
}
