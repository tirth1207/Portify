export default function SubdomainPage({ params }: { params: { subdomain: string } }) {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Hello from subdomain</h1>
      <p>Subdomain: <strong>{params.subdomain}</strong></p>
    </main>
  );
}
