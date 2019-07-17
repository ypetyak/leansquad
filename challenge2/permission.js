const db = require("/db.js");

// approximate function to add new roles or permissions

export function grantPermission(userId, roles=null, permissions=null) {
    // check if we have roles
    if (roles) {
        // create new roles and add them to the DB for roles Table
        let roleIds = addRoles(roles);
        // now add new roles to the user
        addToUser("role", roleIds, userId);
        return;
    }

    // check if have permissions: 
    // if we do have them add to the DB for permissions table
    if (permissions) {
        let permIds = addPermissions(permissions);
        addToUser("permission", permIds, userId);
        return;
    }
    // if there were no permissions and no roles: 
    return "Error. Wrong input";
}


// function to add permissions to db and return only ids

function addPermissions(permissions) {
    let dbPerm = db.permissions;
    let newPermIds = [];

    for (let i = 0; i < permissions.length; i++) {
        let newPermission = { id: dbPerm.length + 1, access: permissions[i] };
        newPermIds.push(newPermission.id);
        dbPerm.push(newPermission);
    }
    // return only Ids for new permissions
    return newPermIds;
}
// function to add roles to DB and return only ids
function addRoles(roles) {
    // we asume that roles is an array, where roles[0] = name and 
    // role[1] = array with permissions
    let newRolesIds = [];
    let dbRoles = db.roles;

    // we also need to create new permissions: 
    let permIds = addPermissions(roles[1]);

    for (let i = 0; i < roles.length; i++) {
        let newRole = { id: dbRoles.length + 1, role: roles[i][0], permission: permIds };
        newRolesIds.push(newRole.id);
        dbRoles.push(newRole);
    }
    
    return newRolesIds;
}

// function to add roles or permission to the user: 

function addToUser(type, ids, userId) {
    if (type == "roles") {
        // Note, that in real db we can get user date without looping through array,
        // for example in relational db it can look like `SELECT user FROM users WHERE id = ${userId}`
        for (let i = 0; i < db.users; i++) {
            if (userId === db.users[i].id) {
                // now add new roles           
                let newRoles = db.users[i].roles.concat(ids);
                db.users[i].roles = newRoles;
                return;
            }
        }
        // if no user found: 
        return "Error. No user with such ID";
    }

    if (type == "permissions") {
        for (let i = 0; i < db.users; i++) {
            if (userId === db.users[i].id) {       
                let newPermissions = db.users[i].roles.concat(ids);
                db.users[i].permissions = newPermissions;
                return;
            }            
        }
        // if no user found: 
        return "Error. No user with such ID";
    }

    return "Error";
}


// approximate function to check user if user have specific permission

export function checkUsersPermission(userId, permission) {
    // get user we are looking for: 
    let user = getUser(userId);

    if (!user) {
        return "Error. No such user";
    }

    // check if we have permissions: 

    let userPermissions = getPermissions(user.permissions);

    let permissionCheck = comparePermissions(userPermissions, permission);

    if (permissionCheck) {
        return true;
    }

    // if we haven't found our permission in permission let's try roles: 

    let userRolesPermissions = getRolePermissions(user.roles);

    let rolePermissionCheck = comparePermissions(userRolesPermissions, permission);

    if (rolePermissionCheck) {
        return true;
    }

    // if we haven't found permission return false 
    return false;
}

// get user: 

function getUser(userId) {
    const users = db.users;
    for (let i = 0; i < users.length; i++) {
        if (users[i].id === userId) {
            return users[i];
        }
    }
    return false;
}

// get user permission names: 

// Note that, with real DB we will work slightly different, as was mentioned above. 
// So we don't have to use such hight time complexity 

function getPermissions(permissionIds) {
    const permissions = db.permissions;
    let namesForPermissons = [];
    for (let i = 0; i < permissionIds.length; i++) {
        for (let j = 0; j < permissions.length; j++) {
            if (permissionIds[i] === permissions[j].id) {
                namesForPermissons.push(permissions[j].access);
            }
        }
    }
    return namesForPermissons;
}

function getRolePermissions(roleIds) {
    const roles = db.roles;
    let rolesPermissionIds;
    // find roles permission ids: 
    for (let i = 0; i < roleIds.length; i++) {
        for (let j = 0; j < roles.length; j++) {
            if (roleIds[i] == roles[j].id) {
                rolesPermissionIds = rolesPermissionIds.concat(roles[j].permissions);
            }
        }
    }
    // now get permissions names: 
    let permissionNames = getPermissions(rolesPermissionIds);
    return permissionNames;
}

function comparePermissions(userPermissions, permission) {
    for (let i = 0; i < userPermissions; i++) {
        if (userPermissions === permission) {
            return true;
        }
    }
    // if nothing equal
    return false;
}