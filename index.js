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
  const qualquerUrl = `https://acenderce.gpm.srv.br/index.php`;
  const qualquerUrl2 = `https://acenderce.gpm.srv.br/gpm/geral/incluir_servico.php`;
  
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
  await page.keyboard.press("Tab")
  await page.keyboard.type("LINHA VIVA")
  await page.keyboard.press("Enter")
  // RETORNO DE CAMPO
  await page.keyboard.press("Tab")
  await page.keyboard.press("Tab")
  await page.keyboard.type("242")
  // EQUIPE
  for (let i = 0; i < 13; i++) {
    await page.keyboard.press('Tab');}

  await page.keyboard.type("CND")
  await page.keyboard.press("Enter")

  // ORIGEM DE SERVIÇO
  await page.keyboard.press("Tab")
  await page.keyboard.type("NOVO SERVIÇO")
  await page.keyboard.press("Enter")
  // ZONA DE CADASTRO
  for (let i = 0; i < 7; i++) {
  await page.keyboard.press('Tab');}
  await page.keyboard.type("RURAL")
  await page.keyboard.press("Enter")

  // Id do cliente
  await page.evaluate(()=>{ 
    let input = document.querySelector('#idcliente')
    input.value = "LINHA VIVA"
  })
  // Data Ex
  await page.evaluate(()=>{ 
    let input = document.querySelector('#dat_exec')
    input.value = "08/09/2023"
  })

  // Observação
  await page.evaluate(()=>{ 
    let input = document.querySelector('#tx_obs_central')
    input.value = "LINHA VIVA"
  })

  await page.click('#idSubmit');


  
  







 

    
 


  
  

  
}

robo();''