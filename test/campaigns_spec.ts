import "mocha";
import { expect } from "chai";

import {Campaign, CampaignOwnership} from '../src/campaigns';
import {Form} from '../src/forms';

describe("Campaign Actions", () => {
    it("Summary", () =>
        {
            const c = new Campaign("name", "desc", CampaignOwnership.Address, "0x");
            c.setCampaignId("1");
            c.updateFunding(321, 123);
            expect(c.toSummary()).to.deep.equal(
                {
                    campaignId: "1",
                    title: "name",
                    description: "desc",
                    totalFunding: 321,
                    remainingFunding: 123
                });
            expect(c.toSummaryWithFormId(44)).to.deep.equal(
                {
                    campaignId: "1",
                    title: "name",
                    description: "desc",
                    totalFunding: 321,
                    remainingFunding: 123,
                    formId: 44
                });
        });
});

describe("Campaign Conversion", () => {
    it("toObjectJSON", () => {
        const c = new Campaign("name", "desc", CampaignOwnership.Address, "0x");
        c.setCampaignId("1");
        expect(c.toObject()).to.deep.equal({
            campaignId: "1",
            name: "name",
            description: "desc",
            createdBy: "0x",
            remainingFunding: 0,
            totalFunding: 0,
            forms: [],
            isLive: false,
            ownerSpace: undefined,
        });
    });

    it("toObjectJSON With Form", () => {
        const f = new Form("stuff", "stuff", "stuff");
        const c = new Campaign("name", "desc", CampaignOwnership.Address, "0x");
        c.addForm(f);
        c.setCampaignId("1");
        expect(c.toObject()).to.deep.equal({
            campaignId: "1",
            name: "name",
            description: "desc",
            createdBy: "0x",
            remainingFunding: 0,
            totalFunding: 0,
            forms: [{
                formId: "stuff",
                formText: "stuff",
                internalName: "stuff",
                questions: [] }],
            isLive: false,
            ownerSpace: undefined,
        });
    });

    it("fromObject - Minimal", () => {
        const obj = {name: "name",
                     description: "desc",
                     createdBy: "0x",
                     forms: []};
        const c = new Campaign("name", "desc", CampaignOwnership.Address, "0x");
        expect(Campaign.fromObject(obj)).to.deep.equal(c);
    });
    it("fromObject - With Form", () => {
        const obj = {name: "name",
                     description: "desc",
                     createdBy: "0x",
                     forms: [{
                         formId: "stuff",
                         formText: "stuff",
                         internalName: "stuff",
                         questions: [] }]};
        const f = new Form("stuff", "stuff", "stuff");
        const c = new Campaign("name", "desc", CampaignOwnership.Address, "0x");
        c.addForm(f);
        expect(Campaign.fromObject(obj)).to.deep.equal(c);
    });


    it("JSON bijection - Minimal - Campaign>JSON>Campaign", () => {
        const c = new Campaign("name", "desc", CampaignOwnership.Address, "0x");
        expect(Campaign.fromObject(c.toObject())).to.deep.equal(c);
    });
    it("JSON bijection - With Form - Campaign>JSON>Campaign", () => {
        const f = new Form("stuff", "stuff", "stuff");
        const c = new Campaign("name", "desc", CampaignOwnership.Address, "0x");
        c.addForm(f);
        expect(Campaign.fromObject(c.toObject())).to.deep.equal(c);
    });
});
