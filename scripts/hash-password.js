import { hashPassword } from '../auth.js';
// Read from stdin so the password is not exposed in process arguments/history.
let password = '';
for await (const chunk of process.stdin) password += chunk;
password = password.replace(/\r?\n$/, '');
if (password.length < 14 || Buffer.byteLength(password) > 1024) {
  console.error('Use a unique password of at least 14 characters (at most 1024 bytes).');
  process.exit(1);
}
console.log(hashPassword(password));
