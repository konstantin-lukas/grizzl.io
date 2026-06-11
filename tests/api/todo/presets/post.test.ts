import { makePresetTestBuilder } from "~~/test-utils/playwright/builders/todo";

const testBuilder = makePresetTestBuilder("post");

testBuilder
    .returnsA401StatusCodeWhenAnUnauthenticatedRequestIsMade()
    .rejectsAnOperationOnASubResourceOwnedByAnotherUsersParentResource()
    .rejectsAnOperationOnASubResourceOnANonExistentParentResource()
    .rejectsRequestsWhenPayloadIsInvalid()
    .acceptsRequestsWhenPayloadIsValid()
    .build();
