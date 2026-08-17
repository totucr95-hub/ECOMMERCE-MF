import { Injectable, inject } from '@angular/core';
import { LeadSummary } from '../../domain/entities/lead-summary.entity';
import { LeadFormData, LeadQueryFilters } from '../../domain/lead.models';
import { LeadsRepository } from '../../domain/repositories/leads.repository';

@Injectable()
export class AdminLeadsFacade {
  private readonly repository = inject(LeadsRepository);

  loadSummaries(
    filters?: LeadQueryFilters,
  ): Promise<ReadonlyArray<LeadSummary>> {
    return this.repository.findSummaries(filters);
  }

  readLead(id: string): Promise<LeadSummary | null> {
    return this.repository.findById(id);
  }

  createLead(payload: LeadFormData): Promise<LeadSummary> {
    return this.repository.create(payload);
  }

  updateLead(id: string, payload: LeadFormData): Promise<LeadSummary | null> {
    return this.repository.update(id, payload);
  }

  updateLeadStatus(id: string, status: string): Promise<LeadSummary | null> {
    return this.repository.updateStatus(id, status);
  }

  deleteLead(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  exportCsv(filters?: LeadQueryFilters): Promise<Blob> {
    return this.repository.exportCsv(filters);
  }
}
