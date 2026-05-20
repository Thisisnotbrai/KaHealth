"use client";
import React, { useEffect, useMemo, useState } from "react";
import FamilyCards from "@/components/Dashboard/FamilyCards";
import FamilyPieChart from "@/components/Dashboard/FamilyPieChart";
import { GET_FAMILIES } from "@/app/lib/graphql/familyQueries";
import { GET_USERS } from "@/app/lib/graphql/userQueries";
import { useQuery } from "@apollo/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Family } from "@/types/familyTypes";
import Activities from "@/components/Dashboard/Activities";
import { User } from "@/types/userTypes";
import { GET_ACTIVITIES } from "@/app/lib/graphql/activityQueries";
import { GET_MEDICINES } from "@/app/lib/graphql/medicineQueries";
import { Activity } from "@/types/activityTypes";
import MedicineStockChart from "@/components/Dashboard/MedicineStockChart";
import { Medicine } from "@/types/medicineTypes";

const parseDate = (value?: string | number | Date): Date | null => {
  if (!value) return null;

  if (typeof value === "number" || typeof value === "string") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }

  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  return null;
};

const formatDateTime = (timestamp: string | number) => {
  if (!timestamp) return "—";
  const date = new Date(Number(timestamp));
  if (isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const isSameMonth = (date: Date, month: number, year: number) =>
  date.getMonth() === month && date.getFullYear() === year;

const DashboardPage = () => {
  const {
    data: familiesData,
    loading: familiesLoading,
    error,
  } = useQuery(GET_FAMILIES);
  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS);
  const { data: activitiesData } = useQuery(GET_ACTIVITIES);
  const { data: medicinesData, loading: medicinesLoading } =
    useQuery(GET_MEDICINES);
  const medicines = medicinesData?.medicines || [];
  const loading = familiesLoading || usersLoading;
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setIsAdmin(role === "1");
  }, []);

  const userMap = useMemo(() => {
    if (!usersData?.users) return {};
    const map = usersData.users.reduce(
      (acc: Record<string, string>, user: User & { _id?: string }) => {
        const key = user._id ?? user.id;
        if (key) {
          acc[key] = user.name?.trim() || "Unnamed";
        }
        return acc;
      },
      {}
    );

    return map;
  }, [usersData]);

  const medicineStockData = medicines.map((m: Medicine) => ({
    name: m.name,
    stock: m.stock ?? 0, // adjust property name depending on your schema
  }));

  const stats = useMemo(() => {
    const families: Family[] = familiesData?.families || [];
    const nonArchived = families.filter((f: Family) => f.archive === false);

    const totalFamilies = nonArchived.length;
    const activeFamilies = nonArchived.filter(
      (f: Family) => f.status === "active"
    ).length;
    const pendingRenewals = nonArchived.filter(
      (f: Family) => f.status === "pending"
    ).length;
    const totalMembers = nonArchived.reduce((sum: number, f: Family) => {
      const membersCount = Array.isArray(f.members)
        ? f.members.length
        : typeof f.members === "string"
        ? parseInt(f.members || "0", 10) || 0
        : 0;
      return sum + membersCount;
    }, 0);

    const lastMonthNonArchived = families.filter((f: Family) => {
      if (f.archive === true) return false;
      const d = parseDate(f.createdAt);
      if (!d) return false;
      return isSameMonth(d, lastMonth, lastMonthYear);
    });

    const totalFamiliesLastMonth = lastMonthNonArchived.length;
    const activeFamiliesLastMonth = lastMonthNonArchived.filter(
      (f: Family) => f.status === "active"
    ).length;
    const pendingRenewalsLastMonth = lastMonthNonArchived.filter(
      (f: Family) => f.status === "pending"
    ).length;
    const totalMembersLastMonth = lastMonthNonArchived.reduce(
      (sum: number, f: Family) => {
        const membersCount = Array.isArray(f.members)
          ? f.members.length
          : typeof f.members === "string"
          ? parseInt(f.members || "0", 10) || 0
          : 0;
        return sum + membersCount;
      },
      0
    );

    return {
      totalFamilies,
      totalFamiliesLastMonth,
      activeFamilies,
      activeFamiliesLastMonth,
      pendingRenewals,
      pendingRenewalsLastMonth,
      totalMembers,
      totalMembersLastMonth,
      nonArchived, // for pie chart
    };
  }, [familiesData, lastMonth, lastMonthYear]);

  if (error) return <p>Error fetching families</p>;

  // Fetch activities to show activity logs
  const activities = activitiesData?.activities || [];

  // Sort from latest (newest) to oldest
  const sortedActivities = [...activities].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt)
  );

  // Limit to only the latest 10
  const recentActivities = sortedActivities.slice(0, 10);

  return (
    <div className="container mx-auto py-10 space-y-8">
      {loading ? (
        // Skeletons for FamilyCards
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} className="p-4 space-y-3 shadow-sm">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-1/4" />
            </Card>
          ))}
        </div>
      ) : (
        <FamilyCards
          totalFamilies={stats.totalFamilies}
          totalFamiliesLastMonth={stats.totalFamiliesLastMonth}
          activeFamilies={stats.activeFamilies}
          activeFamiliesLastMonth={stats.activeFamiliesLastMonth}
          pendingRenewals={stats.pendingRenewals}
          pendingRenewalsLastMonth={stats.pendingRenewalsLastMonth}
          totalMembers={stats.totalMembers}
          totalMembersLastMonth={stats.totalMembersLastMonth}
        />
      )}

      {/* Pie Chart + Recent Activities Section */}
      <div className="flex flex-col lg:flex-row lg:gap-6 mt-8">
        {/* Pie Chart */}
        <div className={`flex-1 mb-6 lg:mb-0`}>
          {loading ? (
            <Card className="flex flex-col p-6 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-left">
                  <Skeleton className="h-6 w-48" />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Skeleton className="h-[200px] w-[200px] rounded-full" />
              </CardContent>
            </Card>
          ) : (
            <FamilyPieChart data={stats.nonArchived} />
          )}
        </div>

        {/* Medicine Stock Graph */}
        <div className="flex-1 mb-6 lg:mb-0">
          {medicinesLoading ? (
            <Card className="flex flex-col p-6 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-left">
                  <Skeleton className="h-6 w-48" />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Skeleton className="h-[200px] w-[200px] rounded-full" />
              </CardContent>
            </Card>
          ) : (
            <MedicineStockChart data={medicineStockData} />
          )}
        </div>

        {/* Recent Activities */}
        {isAdmin && (
          <div className="flex-1">
            {loading ? (
              <div className="shadow-md rounded-xl p-6 space-y-4 bg-card">
                <Skeleton className="h-6 w-48" />
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                ))}
              </div>
            ) : (
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold">
                    Recent Activities
                  </CardTitle>
                </CardHeader>
                <CardContent className="overflow-y-auto max-h-[400px] space-y-3">
                  {recentActivities.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No recent activities yet.
                    </p>
                  ) : (
                    recentActivities.map((activity: Activity) => (
                      <Activities
                        key={activity.id}
                        id={activity.id}
                        user_id={activity.user_id}
                        user_name={userMap[activity.user_id] || "Unknown User"}
                        desc={activity.desc}
                        createdAt={formatDateTime(activity.createdAt)}
                      />
                    ))
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
user.name