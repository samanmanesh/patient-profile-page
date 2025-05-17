import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type BreadcrumbNavigatorProps = {
  breadcrumbs: {
    label: string;
    href: string;
  }[];
  className?: string;
};

const BreadcrumbNavigator = ({ breadcrumbs, className }: BreadcrumbNavigatorProps) => {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList >
      <BreadcrumbSeparator />
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={breadcrumb.label}>
            <BreadcrumbItem>
              {index === breadcrumbs.length - 1 ? (
                <span className="text-base font-medium text-gray-900">
                  {breadcrumb.label}
                </span>
              ) : (
                <BreadcrumbLink
                  href={breadcrumb.href}
                  className="text-base font-medium text-gray-500 hover:text-gray-600"
                >
                  {breadcrumb.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbNavigator;
