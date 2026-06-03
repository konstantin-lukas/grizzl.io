import { makePresetTestBuilder } from "~~/test-utils/playwright/builders/todo";

const testBuilder = makePresetTestBuilder("get-collection");

testBuilder
    .returnsA401StatusCodeWhenAnUnauthenticatedRequestIsMade()
    .returnsAnEmptyArrayWhenThereAreNoResources()
    .doesNotReturnResourcesOfOtherUsers()
    .allowsRetrievingAListOfResourcesSortedBy("title", "asc")
    .doesNotReturnSoftDeletedResources()
    .doesNotReturnSubResourcesBelongingToOtherResources("title", "asc")
    .doesNotReturnSubResourcesOfSoftDeletedResources()
    .build();
