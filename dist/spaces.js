"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Space = void 0;
class Space {
    constructor(spaceId, name, description, owner) {
        this.spaceId = spaceId;
        this.name = name;
        this.owner = owner;
        this.description = description;
        this.admins = [];
        this.campaigns = [];
    }
    isAdmin(a) {
        return (a === this.owner) && (this.admins.includes(a));
    }
}
exports.Space = Space;
;
