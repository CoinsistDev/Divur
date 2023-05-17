import { seedBlackList } from './seed-blacklist'

async function DeleteAllAndInsert() {
    try {
        await seedBlackList()
        process.exit()
    } catch (err) {
        console.log(`${err}`)
        process.exit(1)
    }
}


async function DeleteTables() {
    process.exit()
}

(async () => {
    if (process.argv[2] === '-d') {
        DeleteTables()
    } else {
        try {
            console.log('DeleteAllAndInsert');
            await DeleteAllAndInsert()
        } catch (error) {
            console.log(error);
        }
    }
})();
