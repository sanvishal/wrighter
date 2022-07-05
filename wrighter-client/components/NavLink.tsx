import NextLink, { LinkProps } from "next/link";

export default function NavLink({ href, children, ...props }: { href: string; children: React.ReactNode } & LinkProps) {
  return (
    <NextLink href={href}>
      <a {...props}>{children}</a>
    </NextLink>
  );
}
