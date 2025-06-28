import { type Metadata } from "next"

type PageProps = {
  params: {
    subdomain: string
  }
}

export default function SubdomainPage({ params }: PageProps) {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Hello from subdomain</h1>
      <p>Subdomain: <strong>{params.subdomain}</strong></p>
    </main>
  )
}
