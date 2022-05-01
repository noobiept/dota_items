export type ItemData = {
    hint: string[];
    id: number;
    img: string;
    dname: string;
    qual?:
        | "component"
        | "secret_shop"
        | "consumable"
        | "common"
        | "rare"
        | "epic"
        | "artifact";
    cost: number;
    notes: string;
    attrib: {
        key: string;
        header: string;
        value: string;
        footer: string;
    }[];
    mc: number | false;
    cd: number | false;
    lore: string;
    components: string[] | null;
    created: boolean;
    charges: number | false;
};

export type ItemsDataDict = {
    [itemName: string]: ItemData;
};
