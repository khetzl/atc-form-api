"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Campaign = exports.CampaignOwnership = void 0;
var CampaignOwnership;
(function (CampaignOwnership) {
    CampaignOwnership[CampaignOwnership["Address"] = 0] = "Address";
    CampaignOwnership[CampaignOwnership["Space"] = 1] = "Space";
})(CampaignOwnership = exports.CampaignOwnership || (exports.CampaignOwnership = {}));
;
class Campaign {
    constructor(name, desc, ownership, createdBy) {
        this.totalFunding = 0;
        this.remainingFunding = 0;
        this.isLive = false;
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
    setCampaignId(id) {
        this.campaignId = id;
    }
    updateFunding(totalFunding, remainingFunding) {
        this.totalFunding = totalFunding;
        this.remainingFunding = remainingFunding;
    }
    addForm(formId) {
        if (!this.forms.includes(formId)) {
            this.forms.push(formId);
        }
    }
    getAllForms() {
        return this.forms;
    }
    toSummary() {
        return {
            campaignId: this.campaignId,
            title: this.publicTitle,
            description: this.description,
            totalFunding: this.totalFunding,
            remainingFunding: this.remainingFunding,
        };
    }
    toSummaryWithFormId(formId) {
        const summary = this.toSummary();
        summary.formId = formId;
        return summary;
    }
    toObject() {
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
    static fromObject(json) {
        const c = new Campaign(json.name, json.description, CampaignOwnership.Address, //json.ownership: CampaignOwnership, // FIXME:
        json.createdBy);
        // TODO: add other details..
        if (json.campaignId) {
            c.campaignId = json.campaignId;
        }
        if (json.ownerSpace) {
            c.ownerSpace = json.ownerSpace;
        }
        if (json.forms) {
            c.forms = json.forms;
        }
        if (json.isLive) {
            c.isLive = json.isLive;
        }
        if (json.totalFunding) {
            c.totalFunding = json.totalFunding;
        }
        if (json.remainingFunding) {
            c.remainingFunding = json.remainingFunding;
        }
        return c;
    }
}
exports.Campaign = Campaign;
