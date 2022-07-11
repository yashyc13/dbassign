enum Role {
    SUPERADMIN = 'SUPERADMIN',
    ADMIN = 'ADMIN',
    SUBSCRIBER = 'SUBSCRIBER'
};

class User {
    id: number;
    firstname: string;
    middlename: string;
    lastname: string;
    email: string;
    phone: string;
    role: Role;
    address: string;
    constructor({
        id,
        firstname,
        middlename,
        lastname,
        email,
        phone,
        role,
        address
    }: User) {
        this.id = id;
        this.firstname = firstname;
        this.middlename = middlename;
        this.lastname = lastname;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.address = address;
    }
}

export {User, Role};