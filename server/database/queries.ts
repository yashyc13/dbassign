import { pool } from '../config/db.js';
import { User } from './User.js';

class Queries {
    static async getAllUsers() {
        const query = 'SELECT * FROM users';
        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getUserById(id: number) {
        const query = 'SELECT * FROM users WHERE id = $1';
        try {
            const result = await pool.query(query, [id]);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async createUser(user: User) {
        const query = 'INSERT INTO users (firstname, middlename, lastname, email, phone, role, address) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
        try {
            const result = await pool.query(query, [
                user.firstname,
                user.middlename,
                user.lastname,
                user.email,
                user.phone,
                user.role,
                user.address
            ]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async updateUser(user: User) {
        const query = 'UPDATE users SET firstname = $1, middlename = $2, lastname = $3, email = $4, phone = $5, role = $6, address = $7 WHERE id = $8 RETURNING *';
        try {
            const result = await pool.query(query, [
                user.firstname,
                user.middlename,
                user.lastname,
                user.email,
                user.phone,
                user.role,
                user.address,
                user.id
            ]);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async deleteUser(id: number) {
        const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
        try {
            const result = await pool.query(query, [id]);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

export default Queries;