import React, { useEffect, useRef, useState } from 'react';
import BusinessForm from './BusinessForm.jsx';
import { places } from './places.js';

const filters = [
  ['today', 'Сегодня'],
  ['weekend', 'На выходных'],
  ['budget', 'До 1 000 ₽'],
  ['group', 'Для компании'],
];
const currency = new Intl.NumberFormat('ru-RU', {
  style: 'currency', currency: 'RUB', maximumFractionDigits: 0,
});
const priceLabel = (price) => price === 0 ? 'Бесплатно' : currency.format(price);
const photo = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;

function PlaceCard({ place, onOpen }) {
  return (
    <article className="card">
      <img src={photo(place.image)} alt="" loading="lazy" />
      {place.ad && <span className="ad">Реклама</span>}
      <div className="card-body">
        <p className="muted">{place.category} · {place.time}</p>
        <h3><button type="button" onClick={() => onOpen(place)}>{place.title}</button></h3>
        <p><strong>{priceLabel(place.price)}</strong></p>
      </div>
    </article>
  );
}

function PlaceDetails({ place, onClose }) {
  const dialog = useRef(null);

  useEffect(() => {
    if (place && !dialog.current.open) dialog.current.showModal();
  }, [place]);

  const map = new URL('https://yandex.ru/maps/');
  if (place) map.searchParams.set('text', `Москва, ${place.address}`);

  return (
    <dialog ref={dialog} aria-labelledby="details-title" onClose={onClose}>
      <form method="dialog"><button className="close" aria-label="Закрыть">×</button></form>
      {place && (
        <>
          <img className="details-photo" src={photo(place.image)} alt="" />
          <p className="muted">{place.ad && 'Реклама · '}{place.category} · Демо</p>
          <h2 id="details-title">{place.title}</h2>
          <p>{place.description}</p>
          <p><strong>{priceLabel(place.price)}</strong> · {place.time}</p>
          <p>{place.address}</p>
          <a className="button" href={map.href} target="_blank" rel="noopener">Открыть адрес на карте</a>
        </>
      )}
    </dialog>
  );
}

export default function App() {
  const [active, setActive] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const days = active.filter((filter) => filter === 'today' || filter === 'weekend');
  const visible = places.filter((place) =>
    (!days.length || days.some((day) => place.days.includes(day))) &&
    (!active.includes('budget') || place.price <= 1000) &&
    (!active.includes('group') || place.group)
  );

  function toggleFilter(filter) {
    setActive((previous) => previous.includes(filter)
      ? previous.filter((item) => item !== filter)
      : [...previous, filter]);
  }

  return (
    <>
      <header className="top wrap">
        <a className="brand" href="./">куда<span>?</span></a>
        <nav aria-label="Навигация"><a href="#places">Афиша</a><a href="#business">Для бизнеса</a></nav>
      </header>
      <main className="wrap">
        <section className="hero">
          <div className="hero-copy">
            <p className="city">Москва · Басманный район</p>
            <h1>Куда<br />сегодня<span>?</span></h1>
            <p>Керамика, выставки и кофе с друзьями. Найди план на вечер или выходные.</p>
            <a className="button" href="#places">Смотреть афишу</a>
          </div>
        </section>
        <section id="places" className="section">
          <h2>Выбрать план</h2>
          <p className="muted">Демо-афиша с примерами мест, цен и расписания.</p>
          <div className="filters" role="group" aria-label="Фильтры афиши">
            {filters.map(([filter, label]) => (
              <button key={filter} type="button" aria-pressed={active.includes(filter)} onClick={() => toggleFilter(filter)}>
                {label}
              </button>
            ))}
          </div>
          <p className="muted" aria-live="polite">
            {visible.length ? `Найдено предложений: ${visible.length}` : 'Подходящих предложений нет. Попробуй изменить фильтры.'}
          </p>
          <div className="grid">
            {visible.map((place) => <PlaceCard key={place.title} place={place} onOpen={setSelectedPlace} />)}
          </div>
        </section>
        <BusinessForm />
      </main>
      <footer className="wrap footer">Куда сегодня? · Демо-афиша Москвы</footer>
      <PlaceDetails place={selectedPlace} onClose={() => setSelectedPlace(null)} />
    </>
  );
}
