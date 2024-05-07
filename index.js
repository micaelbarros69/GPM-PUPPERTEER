
const puppeteer = require('puppeteer');
const readlineSync = require('readline-sync');


console.log('Bem vindo Micael Barros');



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
  const qualquerUrl3 = 'https://beqce.gpm.srv.br/cadastro/geral/obras.php?action=alter&cod=64675&cont=34&cellStyle=true&link=9';
  
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
  // Serviços
  // service = await page.waitForXPath('//*[@id="2000"]/a')
  // service.click();
  // apontamento
  // ap = await page.waitForXPath('//*[@id="jt9"]/a[2]')
  // ap.click();
  await page.goto(qualquerUrl2);
  // TIPO DE SERVIÇO
  // await page.keyboard.press("Tab")
  // await page.keyboard.type("LINHA VIVA")
  // await page.keyboard.press("Enter")
  // // RETORNO DE CAMPO
  // await page.keyboard.press("Tab")
  // await page.keyboard.press("Tab")
  // await page.keyboard.type("242")
  // // EQUIPE
  // for (let i = 0; i < 13; i++) {
  //   await page.keyboard.press('Tab');}

  // await page.keyboard.type("CND")
  // await page.keyboard.press("Enter")

  // // ORIGEM DE SERVIÇO
  // await page.keyboard.press("Tab")
  // await page.keyboard.type("NOVO SERVIÇO")
  // await page.keyboard.press("Enter")
  // // ZONA DE CADASTRO
  // for (let i = 0; i < 7; i++) {
  // await page.keyboard.press('Tab');}
  // await page.keyboard.type("RURAL")
  // await page.keyboard.press("Enter")

  // // Id do cliente
  // await page.evaluate(()=>{ 
  //   let input = document.querySelector('#idcliente')
  //   input.value = "LINHA VIVA"
  // })
  // // Data Ex
  // await page.evaluate(()=>{ 
  //   let input = document.querySelector('#dat_exec')
  //   input.value = "08/09/2023"
  // })

  // // Observação
  // await page.evaluate(()=>{ 
  //   let input = document.querySelector('#tx_obs_central')
  //   input.value = "LINHA VIVA"
  // })

  await page.goto(qualquerUrl3,  { waitUntil: 'networkidle0' }); // Use networkidle0 para esperar pela inatividade da rede);


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


  // const inputUploadHandle = await page.waitForSelector('input[type="file"]');
  // const fileToUpload = 'Doc/kml.pdf';
  // await inputUploadHandle.uploadFile(fileToUpload);

  // for (let i = 0; i < 71; i++) {
  //      await page.keyboard.press('Tab');}
      //  await page.keyboard.press("Enter")
       

 



  







 

    
 


  
  

  
}

robo();''