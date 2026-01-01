import { getUser } from "@/lib/controller/user/userOperations";
import SearchBar from "./search-bar";
import Link from "next/link";

export const LandingPageLarge = async () => {
  let userName = "Guest";
  try {
    const { user } = await getUser();
    if (user) {
      userName = user.user_metadata.full_name;
    }
  } catch (error) {}

  return (
    <div className="mt-12 space-y-6">
      <main className="py-12 space-y-4">
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
          NEW GEN B2B SOURCING PLATFORM
        </h1>
        <SearchBar />
      </main>
      <section className="bg-muted py-6">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Welcome to OpenXmart, {userName}
          </h4>
          <div className="flex items-center gap-8 font-semibold">
            <p>ITEM1</p>
            <p>ITEM1</p>
            <p>ITEM1</p>
          </div>
        </div>
      </section>
      <section>
        <div className="h-72 grid grid-cols-5 w-full max-w-7xl mx-auto gap-2">
          <div className="w-full bg-muted rounded-lg overflow-scroll flex flex-col">
            <Link className="w-full p-2 hover:bg-background" href={"#"}>
              Category 1
            </Link>
            <Link className="w-full p-2 hover:bg-background" href={"#"}>
              Category 2
            </Link>
            <Link className="w-full p-2 hover:bg-background" href={"#"}>
              Category 3
            </Link>
            <Link className="w-full p-2 hover:bg-background" href={"#"}>
              Category 4
            </Link>
            <Link className="w-full p-2 hover:bg-background" href={"#"}>
              Category 5
            </Link>
            <Link className="w-full p-2 hover:bg-background" href={"#"}>
              Category 6
            </Link>
            <Link className="w-full p-2 hover:bg-background" href={"#"}>
              Category 7
            </Link>
            <Link className="w-full p-2 hover:bg-background" href={"#"}>
              Category 8
            </Link>
          </div>
          <div className="w-full h-full rounded-lg col-span-3 flex gap-2 overflow-x-scroll">
            <div className="w-64 min-w-64 h-full bg-muted rounded-lg p-4 flex flex-col">
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                Frequently searched
              </h4>
              <p className="leading-7">Drone accessories</p>
              <div className="flex-1 w-full bg-red-500/20 rounded-lg" />
            </div>

            <div className="w-64 min-w-64 h-full bg-muted rounded-lg p-4 flex flex-col">
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                Frequently searched
              </h4>
              <p className="leading-7">Drone accessories</p>
              <div className="flex-1 w-full bg-red-500/20 rounded-lg" />
            </div>

            <div className="w-64 min-w-64 h-full bg-muted rounded-lg p-4 flex flex-col">
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                Frequently searched
              </h4>
              <p className="leading-7">Drone accessories</p>
              <div className="flex-1 w-full bg-red-500/20 rounded-lg" />
            </div>

            <div className="w-64 min-w-64 h-full bg-muted rounded-lg p-4 flex flex-col">
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                Frequently searched
              </h4>
              <p className="leading-7">Drone accessories</p>
              <div className="flex-1 w-full bg-red-500/20 rounded-lg" />
            </div>
          </div>
          <div className="w-full bg-muted rounded-lg flex items-center justify-center">
            Show offers here
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section>
        <div className="w-full max-w-7xl mx-auto bg-muted rounded-lg px-4 py-6 space-y-2">
          <div className="flex justify-between">
            <div>
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                New Arrivals
              </h3>
              <p className="text-muted-foreground text-sm">
                Recently listed products from verified suppliers.
              </p>
            </div>
            <Link href="#">More {">"}</Link>
          </div>
          <div className="flex gap-4 overflow-x-scroll">
            <div className="bg-background rounded-lg aspect-square w-64"></div>
            <div className="bg-background rounded-lg aspect-square w-64"></div>
            <div className="bg-background rounded-lg aspect-square w-64"></div>
            <div className="bg-background rounded-lg aspect-square w-64"></div>
            <div className="bg-background rounded-lg aspect-square w-64"></div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section>
        <div className="w-full max-w-7xl mx-auto bg-muted rounded-lg px-4 py-6 space-y-2">
          <div className="flex justify-between">
            <div>
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Best Sellers
              </h3>
              <p className="text-muted-foreground text-sm">
                High-demand products with consistent order volume.
              </p>
            </div>
            <Link href="#">More {">"}</Link>
          </div>
          <div className="flex gap-4 overflow-x-scroll">
            <div className="bg-background rounded-lg aspect-square w-64"></div>
            <div className="bg-background rounded-lg aspect-square w-64"></div>
            <div className="bg-background rounded-lg aspect-square w-64"></div>
            <div className="bg-background rounded-lg aspect-square w-64"></div>
            <div className="bg-background rounded-lg aspect-square w-64"></div>
          </div>
        </div>
      </section>

      {/* Frequently Searched */}
      <section>
        <div className="w-full max-w-7xl mx-auto bg-muted rounded-lg px-4 py-6 space-y-2">
          <div className="flex justify-between">
            <div>
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Frequently Searched
              </h3>
              <p className="text-muted-foreground text-sm">
                Products buyers actively search for.
              </p>
            </div>
            <Link href="#">More {">"}</Link>
          </div>
          <div className="flex gap-4 overflow-x-scroll">
            <div className="bg-background rounded-lg aspect-square w-64"></div>
            <div className="bg-background rounded-lg aspect-square w-64"></div>
            <div className="bg-background rounded-lg aspect-square w-64"></div>
            <div className="bg-background rounded-lg aspect-square w-64"></div>
            <div className="bg-background rounded-lg aspect-square w-64"></div>
          </div>
        </div>
      </section>

      {/* Verified Suppliers */}
      <section>
        <div className="w-full max-w-7xl mx-auto bg-muted rounded-lg px-4 py-6 space-y-2">
          <div className="flex justify-between">
            <div>
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Verified Suppliers
              </h3>
              <p className="text-muted-foreground text-sm">
                Trusted suppliers vetted for compliance and reliability.
              </p>
            </div>
            <Link href="#">More {">"}</Link>
          </div>
          <div className="flex gap-4 overflow-x-scroll">
            <div className="bg-background rounded-lg aspect-square w-64"></div>
            <div className="bg-background rounded-lg aspect-square w-64"></div>
            <div className="bg-background rounded-lg aspect-square w-64"></div>
            <div className="bg-background rounded-lg aspect-square w-64"></div>
            <div className="bg-background rounded-lg aspect-square w-64"></div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-5 gap-4">
          {Array.from({ length: 30 }).map((_, idx) => (
            <ProductCard key={idx} />
          ))}
        </div>
      </section>
    </div>
  );
};

const ProductCard = () => {
  return (
    <div className="bg-background rounded-lg w-64 p-2">
      <div className="aspect-square w-full bg-muted rounded-lg"></div>
      <p>Item</p>
      <p>Some content</p>
    </div>
  );
};
