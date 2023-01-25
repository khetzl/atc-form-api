"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Campaign = exports.CampaignOwnership = void 0;
const forms_1 = require("./forms");
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
        this.forms = new Map();
    }
    setCampaignId(id) {
        this.campaignId = id;
    }
    updateFunding(totalFunding, remainingFunding) {
        this.totalFunding = totalFunding;
        this.remainingFunding = remainingFunding;
    }
    isOwned(caller) {
        switch (this.ownership) {
            case CampaignOwnership.Address:
                return caller === this.createdBy;
            // TODO: space
            default:
                throw new Error("unknown ownership");
                break;
        }
    }
    addForm(f) {
        this.forms.set(f.formId, f);
    }
    getForm(fId) {
        return this.forms.get(fId);
    }
    deleteForm(fId) {
    }
    getAllForms() {
        return Array.from(this.forms.values());
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
        let formsJs = [];
        this.forms.forEach((f) => formsJs.push(f.toObject()));
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
    static fromObject(json) {
        const c = new Campaign(json.name, json.description, CampaignOwnership.Address, //json.ownership: CampaignOwnership, // FIXME:
        json.createdBy);
        if (json.forms) {
            const fs = new Map();
            json.forms.forEach((fObj) => {
                const f = forms_1.Form.fromObject(fObj);
                fs.set(f.formId, f);
            });
            c.forms = fs;
        }
        // TODO: add other details..
        if (json.campaignId) {
            c.campaignId = json.campaignId;
        }
        if (json.ownerSpace) {
            c.ownerSpace = json.ownerSpace;
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
