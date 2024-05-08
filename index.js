const ExcelJS = require('exceljs');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

console.log('Bem-vindo Micael Barros');

const directoryPath = path.join('C:', 'Users', 'micae', 'Downloads', 'Teste');

// Carregar os arquivos apenas uma vez, inicialmente
let files;
try {
    files = fs.readdirSync(directoryPath);
    console.log('Arquivos encontrados:', files);
} catch (err) {
    console.error('Erro ao acessar o diretório:', err);
    return;
}

async function obterDadosDoExcel() {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile('Base/BASE.xlsx');
    const worksheet = workbook.getWorksheet(1);

    // Obter o link e o nome do arquivo
    const link = worksheet.getCell('A2').value;
    const fileName = worksheet.getCell('C3').value + '.pdf';  // Adicionar a extensão .pdf ao nome do arquivo
    return { link, fileName };
}

async function acessarLink(link, fileName, page) {
    await page.goto(link, { waitUntil: 'networkidle0' });

    try {
        const frameHandle = await page.waitForSelector('iframe[src*="obras_anexos.php?cod=64675"]');
        const frame = await frameHandle.contentFrame();
        if (!frame) {
            console.log('Iframe não encontrado.');
            return;
        }
        console.log('Iframe encontrado.');

        const inputHandle = await frame.waitForSelector('input[name="arq[]"]', { timeout: 60000 });
        if (!inputHandle) {
            console.log('Input não encontrado.');
            return;
        }
        console.log('Input encontrado.');

        const filePath = path.join(directoryPath, fileName);
        if (fs.existsSync(filePath)) {
            await inputHandle.uploadFile(filePath);
            console.log('Upload do arquivo ' + fileName + ' realizado.');
        } else {
            console.log('Arquivo ' + fileName + ' não encontrado.');
        }
    } catch (error) {
        console.error('Erro ao esperar pelo seletor dentro do iframe:', error.message);
    }
}

async function robo() {
    require('dotenv').config();
    console.log(process.env.EMAIL);
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 250,
        defaultViewport: null,
        args: ['--start-maximized'],
    });

    const page = await browser.newPage();
    await page.goto('https://beqce.gpm.srv.br/index.php');
    
    await page.evaluate(email => {
        document.querySelector('#idLogin').value = email;
    }, process.env.EMAIL);
    
    await page.evaluate(senha => {
        document.querySelector('#idSenha').value = senha;
    }, process.env.SENHA);
    
    await page.keyboard.press("Enter");
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    const { link, fileName } = await obterDadosDoExcel();
    console.log('Acessando link:', link);
    console.log('Procurando arquivo:', fileName);
    await acessarLink(link, fileName, page);

    await browser.close();
}

robo();
