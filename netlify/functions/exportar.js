import { GoogleSpreadsheet } from 'google-spreadsheet';
import creds from './credentials.json';

const SHEET_ID = '18iEuvgAN7R9n1fpVGpaeug9EX_oFVR38dQxGxG6TskQ';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const registos = req.body;

    const doc = new GoogleSpreadsheet(SHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: creds.client_email,
      private_key: creds.private_key.replace(/\\n/g, '\n'),
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

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

    const linhas = registos.map((r) => ({
      Utilizador: r.username,
      Viatura: r.viatura,
      Tarefa: r.tarefa,
      Data: r.data,
      'Hora Início': r.horaInicio,
      'Hora Fim': r.horaFim,
    }));

    await sheet.addRows(linhas);

    return res.status(200).json({ message: 'Exportado com sucesso!' });
  } catch (error) {
    console.error('Erro na exportação:', error);
    return res.status(500).json({ error: 'Erro ao exportar para o Google Sheets' });
  }
};
