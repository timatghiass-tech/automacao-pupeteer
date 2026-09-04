const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    console.log('[1/4] Iniciando Chromium invisivel (Headless)...');
    
    // HEADLESS: TRUE -> Nao abre janela visual
    const browser = await puppeteer.launch({ 
        headless: true 
    });

    const page = await browser.newPage();

    console.log('[2/4] Acessando a pagina em segundo plano...');
    await page.goto('https://en.wikipedia.org/wiki/List_of_programming_languages', { 
        waitUntil: 'domcontentloaded' 
    });

    console.log('[3/4] Raspando lista de linguagens...');
    const languages = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('.div-col li a'));
        return links.slice(0, 25).map(link => ({
            name: link.innerText.trim(),
            url: link.href
        }));
    });

    console.log('[4/4] Convertendo dados para CSV...');
    let csvContent = 'Nome da Linguagem,Link Oficial\n';
    
    languages.forEach(item => {
        const cleanName = item.name.replace(/"/g, '""');
        csvContent += `"${cleanName}","${item.url}"\n`;
    });

    fs.writeFileSync('languages.csv', csvContent, 'utf-8');
    console.log(`\nSucesso! 25 itens salvos em 'languages.csv'!`);

    await browser.close();
    console.log('Processo finalizado.');
})();