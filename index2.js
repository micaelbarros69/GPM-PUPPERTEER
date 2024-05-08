const ExcelJS = require('exceljs');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

console.log('Bem-vindo Micael Barros');

const directoryPath = path.join('C:', 'Users', 'micae', 'Downloads', 'Teste');

async function obterDadosDoExcel() {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile('Base/BASE.xlsx');
    const worksheet = workbook.getWorksheet(1);
    const link = worksheet.getCell('A2').value;
    const folderName = worksheet.getCell('C3').text;
    return { link, folderName };
}

async function acessarLink(link, folderPath, page) {
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

        const filesToUpload = fs.readdirSync(folderPath).map(file => path.join(folderPath, file));
        await inputHandle.uploadFile(...filesToUpload);
        console.log('Tentativa de upload realizada.');
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
    
    // Login
    await page.evaluate(email => {
        document.querySelector('#idLogin').value = email;
    }, process.env.EMAIL);
    
    await page.evaluate(senha => {
        document.querySelector('#idSenha').value = senha;
    }, process.env.SENHA);
    
    await page.keyboard.press("Enter");
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    const { link, folderName } = await obterDadosDoExcel();
    console.log('Acessando link:', link);

    const specificFolderPath = path.join(directoryPath, folderName);
    if (!fs.existsSync(specificFolderPath)) {
        console.log('Pasta específica não encontrada:', folderName);
        await browser.close();
        return;
    }

    await acessarLink(link, specificFolderPath, page);
    await browser.close();
}

robo();
