import { Address } from './common';
export declare class Space {
    spaceId: string;
    name: string;
    description: string;
    owner: Address;
    admins: Address[];
    campaigns: string[];
    constructor(spaceId: string, name: string, description: string, owner: Address);
    isAdmin(a: Address): boolean;
}
