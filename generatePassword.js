const bcrypt = require("bcryptjs");

async function generate() {
    const password = "Pakistan@123";

    const hash = await bcrypt.hash(password, 12);

    console.log("Password hash:");
    console.log(hash);
}

generate();