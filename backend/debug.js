const bcrypt = require('bcrypt');

const plainPassword = "123456";
const storedHashedPassword = "$2b$10$XSfp1NP4DIn1Bns25MdhYO0ylBrZjO/H/k201f2rsM26MEzzPZPz."; // From MongoDB

bcrypt.compare(plainPassword, storedHashedPassword, (err, result) => {
  if (err) {
    console.error("Error during comparison:", err);
  } else {
    console.log("Passwords match:", result);
  }
});