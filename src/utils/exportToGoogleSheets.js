import { GoogleSpreadsheet } from 'google-spreadsheet';
import creds from './credentials.json'; // Certifica-te que colocaste aqui o ficheiro JSON

const SHEET_ID = '18iEuvgAN7R9n1fpVGpaeug9EX_oFVR38dQxGxG6TskQ';

export const exportToGoogleSheets = async (registos) => {
  try {
    const doc = new GoogleSpreadsheet(SHEET_ID);

    // Autenticação com os campos descompactados
    await doc.useServiceAccountAuth({
      client_email: creds.client_email,
      private_key: creds.private_key.replace(/\\n/g, '\n'),
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0]; // Usa a primeira folha

    // Adiciona cabeçalhos se necessário
    if (sheet.headerValues.length === 0) {
      await sheet.setHeaderRow([
        'Utilizador',
        'Viatura',
        'Tarefa',
        'Data',
        'Hora Início',
        'Hora Fim',
      ]);
    }

    // Prepara as linhas para exportar
    const linhas = registos.map((r) => ({
      Utilizador: r.username,
      Viatura: r.viatura,
      Tarefa: r.tarefa,
      Data: r.data,
      'Hora Início': r.horaInicio,
      'Hora Fim': r.horaFim,
    }));

    await sheet.addRows(linhas);
    alert('Dados exportados com sucesso para o Google Sheets!');
  } catch (error) {
    console.error('Erro ao exportar para o Google Sheets:', error);
    alert('Erro ao exportar para o Google Sheets.');
  }
};
