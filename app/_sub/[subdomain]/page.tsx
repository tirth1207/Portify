export default function SubdomainPage({ params }: { params: { subdomain: string } }) {
  return (
    <div>
      <h1>Subdomain: {params.subdomain}</h1>
      <p>This is the portfolio for {params.subdomain}</p>
    </div>
  );
}
