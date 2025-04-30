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
        'Utilizador',
        'Viatura',
        'Tarefa',
        'Data',
        'Hora Início',
        'Hora Fim',
        'Duração',
      ]);
    }

    const arredondarDuracao = (minutos) => {
      if (minutos <= 30) return '30m';
      if (minutos <= 60) return '1h';
      if (minutos <= 90) return '1h30';
      if (minutos <= 120) return '2h';
      if (minutos <= 150) return '2h30';
      if (minutos <= 180) return '3h';
      if (minutos <= 210) return '3h30';
      if (minutos <= 240) return '4h';
      if (minutos <= 270) return '4h30';
      if (minutos <= 300) return '5h';
      if (minutos <= 330) return '5h30';
      if (minutos <= 360) return '6h';
      if (minutos <= 390) return '6h30';
      if (minutos <= 420) return '7h';
      if (minutos <= 450) return '7h30';
      if (minutos <= 480) return '8h';
      
      return `${Math.floor(minutos / 60)}h`;
    };

    const linhas = registos.map((r) => {
      const [h1, m1] = r.horaInicio.split(':').map(Number);
      const [h2, m2] = r.horaFim.split(':').map(Number);
      const minutos = (h2 * 60 + m2) - (h1 * 60 + m1);

      return {
        Utilizador: r.username,
        Viatura: r.viatura,
        Tarefa: r.tarefa,
        Data: r.data,
        'Hora Início': r.horaInicio,
        'Hora Fim': r.horaFim,
        Duração: arredondarDuracao(minutos),
      };
    });

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
