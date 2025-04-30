const { GoogleSpreadsheet } = require('google-spreadsheet');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método não permitido' }),
    };
  }

  try {
    const registos = JSON.parse(event.body);

    const creds = {
      client_email: process.env.GS_CLIENT_EMAIL,
      private_key: process.env.GS_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };

    const doc = new GoogleSpreadsheet('18iEuvgAN7R9n1fpVGpaeug9EX_oFVR38dQxGxG6TskQ');
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];

    if (!sheet.headerValues || sheet.headerValues.length === 0) {
      await sheet.setHeaderRow([
        'Utilizador', 'Viatura', 'Tarefa', 'Data', 'Hora Início', 'Hora Fim',
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

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Exportado com sucesso!' }),
    };
  } catch (error) {
    console.error('Erro ao exportar:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao exportar para o Google Sheets.' }),
    };
  }
};
