import { makeAutoTransactionTestBuilder } from "~~/test-utils/playwright/utils/helpers/finance";

const testBuilder = makeAutoTransactionTestBuilder("get-collection");

testBuilder
    .returnsA401StatusCodeWhenAnUnauthenticatedRequestIsMade()
    .returnsAnEmptyArrayWhenThereAreNoResources()
    .doesNotReturnResourcesOfOtherUsers()
    .doesNotReturnSoftDeletedResources()
    .allowsRetrievingAListOfResourcesSortedByCreationDate()
    .doesNotReturnSubResourcesBelongingToOtherResources()
    .doesNotReturnSubResourcesOfSoftDeletedResources()
    .build();
