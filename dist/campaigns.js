"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Campaign = exports.CampaignAccess = exports.CampaignOwnership = exports.RemovedActiveForm = exports.CampaignIdMismatch = void 0;
require("reflect-metadata");
const class_transformer_1 = require("class-transformer");
const forms_1 = require("./forms");
exports.CampaignIdMismatch = "campaignId mismatch";
exports.RemovedActiveForm = "update removed active form";
var CampaignOwnership;
(function (CampaignOwnership) {
    CampaignOwnership[CampaignOwnership["Address"] = 0] = "Address";
    CampaignOwnership[CampaignOwnership["Space"] = 1] = "Space";
})(CampaignOwnership = exports.CampaignOwnership || (exports.CampaignOwnership = {}));
;
var CampaignAccess;
(function (CampaignAccess) {
    CampaignAccess[CampaignAccess["Public"] = 0] = "Public";
    CampaignAccess[CampaignAccess["LinkOnly"] = 1] = "LinkOnly";
    CampaignAccess[CampaignAccess["Whitelist"] = 2] = "Whitelist";
})(CampaignAccess = exports.CampaignAccess || (exports.CampaignAccess = {}));
;
class Campaign {
    constructor(name, desc, ownership, createdBy) {
        this.isLive = false;
        this.name = name;
        this.access = CampaignAccess.Public;
        this.publicTitle = name;
        this.description = desc;
        this.ownership = ownership;
        this.createdBy = createdBy;
        this.historicForms = [];
    }
    setCampaignId(id) {
        this.campaignId = id;
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
        if (this.activeForm) {
            this.historicForms.push(this.activeForm);
        }
        this.activeForm = f;
    }
    getActiveForm() {
        return this.activeForm;
    }
    getForm(formId) {
        if (this.activeForm && this.activeForm.formId === formId) {
            return this.activeForm;
        }
        else {
            return this.historicForms.find(f => f.formId === formId);
        }
    }
    isPublishable() {
        return !!this.activeForm &&
            (this.activeForm.questions.length > 0);
    }
    toSummary() {
        return {
            campaignId: this.campaignId,
            title: this.publicTitle,
            description: this.description,
            formId: this.activeForm ? this.activeForm.formId : undefined,
        };
    }
    toObject() {
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
    isBasicChanged(c) {
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
    updateIfChanged(update) {
        let hasChanged = false;
        if (this.campaignId !== update.campaignId) {
            // Once a form was set, it can't be deleted, only updated.
            throw (new Error(exports.CampaignIdMismatch));
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
            hasChanged = true;
        }
        if (!reduced.activeForm) {
            hasChanged = hasChanged || (update.activeForm !== undefined);
        }
        else {
            if (!update.activeForm) {
                throw (new Error(exports.RemovedActiveForm));
            }
            if (reduced.activeForm.isChanged(update.activeForm)) {
                //const newForm = update.activeForm;
                //newForm.formId = uuidv4();
                this.addForm(update.activeForm);
                hasChanged = true;
            }
        }
        return hasChanged;
    }
    static fromObject(json) {
        const c = new Campaign(json.name, json.description, CampaignOwnership.Address, //json.ownership: CampaignOwnership, // FIXME:
        json.createdBy);
        json;
        // TODO: add other details..
        if (json.form) {
            c.activeForm = forms_1.Form.fromObject(json.form);
        }
        if (json.campaignId) {
            c.campaignId = json.campaignId;
        }
        if (json.ownerSpace) {
            c.ownerSpace = json.ownerSpace;
        }
        if (json.isLive) {
            c.isLive = json.isLive;
        }
        return c;
    }
}
__decorate([
    (0, class_transformer_1.Type)(type => forms_1.Form)
], Campaign.prototype, "historicForms", void 0);
exports.Campaign = Campaign;
