import 'reflect-metadata';
import { Address } from './common';
import { Form, FormJSON } from "./forms";
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
    forms: FormJSON[];
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
    forms: Form[];
    totalFunding: number;
    remainingFunding: number;
    isLive: boolean;
    constructor(name: string, desc: string, ownership: CampaignOwnership, createdBy: Address);
    setCampaignId(id: string): void;
    updateFunding(totalFunding: number, remainingFunding: number): void;
    isOwned(caller: string): boolean;
    addForm(f: Form): void;
    getForm(formId: string): Form | undefined;
    deleteForm(formId: string): void;
    getAllForms(): Form[];
    toSummary(): CampaignSummary;
    toSummaryWithFormId(formId: number): CampaignSummary;
    toObject(): CampaignJSON;
    static fromObject(json: CampaignJSON): Campaign;
}
