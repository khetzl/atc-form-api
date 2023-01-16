import { Address } from './common';
export type CampaignSummary = {
    campaignId?: string;
    title: string;
    description: string;
    totalFunding: number;
    remainingFunding: number;
    formId?: number;
};
export type CampaignJSON = {
    campaignId?: string;
    name: string;
    description: string;
    createdBy: string;
    ownerSpace?: string;
    forms?: number[];
    totalFunding?: number;
    remainingFunding?: number;
    isLive?: boolean;
};
export declare enum CampaignOwnership {
    Address = 0,
    Space = 1
}
export declare class Campaign {
    campaignId?: string;
    name: string;
    publicTitle: string;
    description: string;
    ownership: CampaignOwnership;
    createdBy: Address;
    ownerSpace?: string;
    forms: number[];
    totalFunding: number;
    remainingFunding: number;
    isLive: boolean;
    constructor(name: string, desc: string, ownership: CampaignOwnership, createdBy: Address);
    setCampaignId(id: string): void;
    updateFunding(totalFunding: number, remainingFunding: number): void;
    addForm(formId: number): void;
    getAllForms(): number[];
    toSummary(): CampaignSummary;
    toSummaryWithFormId(formId: number): CampaignSummary;
    toObject(): CampaignJSON;
    static fromObject(json: CampaignJSON): Campaign;
}
