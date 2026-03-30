import { makeTransactionTestBuilder } from "~~/test-utils/playwright/utils/helpers/finance";

const testBuilder = makeTransactionTestBuilder("patch");

testBuilder
    .returnsA401StatusCodeWhenAnUnauthenticatedRequestIsMade()
    .returnsA400StatusCodeWhenTheProvidedIdHasTheWrongFormat()
    .returnsA404StatusCodeWhenTheProvidedIdIsUnknown()
    .onlySoftDeletesTheRequestedResource()
    .onlyAllowsPatchingTheDeletedProperty()
    .onlyAllowsAUserToSoftDeleteTheirOwnResources()
    .allowsUndoingADelete()
    .rejectsAnOperationOnASubResourceOwnedByAnotherUsersParentResource()
    .rejectsAnOperationOnASubResourceOnANonExistentParentResource()
    .rejectsAnOperationOnASubResourceWhenTheParentResourceIsNotAssociated()
    .build();
