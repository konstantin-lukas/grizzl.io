import { makeAutoTransactionTestBuilder } from "~~/test-utils/playwright/builders/finance";

const testBuilder = makeAutoTransactionTestBuilder("patch");

testBuilder
    .returnsA404StatusCodeWhenTheProvidedIdIsUnknown()
    .returnsA400StatusCodeWhenTheProvidedIdHasTheWrongFormat()
    .returnsA401StatusCodeWhenAnUnauthenticatedRequestIsMade()
    .onlySoftDeletesTheRequestedResource()
    .onlyAllowsPatchingTheDeletedProperty()
    .onlyAllowsAUserToSoftDeleteTheirOwnResources()
    .allowsUndoingADelete()
    .rejectsAnOperationOnASubResourceOwnedByAnotherUsersParentResource()
    .rejectsAnOperationOnASubResourceWhenTheParentResourceIsNotAssociated()
    .rejectsAnOperationOnASubResourceOnANonExistentParentResource()
    .build();
