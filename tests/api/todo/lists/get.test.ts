import { makeTodoListTestBuilder } from "~~/test-utils/playwright/builders/todo";

const testBuilder = makeTodoListTestBuilder("get-collection");

testBuilder
    .returnsA401StatusCodeWhenAnUnauthenticatedRequestIsMade()
    .returnsAnEmptyArrayWhenThereAreNoResources()
    .doesNotReturnResourcesOfOtherUsers()
    .allowsRetrievingAListOfResourcesSortedByCreationDate()
    .doesNotReturnSoftDeletedResources()
    .build();
