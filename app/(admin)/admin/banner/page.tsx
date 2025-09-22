import { DataTable } from "./components/data.table";
import { columns } from "./components/columns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getBanners } from "@/lib/controller/home/banner";

const ManageBanner = async () => {
  const banners = await getBanners();

  return (
    <main className="space-y-4 md:space-y-6 pb-24 md:pb-12">
      <div className="pt-2 md:pt-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-3xl font-bold tracking-tight">
            Manage Banners
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Manage your banners here.
          </p>
        </div>
        <Button asChild>
          <Link href={`/admin/banner/new`}>Create new banner</Link>
        </Button>
      </div>
      <div className="border-t" />
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>View all banners</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={banners} />
        </CardContent>
      </Card>
    </main>
  );
};

export default ManageBanner;
