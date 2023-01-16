import "mocha";
import { expect } from "chai";

import {Campaign, CampaignOwnership} from '../src/campaigns';

describe("Create Campaign", () => {
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
                
            //"{\"name\":\"name\",\"description\":\"desc\",\"createdBy\":\"0x\",\"ownerSpace\":null}");
    });

    it("fromObject - minimal", () => {
        const obj = {name: "name",
                     description: "desc",
                     createdBy: "0x"};
        const c = new Campaign("name", "desc", CampaignOwnership.Address, "0x");
        expect(Campaign.fromObject(obj)).to.deep.equal(c);
    });

    // it("fromObject - complete", () => {
    //     const obj = {campaignId: "cid1",
    //                  name:"name",
    //                  description: "desc",
    //                  createdBy: "0x",
    //                  ownerSpace: 0};
    //     const c = new Campaign("name", "desc", CampaignOwnership.Address, "0x");
    //     c.setCampaignId("cid1");
    //     expect(Campaign.fromObject(obj)).to.deep.equal(c);
    // });
    
    it("JSON bijection - Minimal - Campaign>JSON>Campaign", () => {
        const c = new Campaign("name", "desc", CampaignOwnership.Address, "0x");
        expect(Campaign.fromObject(c.toObject())).to.deep.equal(c);
    });
});
