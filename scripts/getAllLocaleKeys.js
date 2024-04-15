const fs = require("fs");
const path = require("path");

const commandsFolderPath = path.join(process.cwd(), "../imperia/src", "locales/en-US/commands");

function propertiesToArray(obj, name) {
    const isObject = (val) => typeof val === "object" && !Array.isArray(val);

    const addDelimiter = (a, b) => {
        return a ? `${a}.${b}` : b;
    };

    const paths = (obj = {}, head = "") => {
        return Object.entries(obj).reduce((product, [key, value]) => {
            let fullPath = addDelimiter(head, key);
            return isObject(value) ? product.concat(paths(value, fullPath)) : product.concat(fullPath);
        }, []);
    };
    return paths(obj);
}

const readAllFiles = (dir) => {
    const files = fs.readdirSync(dir);
    const result = [];
    files.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            result.push(...readAllFiles(filePath));
        } else {
            result.push(filePath);
        }
    });
    return result;
};

const commandsDirectory = readAllFiles(commandsFolderPath);

const commands = commandsDirectory.map((file) => {
    const fileContent = fs.readFileSync(file, "utf8");
    const fileContentJSON = JSON.parse(fileContent);
    console.log(
        propertiesToArray(fileContentJSON).map((i) => `commands/${path.basename(file, ".json").split("/")}:` + i)
    );
});
