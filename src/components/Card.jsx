export default function Card({ title, children, action }) {
  return (
    <section className="card">
      <div className="card-header">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
