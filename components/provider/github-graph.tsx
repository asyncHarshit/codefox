"use client";
import React from "react";
import { ActivityCalendar } from "react-activity-calendar";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { getContributionStats } from "@/module/dashboard/actions/indes";

const ContributionGraphClient = () => {
  const { theme } = useTheme();
  const { data, isLoading } = useQuery({
    queryKey: ["contribution-graph"],
    queryFn: async () => await getContributionStats(),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }
  if (!data || data.contributions.length === 0) {
    return <div className="p-6">No contribution data available.</div>;
  }

  return (
    <>
      <ActivityCalendar
        data={data.contributions}
        colorScheme={theme === "dark" ? "dark" : "light"}
        blockSize={12.5}
        blockMargin={5}
        fontSize={14}
        showMonthLabels
        showWeekdayLabels
        theme={{
          light: ["#f5f5f5", "#ffd4a3", "#ffb366", "#ff9933", "#ff7700"],
          dark: ["#1a1a1a", "#4a3420", "#6b4a2a", "#ff9933", "#ffb366"],
        }}
        renderBlock={(block, activity) => {
          const date = new Date(activity.date);
          const formattedDate = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          
          return (
            <rect
              {...block.props}
              data-tooltip-id="contribution-tooltip"
              data-tooltip-content={`${activity.count} contribution${
                activity.count !== 1 ? "s" : ""
              } on ${formattedDate}`}
            />
          );
        }}
      />
      <Tooltip 
        id="contribution-tooltip"
        place="top"
        className="contribution-tooltip"
      />
    </>
  );
};

export default ContributionGraphClient;