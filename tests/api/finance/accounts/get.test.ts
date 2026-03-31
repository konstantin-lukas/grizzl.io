import { makeAccountTestBuilder } from "~~/test-utils/playwright/builders/finance";

const testBuilder = makeAccountTestBuilder("get-collection");

testBuilder
    .returnsA401StatusCodeWhenAnUnauthenticatedRequestIsMade()
    .returnsAnEmptyArrayWhenThereAreNoResources()
    .doesNotReturnResourcesOfOtherUsers()
    .doesNotReturnSoftDeletedResources()
    .allowsRetrievingAListOfResourcesSortedByCreationDate()
    .build();
