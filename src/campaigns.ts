import {Address} from './common';

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
        forms?: number[],
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
    forms: number[];
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
        this.forms = [];
        // switch (ownership) {
        //     case CampaignOwnership.Address :
        //         this.ownerSpace = undefined; //FIXME: this is redundant...
        //         break;
        //     case CampaignOwnership.Space :
        //         this.ownerSpace = ownerSpace;
        //         break;
        //     default:
        //         throw new Error('unexpected Ownership type');
        //         break;
        // }
    }

    setCampaignId(id: string) {
        this.campaignId = id;
    }

    updateFunding(totalFunding: number, remainingFunding: number) {
        this.totalFunding = totalFunding;
        this.remainingFunding = remainingFunding;
    }

    addForm(formId: number) {
        if (!this.forms.includes(formId)) {
            this.forms.push(formId);
        }
    }

    getAllForms() : number[] {
        return this.forms;
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
        return ({
            campaignId: this.campaignId,
            name: this.name,
            description: this.description,
            createdBy: this.createdBy,
            ownerSpace: this.ownerSpace,
            forms: this.forms,
            totalFunding: this.totalFunding,
            remainingFunding: this.remainingFunding,
            isLive: this.isLive,
        });
    }
    
    static fromObject(json : CampaignJSON) : Campaign {
        const c = new Campaign(
            json.name,
            json.description,
            CampaignOwnership.Address, //json.ownership: CampaignOwnership, // FIXME:
            json.createdBy,
        );
        // TODO: add other details..
        if (json.campaignId) { c.campaignId = json.campaignId; }
        if (json.ownerSpace) { c.ownerSpace = json.ownerSpace; }
        if (json.forms) { c.forms = json.forms; }
        if (json.isLive) { c.isLive = json.isLive; }
        if (json.totalFunding) { c.totalFunding = json.totalFunding; }
        if (json.remainingFunding) { c.remainingFunding = json.remainingFunding; }
        return c;
    }
}
