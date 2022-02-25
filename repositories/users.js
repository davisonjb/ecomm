const { deepStrictEqual } = require('assert');
const fs = require('fs');
const crypto = require('crypto');

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

        const records = await this.getAll();
        records.push(attrs);
        await this.writeAll(records);

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
};

const test = async() => {
    const repo = new UsersRepository('users.json');

    const user = await repo.getOne('e27beade');

    console.log(user);
}

test();