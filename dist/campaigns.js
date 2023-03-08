"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Campaign = exports.CampaignOwnership = void 0;
require("reflect-metadata");
const class_transformer_1 = require("class-transformer");
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
        this.forms = [];
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
        this.forms.push(f);
    }
    getForm(formId) {
        return this.forms.find(f => f.formId === formId);
    }
    deleteForm(formId) {
        const i = this.forms.findIndex(f => f.formId === formId);
        if (i >= 0) {
            delete this.forms[i];
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
        let formsJs = [];
        if (this.forms && this.forms.length > 0) {
            formsJs = this.getAllForms();
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
    static fromObject(json) {
        const c = new Campaign(json.name, json.description, CampaignOwnership.Address, //json.ownership: CampaignOwnership, // FIXME:
        json.createdBy);
        if (json.forms) {
            const fs = new Array();
            json.forms.forEach((fObj) => {
                const f = forms_1.Form.fromObject(fObj);
                fs.push(f);
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
__decorate([
    (0, class_transformer_1.Type)(type => forms_1.Form)
], Campaign.prototype, "forms", void 0);
exports.Campaign = Campaign;
