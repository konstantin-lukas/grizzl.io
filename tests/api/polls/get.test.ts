import { makePollTestBuilder } from "~~/test-utils/playwright/builders/poll";

const testBuilder = makePollTestBuilder("get-collection");

testBuilder
    .returnsA401StatusCodeWhenAnUnauthenticatedRequestIsMade()
    .returnsAnEmptyArrayWhenThereAreNoResources()
    .doesNotReturnResourcesOfOtherUsers()
    .allowsRetrievingAListOfResourcesSortedBy()
    .doesNotReturnSoftDeletedResources()
    .build();
