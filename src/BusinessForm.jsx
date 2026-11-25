import React, { useState } from 'react';

const draftKey = 'kuda-today-application';

function loadDraft() {
  try {
    return { draft: JSON.parse(localStorage.getItem(draftKey)), error: '' };
  } catch {
    return { draft: null, error: 'Черновик не удалось загрузить.' };
  }
}

export default function BusinessForm() {
  const [{ draft, error }] = useState(loadDraft);
  const [status, setStatus] = useState(error);

  function saveDraft(event) {
    event.preventDefault();
    try {
      localStorage.setItem(draftKey, JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))));
      setStatus('Черновик сохранён в этом браузере.');
    } catch {
      setStatus('Браузер не разрешил сохранить черновик.');
    }
  }

  return (
    <section id="business" className="section business">
      <div>
        <h2>Для бизнеса</h2>
        <p>Расскажите о своём месте или событии. Рекламная карточка появится в подходящей подборке с пометкой «Реклама».</p>
        <p className="muted">В демоверсии заявка сохраняется в этом браузере.</p>
      </div>
      <form onSubmit={saveDraft}>
        <label>Название места<input name="venue" maxLength={100} required defaultValue={draft?.venue} /></label>
        <label>Email для связи<input name="email" type="email" maxLength={150} required defaultValue={draft?.email} /></label>
        <label>Что хотите разместить<textarea name="offer" rows={3} maxLength={1000} required defaultValue={draft?.offer} /></label>
        <button className="button" type="submit">Сохранить черновик</button>
        <p role="status">{status}</p>
      </form>
    </section>
  );
}
