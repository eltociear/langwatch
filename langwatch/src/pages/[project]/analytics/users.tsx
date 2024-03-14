import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Container,
  GridItem,
  HStack,
  Heading,
  SimpleGrid,
  Spacer,
} from "@chakra-ui/react";
import { BarChart2 } from "react-feather";
import GraphsLayout from "~/components/GraphsLayout";
import { PeriodSelector, usePeriodSelector } from "~/components/PeriodSelector";
import {
  CustomGraph,
  type CustomGraphInput,
} from "~/components/analytics/CustomGraph";
import { SatisfactionGraphs } from "~/components/analytics/SatisfactionGraph";
import { SessionsSummary } from "~/components/analytics/SessionsSummary";
import { FilterSidebar } from "~/components/filters/FilterSidebar";
import {
  FilterToggle,
  useFilterToggle,
} from "~/components/filters/FilterToggle";

const messagesCount = {
  graphId: "custom",
  graphType: "summary",
  series: [
    {
      name: "Messages count",
      colorSet: "orangeTones",
      metric: "metadata.trace_id",
      aggregation: "cardinality",
    },
    {
      name: "Average messages per user",
      colorSet: "orangeTones",
      metric: "metadata.trace_id",
      aggregation: "cardinality",
      pipeline: {
        field: "user_id",
        aggregation: "avg",
      },
    },
    {
      name: "Users count",
      colorSet: "blueTones",
      metric: "metadata.user_id",
      aggregation: "cardinality",
    },
    {
      name: "Threads count",
      colorSet: "greenTones",
      metric: "metadata.thread_id",
      aggregation: "cardinality",
    },
    {
      name: "Average threads per user",
      colorSet: "greenTones",
      metric: "metadata.thread_id",
      aggregation: "cardinality",
      pipeline: {
        field: "user_id",
        aggregation: "avg",
      },
    },
  ],
  includePrevious: false,
  timeScale: 1,
  height: 300,
};

const userCountGrapgh = {
  graphId: "custom",
  graphType: "area",
  series: [
    {
      name: "Users count",
      colorSet: "blueTones",
      metric: "metadata.user_id",
      aggregation: "cardinality",
    },
  ],
  includePrevious: true,
  timeScale: "1",
  height: 300,
};

const dailyActiveThreads = {
  graphId: "custom",
  graphType: "area",
  series: [
    {
      name: "Threads count",
      colorSet: "greenTones",
      metric: "metadata.thread_id",
      aggregation: "cardinality",
    },
  ],
  includePrevious: true,
  timeScale: 1,
  height: 300,
};

const averageDailyThreadsPerUser = {
  graphId: "custom",
  graphType: "bar",
  series: [
    {
      name: "Average threads count per user",
      colorSet: "greenTones",
      metric: "metadata.thread_id",
      aggregation: "cardinality",
      pipeline: {
        field: "user_id",
        aggregation: "avg",
      },
    },
  ],
  includePrevious: false,
  timeScale: "1",
  height: 300,
};

const messageSentiment = {
  graphId: "custom",
  graphType: "stacked_bar",
  series: [
    {
      name: "Average messages count per user",
      colorSet: "positiveNegativeNeutral",
      metric: "metadata.trace_id",
      aggregation: "cardinality",
      pipeline: {
        field: "user_id",
        aggregation: "avg",
      },
    },
  ],
  groupBy: "sentiment.input_sentiment",
  includePrevious: false,
  timeScale: 1,
  height: 300,
};

const powerUsers = {
  graphId: "custom",
  graphType: "horizontal_bar",
  series: [
    {
      name: "Messages count",
      colorSet: "colors",
      metric: "metadata.trace_id",
      aggregation: "cardinality",
    },
  ],
  groupBy: "metadata.user_id",
  includePrevious: false,
  timeScale: "full",
  height: 300,
};

const maxMessagePerThread = {
  graphId: "custom",
  graphType: "scatter",
  series: [
    {
      name: "Maximum messages count per thread",
      colorSet: "blueTones",
      metric: "metadata.trace_id",
      aggregation: "cardinality",
      pipeline: {
        field: "thread_id",
        aggregation: "max",
      },
    },
  ],
  includePrevious: true,
  timeScale: "1",
  connected: false,
  height: 300,
};

export default function Users() {
  const {
    period: { startDate, endDate },
    setPeriod,
  } = usePeriodSelector();

  return (
    <GraphsLayout>
      <Container maxWidth={"1300"} padding={6}>
        <HStack width="full" marginBottom={3}>
          <Spacer />
          <FilterToggle />
          <PeriodSelector
            period={{ startDate, endDate }}
            setPeriod={setPeriod}
          />
        </HStack>
        <hr />
        <HStack paddingY={2} alignItems={"start"}>
          <SimpleGrid
            templateColumns="repeat(4, 1fr)"
            gap={5}
            marginTop={4}
            width={"100%"}
          >
            <GridItem colSpan={2} display={"inline-grid"}>
              <Card overflow={"scroll"}>
                <CardHeader>
                  <Heading size="sm">User Messages</Heading>
                </CardHeader>
                <CardBody>
                  <CustomGraph input={messagesCount as CustomGraphInput} />
                </CardBody>
              </Card>
            </GridItem>
            <GridItem colSpan={2} display={"inline-grid"}>
              <SessionsSummary />
            </GridItem>

            <GridItem colSpan={2} display={"inline-grid"}>
              <Card>
                <CardHeader>
                  <HStack>
                    <BarChart2 color="orange" />
                    <Heading size="sm">Daily Users</Heading>
                  </HStack>
                </CardHeader>

                <CardBody>
                  <CustomGraph input={userCountGrapgh as CustomGraphInput} />
                </CardBody>
              </Card>
            </GridItem>
            <GridItem colSpan={2} display={"inline-grid"}>
              <Card>
                <CardHeader>
                  <HStack>
                    <BarChart2 color="orange" />
                    <Heading size="sm">Daily Threads</Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <CustomGraph input={dailyActiveThreads as CustomGraphInput} />
                </CardBody>
              </Card>
            </GridItem>

            <GridItem colSpan={2} display={"inline-grid"}>
              <Card>
                <CardHeader>
                  <HStack>
                    <BarChart2 color="orange" />
                    <Heading size="sm">User Satisfaction</Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <CustomGraph input={messageSentiment as CustomGraphInput} />
                </CardBody>
              </Card>
            </GridItem>

            <GridItem colSpan={2} display={"inline-grid"}>
              <Card>
                <CardHeader>
                  <HStack>
                    <BarChart2 color="orange" />
                    <Heading size="sm">Max Messages Per Thread</Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <CustomGraph
                    input={maxMessagePerThread as CustomGraphInput}
                  />
                </CardBody>
              </Card>
            </GridItem>
            <GridItem colSpan={2} display={"inline-grid"}>
              <Card>
                <CardHeader>
                  <HStack>
                    <BarChart2 color="orange" />
                    <Heading size="sm">Average Daily Threads per User</Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <CustomGraph
                    input={averageDailyThreadsPerUser as CustomGraphInput}
                  />
                </CardBody>
              </Card>
            </GridItem>
            <GridItem colSpan={2} display={"inline-grid"}>
              <Card>
                <CardHeader>
                  <HStack>
                    <BarChart2 color="orange" />
                    <Heading size="sm">User Leaderboard</Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <CustomGraph input={powerUsers as CustomGraphInput} />
                </CardBody>
              </Card>
            </GridItem>
            <GridItem colSpan={2} display={"inline-grid"}>
              <SatisfactionGraphs />
            </GridItem>
          </SimpleGrid>
          <Box padding={3}>
            <FilterSidebar hideTopics={true} />
          </Box>
        </HStack>
      </Container>
    </GraphsLayout>
  );
}
