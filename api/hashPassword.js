import bcrypt from "bcryptjs";

async function generateHash() {
  const hash = await bcrypt.hash("newadmin123", 10);
  console.log("Hash:", hash);
}

generateHash();
