import {
  BarChart3,
  Bell,
  Boxes,
  CalendarDays,
  ChevronsUpDown,
  ClipboardList,
  House,
  Inbox,
  ListFilter,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wordmark } from "@/components/wordmark";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const sidebarItems = [
  { label: "Overview", icon: House, active: true },
  { label: "Requests", icon: Inbox },
  { label: "Orders", icon: Boxes },
  { label: "Products", icon: ClipboardList, muted: true },
  { label: "Events", icon: CalendarDays, muted: true },
  { label: "Customers", icon: Users, muted: true },
  { label: "Analytics", icon: BarChart3, muted: true },
  { label: "Settings", icon: Settings },
];

const requests = [
  ["#1087", "Custom Apparel", "College Fest T-Shirts", "In Progress", "Jun 28, 2025"],
  ["#1086", "Event Setup", "Stage & Decor", "Quotation Sent", "Jun 27, 2025"],
  ["#1085", "Corporate Gifts", "Employee Welcome Kit", "Confirmed", "Jun 26, 2025"],
  ["#1084", "Print Materials", "Brochures & Banners", "In Progress", "Jun 25, 2025"],
  ["#1083", "Photography", "Event Coverage", "Delivered", "Jun 24, 2025"],
];

const MotionRow = motion.create(TableRow);
const MotionBadge = motion.create(Badge);

const EASE_OUT = [0.22, 1, 0.36, 1];

const badgeClasses = {
  "In Progress": "status-progress",
  "Quotation Sent": "status-quotation",
  Confirmed: "status-confirmed",
  Delivered: "status-confirmed",
};

/** Static product preview. `play` runs its one-time entrance: rows settle in, then badges pop. */
export function RequestDashboard({ play = true }) {
  return (
    <div className="dashboard" aria-hidden="true">
      <Card className="dashboard-card">
        <div className="dashboard-layout">
          <aside className="dashboard-sidebar">
            <Wordmark className="dashboard-wordmark" decorative />
            <div className="dashboard-side-nav">
              {sidebarItems.map(({ label, icon: Icon, active, muted }) => (
                <div
                  key={label}
                  className="dashboard-side-item"
                  data-active={active || undefined}
                  data-muted={muted || undefined}
                >
                  <Icon />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </aside>

          <div className="dashboard-main">
            <div className="dashboard-utility">
              <span className="notification-icon">
                <Bell />
                <i />
              </span>
              <span className="dashboard-avatar">R</span>
            </div>

            <h2>All Requests</h2>

            <Button disabled tabIndex={-1} className="dashboard-new-request disabled:opacity-100">
              <Plus />
              <span>New Request</span>
            </Button>

            <div className="dashboard-toolbar">
              <div className="dashboard-search">
                <Search />
                <Input
                  disabled
                  tabIndex={-1}
                  className="disabled:opacity-100"
                  placeholder="Search requests, products, or events..."
                />
              </div>
              <Button
                disabled
                tabIndex={-1}
                variant="outline"
                size="icon"
                className="dashboard-filter disabled:opacity-100"
              >
                <ListFilter />
              </Button>
            </div>

            <Table className="request-table">
              <TableHeader>
                <TableRow>
                  <TableHead className="number-column">
                    # <ChevronsUpDown />
                  </TableHead>
                  <TableHead className="type-column">
                    Type <i className="sort-diamond" />
                  </TableHead>
                  <TableHead className="requirement-column">Requirement</TableHead>
                  <TableHead className="status-column">Status</TableHead>
                  <TableHead className="date-column">Date</TableHead>
                  <TableHead className="action-column">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map(([number, type, requirement, status, date], index) => (
                  <MotionRow
                    key={number}
                    initial={{ opacity: 0, y: 10 }}
                    animate={play ? { opacity: 1, y: 0 } : undefined}
                    transition={{ duration: 0.55, delay: 0.35 + index * 0.08, ease: EASE_OUT }}
                  >
                    <TableCell className="number-column">{number}</TableCell>
                    <TableCell className="type-column">{type}</TableCell>
                    <TableCell className="requirement-column">{requirement}</TableCell>
                    <TableCell className="status-column">
                      <MotionBadge
                        className={badgeClasses[status]}
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={play ? { opacity: 1, scale: 1 } : undefined}
                        transition={{ type: "spring", stiffness: 420, damping: 18, delay: 0.75 + index * 0.08 }}
                      >
                        {status}
                      </MotionBadge>
                    </TableCell>
                    <TableCell className="date-column">{date}</TableCell>
                    <TableCell className="action-column">
                      <MoreHorizontal />
                    </TableCell>
                  </MotionRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
}
