import "mocha";
import { expect } from "chai";

import {Campaign, CampaignOwnership, RemovedActiveForm} from '../src/campaigns';
import {Form} from '../src/forms';

describe("Campaign - Add/Get Forms", () => {
    it("Campaign has no Forms", () => {
        const c = new Campaign("name", "desc", CampaignOwnership.Address, "0x");
        expect(c.getForm("any id")).to.be.undefined;
    });
    it("Campaign has a single Form", () => {
        const c = new Campaign("name", "desc", CampaignOwnership.Address, "0x");
        const f = new Form("2");
        f.addRating("rate the test!");
        c.addForm(f);
        expect(c.getForm("not in campaign")).to.be.undefined; // its id is "2"
        expect(c.getForm("2")).to.deep.equal(f);
    });
    it("Campaign has a multiple Form", () => {
        const c = new Campaign("name", "desc", CampaignOwnership.Address, "0x");
        const f = new Form("2");
        f.addRating("rate the test!");
        c.addForm(f);
        expect(c.getForm("not in campaign")).to.be.undefined; // its id is "2"
        expect(c.getForm("2")).to.deep.equal(f);
    });

});

describe("Campaign Detect update", () => {
    it("Minimal self, indentical, b2b conversion, different id", () => {
        const c = new Campaign("name", "desc", CampaignOwnership.Address, "0x");
        expect(c.updateIfChanged(c)).to.equal(false);
        const c1 = new Campaign("name", "desc", CampaignOwnership.Address, "0x");
        expect(c.updateIfChanged(c1)).to.equal(false);
        const c2 = new Campaign("name2", "desc", CampaignOwnership.Address, "0x");
        expect(c.updateIfChanged(c2)).to.equal(true);
        // c has been updated here
        expect(c.updateIfChanged(c2)).to.equal(false);

        const c0 = new Campaign("name", "desc", CampaignOwnership.Address, "0x");
        const b2b = Campaign.fromObject(c0.toObject());
        expect(c0.updateIfChanged(b2b)).to.equal(false);
        const b2b2 = Campaign.fromObject(c2.toObject());
        expect(c0.updateIfChanged(b2b2)).to.equal(true);
    });

    it("Campaign with simple Form", () => {
        const c = new Campaign("name", "desc", CampaignOwnership.Address, "0x");
        const f = new Form("form1");
        c.addForm(f);
        expect(c.updateIfChanged(c)).to.equal(false);
        const c1 = new Campaign("name", "desc", CampaignOwnership.Address, "0x");
        c1.addForm(f);
        expect(c.updateIfChanged(c1)).to.equal(false);

        const c2 = new Campaign("name", "desc", CampaignOwnership.Address, "0x");
        const f2 = new Form("form2");
        c2.addForm(f2);
        expect(c.updateIfChanged(c2)).to.equal(true);
    });

    it("Campaign with simple Form with questions", () => {
        const c = new Campaign("name", "desc", CampaignOwnership.Address, "0x");
        const f = new Form("form1");
        f.addBinary("binary1");
        c.addForm(f);
        expect(c.updateIfChanged(c)).to.equal(false);

        const c1 = new Campaign("name", "desc", CampaignOwnership.Address, "0x");
        const f1 = new Form("form1");
        f1.addBinary("binary1");
        c1.addForm(f1);

        const b2b = Campaign.fromObject(c1.toObject());
        expect(c.updateIfChanged(b2b)).to.equal(false);

        const c2 = new Campaign("name", "desc", CampaignOwnership.Address, "0x");
        const f2 = new Form("form1");
        f2.addBinary("binary2");
        c2.addForm(f2);

        const b2b2 = Campaign.fromObject(c2.toObject());
        expect(c.updateIfChanged(b2b2)).to.equal(true);
    });

    it("Campaign with form and a campaign without", () => {
        const c1 = new Campaign("name", "desc", CampaignOwnership.Address, "0x");
        const f1 = new Form("form1");
        c1.addForm(f1);

        const c2 = new Campaign("name", "desc", CampaignOwnership.Address, "0x");

        expect(() => c1.updateIfChanged(c2)).to.throw(RemovedActiveForm);
        expect(c2.updateIfChanged(c1)).to.equal(true);
    });

    it("Campaigns with forms, one with questions one without", () => {
        const c1 = new Campaign("name", "desc", CampaignOwnership.Address, "0x");
        const f1 = new Form("form1");
        f1.addBinary("binary1");
        c1.addForm(f1);

        const c2 = new Campaign("name", "desc", CampaignOwnership.Address, "0x");
        const f2 = new Form("form1");
        c2.addForm(f2);

        expect(c1.updateIfChanged(c2)).to.equal(true);
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
            form: undefined,
            isLive: false,
            ownerSpace: undefined,
        });
    });

    it("toObjectJSON With Form", () => {
        const f = new Form("stuff");
        const c = new Campaign("name", "desc", CampaignOwnership.Address, "0x");
        c.addForm(f);
        c.setCampaignId("1");
        expect(c.toObject()).to.deep.equal({
            campaignId: "1",
            name: "name",
            description: "desc",
            createdBy: "0x",
            form: {formId: "stuff",
                   questions: []},
            isLive: false,
            ownerSpace: undefined,
        });
    });

    it("fromObject - Minimal", () => {
        const obj = {name: "name",
                     description: "desc",
                     createdBy: "0x"};
        const c = new Campaign("name", "desc", CampaignOwnership.Address, "0x");
        expect(Campaign.fromObject(obj)).to.deep.equal(c);
    });
    it("fromObject - With Form", () => {
        const obj = {name: "name",
                     description: "desc",
                     createdBy: "0x",
                     form: {
                         formId: "stuff",
                         questions: [] }};
        const f = new Form("stuff");
        const c = new Campaign("name", "desc", CampaignOwnership.Address, "0x");
        c.addForm(f);
        expect(Campaign.fromObject(obj)).to.deep.equal(c);
    });


    it("JSON bijection - Minimal - Campaign>JSON>Campaign", () => {
        const c = new Campaign("name", "desc", CampaignOwnership.Address, "0x");
        expect(Campaign.fromObject(c.toObject())).to.deep.equal(c);
    });
    it("JSON bijection - With Form - Campaign>JSON>Campaign", () => {
        const f = new Form("stuff");
        const c = new Campaign("name", "desc", CampaignOwnership.Address, "0x");
        c.addForm(f);
        expect(Campaign.fromObject(c.toObject())).to.deep.equal(c);
    });
});
