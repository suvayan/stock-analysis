const crypto = require("crypto");
const key1 = crypto.randomBytes(32).toString("hex");
const key2 = crypto.randomBytes(32).toString("hex");
console.log({ key1, key2 });

/*

{
  key1: '2098d78a426c3c92c7922d57affbffed700be5fbe7a95837e4405efe67c171c2',
  key2: 'c779d93eaefb067b32402214b37c90496f771edcbf774ade2064c3f97e2dc361' 
}
*/
