const { deepStrictEqual } = require('assert');
const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository {
    constructor(fileName) {
        if (!fileName) {
            throw new Error('File name required.');
        }

        this.fileName = fileName;
        try {
            fs.accessSync(this.fileName);
        } catch (err) {
            fs.writeFileSync(this.fileName, '[]');
        }
    };

    async getAll() {
        return JSON.parse(await fs.promises.readFile(this.fileName, { encoding: 'utf8' }));
    }

    async create(attrs) {

        attrs.id = this.randomId();
        const salt = crypto.randomBytes(8).toString('hex');
        const buff = await scrypt(attrs.password, salt, 64);

        const records = await this.getAll();
        const record = {
            ...attrs,
            password: `${buff.toString('hex')}.${salt}`
        };
        records.push(record);
        await this.writeAll(records);

        return record;

    }

    async comparePasswords(saved, supplied) {
        // const result = saved.split('.');
        // const hashed = result[0];
        // const salt = result[1];
        const [hashed, salt] = saved.split('.');
        const hashedSuppliedBuff = await scrypt(supplied, salt, 64);
        return hashed === hashedSuppliedBuff.toString('hex');
    }

    async writeAll(records) {
        await fs.promises.writeFile(this.fileName, JSON.stringify(records, null, 2));
    }

    randomId() {
        return crypto.randomBytes(4).toString('hex');
    }

    async getOne(id) {
        const records = await this.getAll();
        return records.find(record => record.id === id);

    }

    async delete(id) {
        const records = await this.getAll();
        const filteredRecords = records.filter(record => record.id !== id);
        await this.writeAll(filteredRecords);
    }

    async update(id, attrs) {
        const records = await this.getAll();
        const record = records.find(record => record.id === id);
        if (!record) {
            throw new Error(`Record with id ${id} not found.`);
        }
        // console.log(records.indexOf(record));
        Object.assign(record, attrs);
        await this.writeAll(records);
    }

    async getOneBy(filters) {
        const records = await this.getAll();
        for (let record of records) {
            let found = true;

            for (let key in filters) {
                if (record[key] !== filters[key]) {
                    found = false;
                }
            }
            if (found) {
                return record;

            }
        }

    }
};

module.exports = new UsersRepository('users.json');