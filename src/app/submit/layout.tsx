import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a Deal — StudentPerks",
  description: "Know a free tool or perk for students, startups, or open source? Submit it to StudentPerks.",
};

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
