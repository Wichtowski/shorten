import Link from "next/link";

export default function NotFound() {
  return (
    <section className="frame py-14">
      <h1 className="display text-[clamp(6rem,30vw,22rem)]">404</h1>
      <p className="mt-6 max-w-xl text-lg leading-7">
        Nothing lives at this address.{" "}
        <Link href="/" className="text-link">
          Make a short link
        </Link>
      </p>
    </section>
  );
}
