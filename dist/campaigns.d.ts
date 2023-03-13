import 'reflect-metadata';
import { Address } from './common';
import { Form, FormJSON } from "./forms";
export declare const CampaignIdMismatch = "campaignId mismatch";
export declare const RemovedActiveForm = "update removed active form";
export declare enum CampaignOwnership {
    Address = 0,
    Space = 1
}
export type CampaignSummary = {
    campaignId?: string;
    title: string;
    description: string;
    formId?: string;
};
export type CampaignJSON = {
    campaignId?: string;
    name: string;
    description: string;
    createdBy: string;
    ownerSpace?: string;
    form?: FormJSON;
    isLive?: boolean;
};
export declare class Campaign {
    campaignId?: string;
    name: string;
    publicTitle: string;
    description: string;
    ownership: CampaignOwnership;
    createdBy: Address;
    ownerSpace?: string;
    activeForm?: Form;
    historicForms: Form[];
    isLive: boolean;
    constructor(name: string, desc: string, ownership: CampaignOwnership, createdBy: Address);
    setCampaignId(id: string): void;
    isOwned(caller: string): boolean;
    addForm(f: Form): void;
    getActiveForm(): Form | undefined;
    getForm(formId: string): Form | undefined;
    toSummary(): CampaignSummary;
    toObject(): CampaignJSON;
    private isBasicChanged;
    updateIfChanged(update: Campaign): boolean;
    static fromObject(json: CampaignJSON): Campaign;
}
