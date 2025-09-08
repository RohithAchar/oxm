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
    <div className="space-y-8 mx-auto max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light">Manage Banner</h1>
          <p className="text-muted-foreground mt-1 font-light">
            Manage your banners here.
          </p>
        </div>
        <Button asChild variant={"link"}>
          <Link href={`/admin/banner/new`}>Create new banner</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>View all banners</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={banners} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageBanner;
