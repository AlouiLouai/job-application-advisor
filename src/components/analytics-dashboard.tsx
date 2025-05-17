"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, RefreshCw, AlertTriangle } from 'lucide-react';

type Stats = {
  activeUsers: string;
  coverLettersGenerated: string;
  cvImprovementsSuggested: string;
};

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/stats");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to fetch stats");
      }

      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError(err instanceof Error ? err.message : "Could not load analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Set up polling to refresh stats every minute
    const intervalId = setInterval(fetchStats, 60000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading && !stats) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-center justify-center mb-2">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <p className="font-medium">Error loading analytics</p>
        </div>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.activeUsers || "0"}</div>
          <p className="text-xs text-muted-foreground">Users in the last 30 minutes</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cover Letters</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.coverLettersGenerated || "0"}</div>
          <p className="text-xs text-muted-foreground">Total cover letters generated</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">CV Improvements</CardTitle>
          <RefreshCw className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.cvImprovementsSuggested || "0"}</div>
          <p className="text-xs text-muted-foreground">Total CV improvements suggested</p>
        </CardContent>
      </Card>
    </div>
  );
}