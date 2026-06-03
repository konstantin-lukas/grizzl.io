import { makeTimerTestBuilder } from "~~/test-utils/playwright/builders/timer";

const testBuilder = makeTimerTestBuilder("get-collection");

testBuilder
    .returnsA401StatusCodeWhenAnUnauthenticatedRequestIsMade()
    .returnsAnEmptyArrayWhenThereAreNoResources()
    .doesNotReturnResourcesOfOtherUsers()
    .allowsRetrievingAListOfResourcesSortedBy()
    .doesNotReturnSoftDeletedResources()
    .build();
