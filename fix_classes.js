const fs = require('fs');

['d:/STEM/IBOCS2/IBOCS/IBOCS/HTML/src/main/resources/static/admin_PLList.html', 
 'd:/STEM/IBOCS2/IBOCS/IBOCS/HTML/src/main/resources/static/admin_PLadd.html'].forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Fix CSS selectors: .col-1, .col-2, etc.
    content = content.replace(/\.col-(\d+)\b/g, '.grid-col-$1');
    
    // Fix HTML classes: class="col-1", class="field col-2", etc.
    // Also matches things inside quotes.
    content = content.replace(/\bcol-(\d+)\b/g, 'grid-col-$1');
    
    fs.writeFileSync(file, content, 'utf8');
});

console.log("Fixed classes");


