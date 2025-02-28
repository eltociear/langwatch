import { DownloadIcon } from "@chakra-ui/icons";
import {
  Button,
  Card,
  CardBody,
  Container,
  HStack,
  Heading,
  Skeleton,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { DatabaseSchema } from "@prisma/client";
import { useRouter } from "next/router";
import Parse from "papaparse";
import { Play } from "react-feather";
import { useDrawer } from "~/components/CurrentDrawer";
import { DashboardLayout } from "~/components/DashboardLayout";
import { useOrganizationTeamProject } from "~/hooks/useOrganizationTeamProject";
import { api } from "~/utils/api";
import { displayName } from "~/utils/datasets";

export default function Dataset() {
  const router = useRouter();
  const { project } = useOrganizationTeamProject();
  const dataSetId = router.query.id;
  const { openDrawer } = useDrawer();

  const dataset = api.datasetRecord.getAll.useQuery(
    { projectId: project?.id ?? "", datasetId: dataSetId as string },
    {
      enabled: !!project,
    }
  );

  const getHeaders = (schema: DatabaseSchema) => {
    let headers: string[] = [];

    if (
      schema === DatabaseSchema.STRING_I_O ||
      schema === DatabaseSchema.LLM_CHAT_CALL
    ) {
      headers = ["Input", "Expected Output", "Created at", "Updated at"];
    } else if (schema === DatabaseSchema.FULL_TRACE) {
      headers = [
        "Input",
        "Expected Output",
        "Spans",
        "Created at",
        "Updated at",
      ];
    }

    return (
      <Tr>
        {headers.map((header, index) => (
          <Th key={index}>{header}</Th>
        ))}
      </Tr>
    );
  };

  const getTableRows = (datasetRecord: any, schema: DatabaseSchema) => {
    let tableRows: any[] = [];

    if (
      schema === DatabaseSchema.STRING_I_O ||
      schema === DatabaseSchema.LLM_CHAT_CALL
    ) {
      tableRows = [
        getInput(datasetRecord, schema),
        getOutput(datasetRecord, schema),
      ];
    }
    if (schema === DatabaseSchema.FULL_TRACE) {
      tableRows = [
        getInput(datasetRecord, schema),
        getOutput(datasetRecord, schema),
        getTrace(datasetRecord, schema),
      ];
    }

    return (
      <>
        {tableRows.map((data, index) => (
          <Td key={index}>
            <Tooltip label={data}>
              <Text noOfLines={1} display="block" maxWidth="300px">
                {data}
              </Text>
            </Tooltip>
          </Td>
        ))}
      </>
    );
  };

  const getInput = (datasetRecord: any, schema: DatabaseSchema) => {
    if (schema === DatabaseSchema.LLM_CHAT_CALL) {
      return JSON.stringify(datasetRecord.entry.input[0]) ?? "";
    }
    if (
      schema === DatabaseSchema.STRING_I_O ||
      schema === DatabaseSchema.FULL_TRACE
    ) {
      return datasetRecord.entry.input;
    }
  };

  const getOutput = (dataset: any, schema: DatabaseSchema) => {
    if (schema === DatabaseSchema.LLM_CHAT_CALL) {
      return JSON.stringify(dataset.entry.expected_output[0]) ?? "";
    }
    if (
      schema === DatabaseSchema.STRING_I_O ||
      schema === DatabaseSchema.FULL_TRACE
    ) {
      return dataset.entry.expected_output;
    }
  };

  const getTrace = (dataset: any, schema: DatabaseSchema) => {
    if (schema === DatabaseSchema.FULL_TRACE) {
      return JSON.stringify(dataset.entry.spans) ?? "";
    }
    return "";
  };

  const downloadCSV = (schema: DatabaseSchema) => {
    let fields: string[] = [];

    if (
      schema === DatabaseSchema.STRING_I_O ||
      schema === DatabaseSchema.LLM_CHAT_CALL
    ) {
      fields = ["Input", "Expected Output", "Created at", "Updated at"];
    } else if (schema === DatabaseSchema.FULL_TRACE) {
      fields = [
        "Input",
        "Expected Output",
        "Spans",
        "Created at",
        "Updated at",
      ];
    }

    type CsvDataRow =
      | [string, string, string, string]
      | [string, string, string, string, string];

    const csvData: CsvDataRow[] = [];

    dataset.data?.datasetRecords.forEach((record) => {
      if (
        schema === DatabaseSchema.STRING_I_O ||
        schema === DatabaseSchema.LLM_CHAT_CALL
      ) {
        csvData.push([
          getInput(record, dataset.data!.schema),
          getOutput(record, dataset.data!.schema),
          new Date(record.createdAt).toLocaleString(),
          new Date(record.updatedAt).toLocaleString(),
        ]);
      } else {
        csvData.push([
          getInput(record, dataset.data!.schema),
          getOutput(record, dataset.data!.schema),
          getTrace(record, dataset.data!.schema),
          new Date(record.createdAt).toLocaleString(),
          new Date(record.updatedAt).toLocaleString(),
        ]);
      }
    });

    const csv = Parse.unparse({
      fields: fields,
      data: csvData,
    });

    const url = window.URL.createObjectURL(new Blob([csv]));

    const link = document.createElement("a");
    link.href = url;
    const fileName = `${dataset.data?.name}.csv`;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <DashboardLayout>
      <Container maxW={"calc(100vw - 200px)"} padding={6} marginTop={8}>
        <HStack width="full" verticalAlign={"middle"} paddingBottom={6}>
          <Heading as={"h1"} size="lg">
            Dataset {`- ${dataset.data?.name ?? ""}`}
          </Heading>
          <Text
            whiteSpace="nowrap"
            bg="gray.200"
            paddingX="2"
            paddingY="1"
            borderRadius="lg"
            fontSize={12}
            marginLeft={4}
          >
            {dataset.data ? displayName(dataset.data?.schema) : ""}
          </Text>
          <Spacer />
          <Button
            colorScheme="black"
            minWidth="fit-content"
            variant="ghost"
            onClick={() =>
              dataset.data?.schema && downloadCSV(dataset.data.schema)
            }
          >
            Export <DownloadIcon marginLeft={2} />
          </Button>
          <Button
            colorScheme="blue"
            onClick={() => {
              openDrawer("batchEvaluation", {
                datasetSlug: dataset.data?.slug,
              });
            }}
            minWidth="fit-content"
            leftIcon={<Play height={16} />}
          >
            Batch Evaluation
          </Button>
        </HStack>
        <Card>
          <CardBody>
            {dataset.data && dataset.data.datasetRecords.length == 0 ? (
              <Text>No data found</Text>
            ) : (
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    {dataset.data?.schema && getHeaders(dataset.data.schema)}
                  </Thead>
                  <Tbody>
                    {dataset.isLoading
                      ? Array.from({ length: 3 }).map((_, i) => (
                          <Tr key={i}>
                            {Array.from({ length: 4 }).map((_, i) => (
                              <Td key={i}>
                                <Skeleton height="20px" />
                              </Td>
                            ))}
                          </Tr>
                        ))
                      : dataset.data
                      ? dataset.data.datasetRecords?.map((datasetRecord) => (
                          <Tr key={datasetRecord.id}>
                            {getTableRows(datasetRecord, dataset.data!.schema)}
                            <Td>
                              {new Date(
                                datasetRecord.createdAt
                              ).toLocaleString()}
                            </Td>
                            <Td>
                              {new Date(
                                datasetRecord.updatedAt
                              ).toLocaleString()}
                            </Td>
                          </Tr>
                        ))
                      : null}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </CardBody>
        </Card>
      </Container>
    </DashboardLayout>
  );
}
