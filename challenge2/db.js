export const users = [
    {
        id: 1,
        firstName: "John",
        lastName: "Smith",
        roles: [1],
        permissons: [1, 2]
    }
];

export const roles = [
    {
        id: 1,
        name: "Reader",
        permissions: [1]
    }
];

export const permissions = [
    {
        id: 1,
        access: "READ"
    },
    {
        id: 2,
        access: "WRITE"
    }
];
