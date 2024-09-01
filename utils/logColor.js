import chalk from "chalk";

const options  = {
    success: {
        default: chalk.green,
        bgcolor: chalk.bgGreen.white,
    },
    error: {
        default: chalk.red,
        bgcolor: chalk.bgRed.white,
    },
    blue: {
        default: chalk.blue,
        underline: chalk.blue.underline,
        bgcolor: chalk.bgBlue.white,
    },
    cyan: {
        default: chalk.cyan,
        underline: chalk.cyan.underline,
        bgcolor: chalk.bgCyan.white,
    }
}
const getCurrentTime = async () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `[${hours}:${minutes}:${seconds} - ${day}/${month}/${year}]`;
};

const print = async (message, option) => {
    let timestamp = await getCurrentTime()
    console.log('\n')
    console.log(`${chalk.yellow(timestamp)}: ${option(message)}`)
}


export {
    options,
    print,
}