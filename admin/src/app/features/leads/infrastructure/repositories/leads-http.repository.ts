import { Injectable, inject } from '@angular/core';
import { LeadSummary } from '../../domain/entities/lead-summary.entity';
import { LeadFormData, LeadQueryFilters } from '../../domain/lead.models';
import { LeadsRepository } from '../../domain/repositories/leads.repository';
import { AdminLeadsApiService } from '../services/admin-leads-api.service';

@Injectable()
export class LeadsHttpRepository implements LeadsRepository {
  private readonly api = inject(AdminLeadsApiService);

  async findSummaries(
    filters?: LeadQueryFilters,
  ): Promise<ReadonlyArray<LeadSummary>> {
    return this.api.getLeads(filters);
  }

  async findById(id: string): Promise<LeadSummary | null> {
    return this.api.getLeadById(id);
  }

  async create(payload: LeadFormData): Promise<LeadSummary> {
    return this.api.createLead(payload);
  }

  async update(id: string, payload: LeadFormData): Promise<LeadSummary | null> {
    return this.api.updateLead(id, payload);
  }

  async updateStatus(id: string, status: string): Promise<LeadSummary | null> {
    return this.api.updateLeadStatus(id, status);
  }

  async delete(id: string): Promise<boolean> {
    return this.api.deleteLead(id);
  }

  async exportCsv(filters?: LeadQueryFilters): Promise<Blob> {
    return this.api.exportLeadsCsv(filters);
  }
}
