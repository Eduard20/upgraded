import {mkdir,copyFile,cp,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist');
for(const file of ['index.html','styles.css','app.js','core.js']) await copyFile(file,`dist/${file}`);
await cp('data','dist/data',{recursive:true});await copyFile('.nojekyll','dist/.nojekyll');
console.log('Built static site in dist/');
