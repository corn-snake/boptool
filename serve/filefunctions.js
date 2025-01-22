async function callR2(filename) {
    if(filename.endsWith(-1)) return null;
    let c = await fetch(`https://pub-39bf6017a88940239bb1258737c95ffe.r2.dev/${filename}.bb`);
    if (c.status == 404) return null;
    let h = await c.text();
    return h;
}
export { callR2 };