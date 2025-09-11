import { BannerForm } from "@/components/home/banner-form";

const NewBanner = () => {
  return (
    <main className="space-y-8">
      <div>
        <h1 className="text-3xl font-light">Create New Banner</h1>
        <p className="text-muted-foreground mt-1 font-light">
          Create a new banner here.
        </p>
      </div>
      <BannerForm />
    </main>
  );
};

export default NewBanner;
