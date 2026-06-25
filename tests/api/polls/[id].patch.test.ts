import { makePollTestBuilder } from "~~/test-utils/playwright/builders/poll";

const testBuilder = makePollTestBuilder("patch");

testBuilder
    .returnsA404StatusCodeWhenTheProvidedIdIsUnknown()
    .returnsA400StatusCodeWhenTheProvidedIdHasTheWrongFormat()
    .returnsA401StatusCodeWhenAnUnauthenticatedRequestIsMade()
    .onlyAllowsAUserToSoftDeleteTheirOwnResources()
    .onlyAllowsPatchingTheDeletedProperty()
    .onlySoftDeletesTheRequestedResource()
    .allowsUndoingADelete()
    .build();
