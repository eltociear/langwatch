import { checkUserPermissionForProject } from "../../permission";
import { protectedProcedure } from "../../trpc";
import {
  currentVsPreviousTracesAggregation,
  groupedTracesAggregation,
  sharedAnalyticsFilterInput,
  sharedAnalyticsFilterInputWithAggregations,
} from "./common";

export const messagesCountVsPreviousPeriod = protectedProcedure
  .input(sharedAnalyticsFilterInput)
  .use(checkUserPermissionForProject)
  .query(async ({ input }) => {
    return await currentVsPreviousTracesAggregation<{ count: number }>(
      {
        input,
        aggs: {
          count: { value_count: { field: "id" } },
        },
      }
    );
  });

export const messagesCountAggregated = protectedProcedure
  .input(sharedAnalyticsFilterInputWithAggregations)
  .use(checkUserPermissionForProject)
  .query(async ({ input }) => {
    return await groupedTracesAggregation<{ count: number }>({
      input,
      aggs: {
        count: { value_count: { field: "id" } },
      },
    });
  });
