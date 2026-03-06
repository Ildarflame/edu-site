import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — EduDeals",
  description: "Learn about EduDeals and our mission to help students, startups, and open source projects.",
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-6">
        About{" "}
        <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          EduDeals
        </span>
      </h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 leading-relaxed">
          EduDeals is a curated directory of free tools, services, and perks available for
          students, startups, and open source projects. We aggregate the best deals so you
          don&apos;t have to hunt for them.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-4">Our Mission</h2>
        <p className="text-gray-600 leading-relaxed">
          Many amazing companies offer free or heavily discounted plans for students,
          early-stage startups, and open source maintainers. But these offers are scattered
          across hundreds of websites. We bring them all together in one place.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-4">Want to suggest a deal?</h2>
        <p className="text-gray-600 leading-relaxed">
          Know of a service that offers free perks? We&apos;d love to hear about it!
          Open an issue on our{" "}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            GitHub repository
          </a>{" "}
          or reach out to us directly.
        </p>
      </div>

      <div className="mt-12">
        <Link
          href="/deals"
          className="inline-flex items-center gap-2 px-8 py-3 text-base font-semibold text-white rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:shadow-xl hover:shadow-purple-200 transition-all"
        >
          Browse Deals &rarr;
        </Link>
      </div>
    </main>
  );
}
