import {Address} from './common';
import {Form, FormJSON} from "./forms";

export type CampaignSummary = {
    campaignId?: string,
    title: string,
    description: string,
    totalFunding: number,
    remainingFunding: number,
    formId?: number,
};

// Not the most fortunate naming...
export type CampaignJSON = {
        campaignId?: string,
        name: string,
        description: string,
        createdBy: string,
        ownerSpace?: string,
        forms: FormJSON[],
        totalFunding?: number,
        remainingFunding?: number,
        isLive?: boolean,
};

export enum CampaignOwnership {
    Address,
    Space,
};

export class Campaign {
    campaignId?: string;
    name: string;
    publicTitle: string;
    description: string;
    ownership: CampaignOwnership;
    createdBy: Address;
    ownerSpace?: string;
    forms: Map<string, Form>;
    totalFunding = 0;
    remainingFunding = 0;
    isLive = false;

    constructor(name: string,
                desc: string,
                ownership: CampaignOwnership,
                createdBy: Address,
               ) {
        this.name = name;
        this.publicTitle = name;
        this.description = desc;
        this.ownership = ownership;
        this.createdBy = createdBy;
        this.forms = new Map<string, Form>();
    }

    setCampaignId(id: string) {
        this.campaignId = id;
    }

    updateFunding(totalFunding: number, remainingFunding: number) {
        this.totalFunding = totalFunding;
        this.remainingFunding = remainingFunding;
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
        this.forms.set(f.formId, f);
    }

    getForm(fId: string) : Form | undefined {
        return this.forms.get(fId);
    }

    deleteForm(fId: string) {
        this.forms.delete(fId);
    }

    getAllForms() : Form[] {
        return Array.from(this.forms.values());
    }

    toSummary() : CampaignSummary {
        return {
            campaignId: this.campaignId,
            title: this.publicTitle,
            description: this.description,
            totalFunding: this.totalFunding,
            remainingFunding: this.remainingFunding,
        };
    }

    toSummaryWithFormId(formId: number) {
        const summary = this.toSummary();
        summary.formId = formId;
        return summary;
    }

    toObject() : CampaignJSON {
        let formsJs: FormJSON[] = [];
        if (this.forms) {
            this.forms.forEach((f) => formsJs.push(f.toObject()));
        }

        return ({
            campaignId: this.campaignId,
            name: this.name,
            description: this.description,
            createdBy: this.createdBy,
            ownerSpace: this.ownerSpace,
            forms: formsJs,
            totalFunding: this.totalFunding,
            remainingFunding: this.remainingFunding,
            isLive: this.isLive,
        });
    }

    // FIXME: this should be the constructor
    static fromObject(json : CampaignJSON) : Campaign {
        const c = new Campaign(
            json.name,
            json.description,
            CampaignOwnership.Address, //json.ownership: CampaignOwnership, // FIXME:
            json.createdBy,
        );
        if (json.forms) {
            const fs = new Map<string, Form>();
            json.forms.forEach((fObj) => {
                const f = Form.fromObject(fObj);
                fs.set(f.formId, f);
            });
            c.forms = fs;
        }
        // TODO: add other details..
        if (json.campaignId) { c.campaignId = json.campaignId; }
        if (json.ownerSpace) { c.ownerSpace = json.ownerSpace; }
        if (json.isLive) { c.isLive = json.isLive; }
        if (json.totalFunding) { c.totalFunding = json.totalFunding; }
        if (json.remainingFunding) { c.remainingFunding = json.remainingFunding; }
        return c;
    }
}

