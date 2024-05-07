const ExcelJS = require('exceljs');
const puppeteer = require('puppeteer');
const readlineSync = require('readline-sync');


console.log('Bem vindo Micael Barros');



async function obterLinkDoExcel() {
  // Criar uma nova instância do Workbook do ExcelJS
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('Base/BASE.xlsx'); // Ajuste o caminho do arquivo
  const worksheet = workbook.getWorksheet(1); // Acessa a primeira planilha

  // Obter o valor da célula específica, supondo que o link esteja na célula A2
  const link = worksheet.getCell('A2').value;
  return link;
}



async function robo() {
  require('dotenv').config();
 console.log(process.env.EMAIL);
  const browser = await puppeteer.launch({ 
    headless: false, 
    slowMo: 250,
    defaultViewport: null,
    args:['--start-maximized' ], 
    
    
});
  const page = await browser.newPage();
  const qualquerUrl = `https://beqce.gpm.srv.br/index.php`;
  const qualquerUrl2 = `https://beqce.gpm.srv.br/cadastro/geral/obras.php?action=alter&popup=1&cod=64675&cont=34&cellStyle=true&link=1`;
  const qualquerUrl3 = `https://beqce.gpm.srv.br/cadastro/geral/obras.php?action=alter&popup=1&cod=64675&cont=34&cellStyle=true&link=1`;
  
  await page.goto(qualquerUrl);
  // await page.screenshot({path: 'example.png'});
  await page.evaluate((email)=>{ 
    let input = document.querySelector('#idLogin')
    input.value = email
  }, process.env.EMAIL)
  await page.evaluate((senha)=>{
    let input = document.querySelector('#idSenha')
    input.value = senha
  }, process.env.SENHA)
  await page.keyboard.press("Enter")
  // await page.goto(qualquerUrl2);

  
////////////ETAPA 2///////////

  async function acessarLink(link) {
    
    // Navegar para o link extraído
    await page.goto(link,  { waitUntil: 'networkidle0' }); // Use networkidle0 para esperar pela inatividade da rede);

    // await page.goto(qualquerUrl3,  { waitUntil: 'networkidle0' }); // Use networkidle0 para esperar pela inatividade da rede);
  try {
    // Espera pelo iframe e obtém o frameHandle
    const frameHandle = await page.waitForSelector('iframe[src*="obras_anexos.php?cod=64675"]');
    const frame = await frameHandle.contentFrame();
    if (frame) {
      console.log('Iframe encontrado.');
    } else {
      console.log('Iframe não encontrado.');
      return;
    }

    // Dentro do iframe, agora busca pelo input
    const inputHandle = await frame.waitForSelector('input[name="arq[]"]', { timeout: 60000 });
    if (inputHandle) {
      console.log('Input encontrado.');
      await inputHandle.uploadFile('Doc/kml.pdf');
      console.log('Tentativa de upload realizada.');
    } else {
      console.log('Input não encontrado.');
    }
  } catch (error) {
    console.error('Erro ao esperar pelo seletor dentro do iframe:', error.message);
  }

    // Fechar o navegador
    await browser.close();
}

async function main() {
    const link = await obterLinkDoExcel();
    console.log('Acessando link:', link); // Opcional, para debug
    await acessarLink(link);
}

main();
  
}

robo();''