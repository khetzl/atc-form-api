import "mocha";
import { expect } from "chai";

import {Space} from '../src/spaces';

describe("Create Space", () => {
    it("Simple setup", () =>
        {
            const s = new Space("1", 'name', 'desc', '0x');
        }); 
});
