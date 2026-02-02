import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button, Badge, StatCard } from "@/components/ui";
import { formatDate, formatRelativeDate } from "@/lib/utils";
import {
  Mail,
  Users,
  CheckCircle,
  Clock,
  Download,
  Send,
  UserPlus,
} from "lucide-react";

export const metadata = {
  title: "Newsletter - CMS",
};

async function getNewsletterStats() {
  const [
    totalSubscribers,
    confirmedSubscribers,
    pendingSubscribers,
    recentSubscribers,
  ] = await Promise.all([
    prisma.subscriber.count(),
    prisma.subscriber.count({ where: { status: "confirmed" } }),
    prisma.subscriber.count({ where: { status: "pending" } }),
    prisma.subscriber.findMany({
      where: { status: "confirmed" },
      orderBy: { confirmedAt: "desc" },
      take: 10,
    }),
  ]);

  return {
    totalSubscribers,
    confirmedSubscribers,
    pendingSubscribers,
    recentSubscribers,
  };
}

export default async function NewsletterPage() {
  const stats = await getNewsletterStats();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-2 dark:text-white">Newsletter</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Gérez vos abonnés et envoyez des newsletters
          </p>
        </div>
        <Button leftIcon={<Send className="h-4 w-4" />}>
          Nouvelle campagne
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          label="Abonnés confirmés"
          value={stats.confirmedSubscribers}
          icon={<CheckCircle className="h-6 w-6" />}
          color="#10b981"
        />
        <StatCard
          label="En attente de confirmation"
          value={stats.pendingSubscribers}
          icon={<Clock className="h-6 w-6" />}
          color="#f59e0b"
        />
        <StatCard
          label="Total inscriptions"
          value={stats.totalSubscribers}
          icon={<Users className="h-6 w-6" />}
          color="#0ea5e9"
        />
      </div>

      {/* Recent Subscribers */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-lg dark:text-white">Derniers abonnés</h2>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="h-4 w-4" />}
          >
            Exporter CSV
          </Button>
        </div>

        <div className="space-y-4">
          {stats.recentSubscribers.map((subscriber) => (
            <div
              key={subscriber.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50"
            >
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                <Mail className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-neutral-900 dark:text-white">
                  {subscriber.email}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Inscrit{" "}
                  {formatRelativeDate(
                    subscriber.confirmedAt || subscriber.createdAt,
                  )}
                  {subscriber.source && ` via ${subscriber.source}`}
                </p>
              </div>
              <Badge variant="success" size="sm">
                Confirmé
              </Badge>
            </div>
          ))}

          {stats.recentSubscribers.length === 0 && (
            <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
              Aucun abonné pour le moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
