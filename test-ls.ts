import { readFileSync } from 'fs';

// Since localStorage is browser-based, we can't read it from node. 
// BUT we can look at what Firebase has in emulator if it were running, or we can see what the sync algorithm would produce.
