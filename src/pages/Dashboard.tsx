import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Dashboard = () => {
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Your Listings</CardTitle>
            <CardDescription>
              Manage your property listings and view their performance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>You have no listings yet.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
