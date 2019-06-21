/**
 * POST /request
 * Create a new request
 */

const Database = require('./shared/db.js');
const dotenv = require('dotenv');
const nanoid = require('nanoid');

const checkIdUniqueness = async (id, db) => {

    let found = false;

    try {

        // try to get document by it's ID
        await db.get(id);

        found = true;
    }
    catch (err) {

        if (err.message !== 'missing') {

            throw err;
        }
    }

    return found;
}

const main = async (dto) => {

    // load environment variables
    dotenv.config();

    const { client, db } = Database.connect();

    /**
     * request: {
     *      resource: '',
     *      time: '',
     *      date: '',
     *      location: '',
     *      profile: {},
     *      channel: {
     *          name: 'watson:sms',
     *          meta: {}
     *      }
     * }
     */

    // change / to -
    dto.date = dto.date.split('/').join('-');

    let id = nanoid(10);
    let isUnique = false;

    // generate a unique identifier
    while (!isUnique) { isUnique = await checkIdUniqueness(id, db); }

    await db.insert({
        type: 'request',
        channel: { ...dto.channel },

        profile: { ...dto.profile },
        needAt: `${dto.date}T${dto.time}`,
        createdAt: new Date(),

        meta: {},
        raw: { ...dto },

    }, id);
};

module.exports.main = main;