const XLSX = require('xlsx');

// Carrega o arquivo Excel
const workbook = XLSX.readFile('C:/Users/micae/OneDrive/Área de Trabalho/webgpm/BASE.xlsx>');

// Obtém a primeira aba da planilha (ajuste conforme necessário)
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Converte a aba em um array de objetos JavaScript
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // O parâmetro { header: 1 } faz o método retornar um array de arrays

// Processa os dados
data.forEach((row, index) => {
  if (index === 0) return; // Pula o cabeçalho se houver um
  const ot = row[0]; // Primeira coluna: OT
  const info = row[1]; // Segunda coluna: Informação associada
  console.log(`OT: ${ot}, Info: ${info}`);
});