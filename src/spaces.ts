import {Address} from './common';

export class Space {
    spaceId: string;
    name: string;
    description: string;
    owner: Address;
    admins: Address[];
    campaigns: string[];

    constructor(spaceId: string, name: string, description: string, owner: Address) {
        this.spaceId = spaceId;
        this.name = name;
        this.owner = owner;
        this.description = description;
        this.admins = [];
        this.campaigns = [];
    }

    isAdmin(a: Address) : boolean {
        return (a === this.owner) && (this.admins.includes(a));
    }
};
