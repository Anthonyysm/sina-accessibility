const BASE = '/api/atividades'

export const atividadeService = {
  listar: () =>
    fetch(BASE).then(r => r.json()),

  buscarPorId: (id: number) =>
    fetch(`${BASE}/${id}`).then(r => r.json()),

  criar: (data: object) =>
    fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  atualizar: (id: number, data: object) =>
    fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  deletar: (id: number) =>
    fetch(`${BASE}/${id}`, { method: 'DELETE' })
      .then(r => r.json()),
}