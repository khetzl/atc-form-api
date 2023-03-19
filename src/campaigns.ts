import 'reflect-metadata';
import { Type } from 'class-transformer';

import {Address} from './common';
import {Form, FormJSON} from "./forms";

export const CampaignIdMismatch = "campaignId mismatch";
export const RemovedActiveForm = "update removed active form";

export enum CampaignOwnership {
    Address,
    Space,
};

export enum CampaignAccess {
    Public,  // Anyone can answer
    Space,   // Anyone from the space.
    LinkOnly, // UI won't refer user to this
    Whitelist, // Only specific users can fill it in even if others qualify
};

export type CampaignSummary = {
    campaignId?: string,
    title: string,
    description: string,
    formId?: string,
};

// Not the most fortunate naming...
export type CampaignJSON = {
    campaignId?: string,
    name: string,
    description: string,
    createdBy: string,
    access: CampaignAccess,
    ownerSpace?: string,
    form?: FormJSON,
    isLive?: boolean,
};

export class Campaign {
    campaignId?: string;
    name: string;
    publicTitle: string;
    description: string;
    ownership: CampaignOwnership;
    access: CampaignAccess;
    createdBy: Address;
    ownerSpace?: string;
    activeForm?: Form;
    @Type(type => Form)
    historicForms: Form[];
    isLive = false;

    constructor(
        name: string,
        desc: string,
        ownership: CampaignOwnership,
        createdBy: Address,
    ) {
        this.name = name;
        this.access = CampaignAccess.Public;
        this.publicTitle = name;
        this.description = desc;
        this.ownership = ownership;
        this.createdBy = createdBy;
        this.historicForms = [];
    }

    setCampaignId(id: string) {
        this.campaignId = id;
    }

    isOwned(caller: string) : boolean {
        switch (this.ownership) {
            case CampaignOwnership.Address:
                return caller === this.createdBy;
                // TODO: space
            default:
                throw new Error("unknown ownership");
                break;
        }
    }

    addForm(f: Form) {
        if (this.activeForm) { this.historicForms.push(this.activeForm); }
        this.activeForm = f;
    }

    getActiveForm() : Form | undefined {
        return this.activeForm;
    }

    getForm(formId: string) : Form | undefined {
        if (this.activeForm && this.activeForm.formId === formId) {
            return this.activeForm;
        } else {
            return this.historicForms.find(f => f.formId === formId);
        }
    }

    isPublishable() : boolean {
        return !!this.activeForm &&
            (this.activeForm.questions.length > 0);
    }

    toSummary() : CampaignSummary {
        return {
            campaignId: this.campaignId,
            title: this.publicTitle,
            description: this.description,
            formId: this.activeForm ? this.activeForm.formId : undefined,
        };
    }

    toObject() : CampaignJSON {
        return ({
            campaignId: this.campaignId,
            name: this.name,
            description: this.description,
            createdBy: this.createdBy,
            ownerSpace: this.ownerSpace,
            form: this.activeForm,
            isLive: this.isLive,
            access: this.access,
        });
    }

    private isBasicChanged(c: Campaign) : boolean {
        return this.name !== c.name ||
            this.publicTitle !== c.publicTitle ||
            this.description !== c.description ||
            this.ownership !== c.ownership ||
            this.createdBy !== c.createdBy ||
            this.ownerSpace !== c.ownerSpace ||
            this.isLive !== c.isLive ||
            this.access !== c.access;
    }

    // Only works with fromObject output
    updateIfChanged(update: Campaign) : boolean {
        let hasChanged = false;
        if (this.campaignId !== update.campaignId) {
            // Once a form was set, it can't be deleted, only updated.
            throw(new Error(CampaignIdMismatch));
        }
        const reduced = Campaign.fromObject(this.toObject());

        if (reduced.isBasicChanged(update)) {
            this.name = update.name;
            this.publicTitle = update.publicTitle;
            this.description = update.description;
            this.ownership = update.ownership;
            this.createdBy = update.createdBy;
            this.ownerSpace = update.ownerSpace;
            this.activeForm = update.activeForm;
            this.isLive = update.isLive;
            this.access = update.access;
            hasChanged = true;
        }

        if (!reduced.activeForm) {
            hasChanged = hasChanged || (update.activeForm !== undefined);
        } else {
            if (!update.activeForm) { throw(new Error(RemovedActiveForm)); }

            if (reduced.activeForm!.isChanged(update.activeForm!)) {
                this.addForm(update.activeForm);
                hasChanged = true;
            }
        }
        return hasChanged;
    }

    static fromObject(json : CampaignJSON) : Campaign {
        const c = new Campaign(
            json.name,
            json.description,
            CampaignOwnership.Address, //json.ownership: CampaignOwnership, // FIXME:
            json.createdBy,
        );

        if (json.form) {
            c.activeForm = Form.fromObject(json.form);
        }
        if (json.campaignId) { c.campaignId = json.campaignId; }
        if (json.ownerSpace) { c.ownerSpace = json.ownerSpace; }
        if (json.isLive) { c.isLive = json.isLive; }
        c.access = json.access;
        return c;
    }
}
